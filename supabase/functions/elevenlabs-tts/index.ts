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
    const { text, voiceId = 'EXAVITQu4vr4xnSDxMaL', settings } = await req.json()

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if text is too long (ElevenLabs has limits)
    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Text too long. Maximum 5000 characters allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenLabsApiKey) {
      console.error('ElevenLabs API key not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Generating speech for text:', text.substring(0, 100) + '...');
    console.log('Using voice ID:', voiceId);

    // Call ElevenLabs API with improved error handling
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    const requestBody = {
      text: text.trim(),
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: settings?.stability || 0.5,
        similarity_boost: settings?.similarity_boost || 0.5,
        style: settings?.style || 0.0,
        use_speaker_boost: settings?.use_speaker_boost || true,
      },
    };

    console.log('Sending request to ElevenLabs:', elevenLabsUrl);

    const response = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('ElevenLabs response status:', response.status);
    console.log('ElevenLabs response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      
      // Handle specific error cases
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Invalid ElevenLabs API key' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else if (response.status === 422) {
        return new Response(
          JSON.stringify({ error: 'Invalid voice ID or text content' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    console.log('Response content type:', contentType);

    if (!contentType || !contentType.includes('audio')) {
      const responseText = await response.text();
      console.error('Unexpected response type:', contentType, responseText);
      throw new Error('Invalid response format from ElevenLabs API');
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('Audio buffer size:', audioBuffer.byteLength);

    if (audioBuffer.byteLength === 0) {
      throw new Error('Empty audio response from ElevenLabs API');
    }

    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return new Response(
      JSON.stringify({ 
        audioData: base64Audio,
        contentType: 'audio/mpeg',
        duration: Math.ceil(text.length / 10), // Rough estimate
        voiceId: voiceId,
        characterCount: text.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in elevenlabs-tts function:', error);
    
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate speech',
        details: errorMessage,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})