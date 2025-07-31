# Biowell API SDK Examples

## JavaScript/TypeScript SDK

### Installation

```bash
npm install @biowell/api-sdk
# or
yarn add @biowell/api-sdk
```

### Basic Setup

```typescript
import { BiowellAPI } from '@biowell/api-sdk';

const api = new BiowellAPI({
  baseUrl: 'https://your-project.supabase.co/functions/v1',
  apiKey: 'your-supabase-anon-key',
  authToken: 'user-jwt-token'
});
```

### AI Coach Integration

```typescript
// Send message to AI coach
const chatWithCoach = async (message: string) => {
  try {
    const response = await api.aiCoach.sendMessage({
      message,
      userId: 'user-id',
      sessionId: 'session-id'
    });
    
    console.log('AI Response:', response.response);
    console.log('Confidence:', response.confidence);
    
    return response;
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
};

// Example usage
await chatWithCoach('How can I improve my sleep quality?');
```

### Health Metrics Tracking

```typescript
// Log health metric
const logHeartRate = async (heartRate: number) => {
  try {
    const metric = await api.healthMetrics.create({
      userId: 'user-id',
      metricType: 'heart_rate',
      value: heartRate,
      unit: 'bpm',
      source: 'wearable',
      timestamp: new Date().toISOString(),
      metadata: {
        device: 'Apple Watch',
        activity: 'rest'
      }
    });
    
    return metric;
  } catch (error) {
    console.error('Failed to log heart rate:', error);
    throw error;
  }
};

// Get health metrics
const getMetrics = async (metricType?: string) => {
  try {
    const metrics = await api.healthMetrics.list({
      userId: 'user-id',
      metricType,
      limit: 50,
      startDate: '2025-01-01',
      endDate: '2025-01-30'
    });
    
    return metrics.data;
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    throw error;
  }
};
```

### Nutrition Analysis

```typescript
// Analyze food
const analyzeFood = async (foodName: string, quantity?: string) => {
  try {
    const analysis = await api.nutrition.analyze({
      foodName,
      quantity: quantity || '1 serving',
      userId: 'user-id'
    });
    
    console.log('Nutrition:', analysis.nutrition);
    console.log('Health Scores:', {
      fertility: analysis.insights.fertilityScore,
      muscle: analysis.insights.muscleScore,
      insulin: analysis.insights.insulinScore
    });
    
    return analysis;
  } catch (error) {
    console.error('Nutrition analysis failed:', error);
    throw error;
  }
};

// Example usage
const chickenAnalysis = await analyzeFood('grilled chicken breast', '150g');
```

### Text-to-Speech

```typescript
// Generate speech
const generateSpeech = async (text: string, voiceId?: string) => {
  try {
    const audio = await api.textToSpeech.generate({
      text,
      voiceId: voiceId || 'EXAVITQu4vr4xnSDxMaL'
    });
    
    // Convert base64 to audio blob
    const audioBlob = new Blob([
      Uint8Array.from(atob(audio.audioData), c => c.charCodeAt(0))
    ], { type: audio.contentType });
    
    // Play audio
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioElement = new Audio(audioUrl);
    await audioElement.play();
    
    return audio;
  } catch (error) {
    console.error('TTS generation failed:', error);
    throw error;
  }
};
```

### Recipe Search

```typescript
// Search recipes
const searchRecipes = async (query: string, filters?: RecipeFilters) => {
  try {
    const recipes = await api.recipes.search({
      query,
      diet: filters?.diet,
      intolerances: filters?.intolerances,
      maxReadyTime: filters?.maxReadyTime || 45,
      number: filters?.number || 12
    });
    
    return recipes.recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      healthScore: recipe.fertilityScore + recipe.muscleScore,
      nutrition: recipe.nutrition
    }));
  } catch (error) {
    console.error('Recipe search failed:', error);
    throw error;
  }
};

// Example usage
const ketoRecipes = await searchRecipes('high protein', {
  diet: 'ketogenic',
  maxReadyTime: 30,
  number: 20
});
```

## React Hooks

### useAICoach Hook

```typescript
import { useState, useCallback } from 'react';
import { BiowellAPI } from '@biowell/api-sdk';

export const useAICoach = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, sessionId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.aiCoach.sendMessage({
        message,
        userId,
        sessionId
      });
      
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { sendMessage, loading, error };
};

// Usage in component
const ChatComponent = () => {
  const { sendMessage, loading, error } = useAICoach(user.id);
  
  const handleSend = async () => {
    try {
      const response = await sendMessage(inputMessage);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  return (
    <div>
      {/* Chat UI */}
    </div>
  );
};
```

### useHealthMetrics Hook

```typescript
import { useState, useEffect } from 'react';

export const useHealthMetrics = (userId: string, metricType?: string) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await api.healthMetrics.list({
          userId,
          metricType,
          limit: 100
        });
        setMetrics(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [userId, metricType]);

  const addMetric = useCallback(async (metricData) => {
    try {
      const newMetric = await api.healthMetrics.create({
        userId,
        ...metricData
      });
      setMetrics(prev => [newMetric, ...prev]);
      return newMetric;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  return { metrics, loading, error, addMetric };
};
```

## Python SDK

### Installation

```bash
pip install biowell-api-sdk
```

### Basic Usage

```python
from biowell_api import BiowellAPI

# Initialize client
api = BiowellAPI(
    base_url='https://your-project.supabase.co/functions/v1',
    api_key='your-supabase-anon-key',
    auth_token='user-jwt-token'
)

# Send message to AI coach
response = api.ai_coach.send_message(
    message='How can I improve my sleep quality?',
    user_id='user-id',
    session_id='session-id'
)

print(f"AI Response: {response.response}")
print(f"Confidence: {response.confidence}")

# Analyze nutrition
nutrition = api.nutrition.analyze(
    food_name='grilled chicken breast',
    quantity='150g',
    user_id='user-id'
)

print(f"Calories: {nutrition.nutrition.calories}")
print(f"Protein: {nutrition.nutrition.protein}g")
```

## cURL Examples

### AI Coach

```bash
# Send chat message
curl -X POST https://your-project.supabase.co/functions/v1/openai-chat \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I improve my sleep quality?",
    "userId": "user-id",
    "sessionId": "session-id"
  }'
```

### Nutrition Analysis

```bash
# Analyze food
curl -X POST https://your-project.supabase.co/functions/v1/nutrition-analysis \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "foodName": "grilled chicken breast",
    "quantity": "150g",
    "userId": "user-id"
  }'
```

### Text-to-Speech

```bash
# Generate speech
curl -X POST https://your-project.supabase.co/functions/v1/elevenlabs-tts \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Based on your sleep data, I recommend going to bed earlier.",
    "voiceId": "EXAVITQu4vr4xnSDxMaL"
  }'
```

### Recipe Search

```bash
# Search recipes
curl -X GET "https://your-project.supabase.co/functions/v1/spoonacular-recipes?query=healthy&diet=ketogenic&maxReadyTime=30&number=12" \
  -H "Authorization: Bearer your-jwt-token"
```

## Error Handling Examples

### Retry Logic

```typescript
const retryRequest = async (requestFn: () => Promise<any>, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log(`Retry attempt ${attempt} after ${delay}ms`);
    }
  }
};

// Usage
const response = await retryRequest(() => 
  api.aiCoach.sendMessage({ message, userId })
);
```

### Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private threshold = 5,
    private timeout = 60000
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}

// Usage
const circuitBreaker = new CircuitBreaker();

const safeApiCall = async () => {
  return circuitBreaker.execute(() => 
    api.aiCoach.sendMessage({ message, userId })
  );
};
```

---

For more examples and advanced usage, check the [full API documentation](./README.md).