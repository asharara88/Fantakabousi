import { createClient } from 'npm:@supabase/supabase-js@2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
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
    const { data: healthData, error: healthError } = await supabaseClient
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(10)

    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // Build context for AI
    const healthContext = healthData?.map(metric => 
      `${metric.metric_type}: ${metric.value} ${metric.unit} (${new Date(metric.timestamp).toLocaleDateString()})`
    ).join('\n') || 'No recent health data available'

    const userContext = profileData ? `
User Profile:
- Name: ${profileData.first_name || 'Not specified'}
- Email: ${profileData.email || 'Not specified'}
- Onboarding: ${profileData.onboarding_completed ? 'Complete' : 'Pending'}
` : 'No profile data available'

    const systemPrompt = `You are a personal AI wellness coach on the Biowell platform. You have access to the user's health data and provide personalized recommendations for their wellness journey.

User's Current Context:
${userContext}

Recent Health Data:
${healthContext}

Guidelines for responses:
1. Be conversational, supportive, and evidence-based
2. Reference their specific health data when relevant
3. Focus on actionable recommendations for their health goals
4. Consider the interconnection between different health metrics
5. Suggest specific protocols, supplements, or lifestyle changes
6. Keep responses concise but comprehensive (2-3 paragraphs max)
7. Always prioritize safety and suggest medical consultation when appropriate


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
      throw new Error(\`OpenAI API error: ${openaiResponse.status}`)
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
  }
}
)