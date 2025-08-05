import { createClient } from 'npm:@supabase/supabase-js@2'

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
        JSON.stringify({ 
          error: 'Missing required fields',
          details: 'message and userId are required'
        }),
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
      .limit(20)

    const { data: profileData } = await supabaseClient
      .from('user_profile_signin')
      .select('*')
      .eq('id', userId)
      .single()

    const { data: recentChats } = await supabaseClient
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(10)

    // Build comprehensive context for AI
    const healthContext = healthData?.map(metric => 
      `${metric.metric_type}: ${metric.value} ${metric.unit} (${new Date(metric.timestamp).toLocaleDateString()})`
    ).join('\n') || 'No recent health data available'

    const userContext = profileData ? `
User Profile:
- Name: ${profileData.first_name || 'Not specified'} ${profileData.last_name || ''}
- Age: ${profileData.age || 'Not specified'}
- Gender: ${profileData.gender || 'Not specified'}
- Activity Level: ${profileData.activity_level || 'Not specified'}
- Primary Health Goals: ${profileData.primary_health_goals?.join(', ') || 'Not specified'}
- Health Concerns: ${profileData.health_concerns?.join(', ') || 'None specified'}
- Current Supplements: ${profileData.current_supplements?.join(', ') || 'None'}
- Medical Conditions: ${profileData.medical_conditions?.join(', ') || 'None'}
` : 'No profile data available'

    const chatContext = recentChats?.slice(0, 5).map(chat => 
      `${chat.role}: ${chat.message}`
    ).join('\n') || 'No recent conversation history'

    const systemPrompt = `You are a personal AI wellness coach on the Biowell platform. You have access to the user's comprehensive health data and provide personalized, evidence-based recommendations.

User's Current Context:
${userContext}

Recent Health Data:
${healthContext}

Recent Conversation Context:
${chatContext}

Guidelines for responses:
1. Be conversational, supportive, and evidence-based
2. Reference their specific health data when relevant
3. Focus on actionable recommendations for their health goals
4. Consider the interconnection between different health metrics
5. Suggest specific protocols, supplements, or lifestyle changes
6. Keep responses concise but comprehensive (2-3 paragraphs max)
7. Always prioritize safety and suggest medical consultation when appropriate
8. Use their name when available to personalize the response
9. Build on previous conversation context when relevant
10. Provide specific, measurable recommendations with timelines

Remember: You're helping optimize their health journey with personalized, data-driven insights.`

    // Call OpenAI API with enhanced error handling
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
        max_tokens: 600,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error('OpenAI API error:', openaiResponse.status, errorData)
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiData = await openaiResponse.json()
    const aiResponse = openaiData.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // Create or get session
    let currentSessionId = sessionId
    if (!currentSessionId) {
      const { data: newSession, error: sessionError } = await supabaseClient
        .from('chat_sessions')
        .insert([{
          user_id: userId,
          title: message.substring(0, 50) + '...',
          last_message: aiResponse.substring(0, 200),
          message_count: 1
        }])
        .select()
        .single()

      if (!sessionError && newSession) {
        currentSessionId = newSession.id
      }
    }

    // Save conversation to database
    const chatEntries = [
      {
        user_id: userId,
        session_id: currentSessionId,
        message: message,
        response: '',
        role: 'user',
        timestamp: new Date().toISOString()
      },
      {
        user_id: userId,
        session_id: currentSessionId,
        message: aiResponse,
        response: aiResponse,
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
    ]

    await supabaseClient.from('chat_history').insert(chatEntries)

    // Update session with latest message
    if (currentSessionId) {
      await supabaseClient
        .from('chat_sessions')
        .update({
          last_message: aiResponse.substring(0, 200),
          message_count: (recentChats?.length || 0) + 2,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSessionId)
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        timestamp: new Date().toISOString(),
        session_id: currentSessionId,
        confidence: 0.95,
        sources: ['health_metrics', 'user_profile', 'chat_history']
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in openai-chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})