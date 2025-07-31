import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, userId, sessionId } = await req.json()

    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user's health data for context
    const { data: healthData } = await supabaseClient
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(10)

    const { data: profileData } = await supabaseClient
      .from('user_profile_signin')
      .select('*')
      .eq('id', userId)
      .single()

    // Build context for AI
    const healthContext = healthData?.map(metric => 
      `${metric.metric_type}: ${metric.value} ${metric.unit} (${new Date(metric.timestamp).toLocaleDateString()})`
    ).join('\n') || 'No recent health data available'

    const userContext = profileData ? `
User Profile:
- Age: ${profileData.age || 'Not specified'}
- Gender: ${profileData.gender || 'Not specified'}
- Primary Goals: ${profileData.primary_health_goals?.join(', ') || 'Not specified'}
- Activity Level: ${profileData.activity_level || 'Not specified'}
- Health Concerns: ${profileData.health_concerns?.join(', ') || 'None specified'}
` : 'No profile data available'

    const systemPrompt = `You are Ahmed's personal AI wellness coach on the Biowell platform. You have access to his comprehensive health data and are helping him optimize his fertility, muscle building, and sleep quality while managing his insulin resistance.

User's Health Profile:
- Primary Goals: Fertility optimization, muscle building, sleep improvement
- Key Challenges: Insulin resistance, sleep optimization, fitness goals
- Health Metrics: Available from connected devices and manual logs

Recent Health Data:
${healthContext}

${userContext}

Guidelines for responses:
1. Be conversational, supportive, and evidence-based
2. Reference his specific health data when relevant
3. Focus on actionable recommendations for his three main goals
4. Consider the interconnection between metabolic health, fertility, and sleep
5. Suggest specific protocols, supplements, or lifestyle changes
6. Keep responses concise but comprehensive (2-3 paragraphs max)
7. Always prioritize safety and suggest medical consultation when appropriate

Respond as a knowledgeable wellness coach who understands the user's unique health profile and goals.`

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiData = await openaiResponse.json()
    const aiResponse = openaiData.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // Save conversation to database
    await supabaseClient.from('chat_history').insert([
      {
        user_id: userId,
        session_id: sessionId,
        message: message,
        response: aiResponse,
        role: 'user',
        timestamp: new Date().toISOString()
      },
      {
        user_id: userId,
        session_id: sessionId,
        message: aiResponse,
        response: '',
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
    ])

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in openai-chat function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})