import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendChatMessage, analyzeNutrition, generateSpeech } from '../../lib/api';

// Mock fetch
global.fetch = vi.fn();

// Mock environment variables
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    }))
  }
}));

describe('API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful fetch responses
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        response: 'Test AI response',
        timestamp: new Date().toISOString(),
        confidence: 0.95
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('sendChatMessage', () => {
    it('sends chat message successfully', async () => {
      const result = await sendChatMessage('Hello', 'user-123');
      
      expect(result).toEqual({
        response: 'Test AI response',
        timestamp: expect.any(String),
        confidence: 0.95
      });
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/openai-chat'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            message: 'Hello',
            userId: 'user-123',
            sessionId: undefined
          })
        })
      );
    });

    it('handles API errors gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      });

      await expect(sendChatMessage('Hello', 'user-123')).rejects.toThrow();
    });

    it('applies rate limiting', async () => {
      // Test multiple rapid requests
      const promises = Array(25).fill(0).map(() => 
        sendChatMessage('Hello', 'user-123')
      );

      // Some should be rate limited
      const results = await Promise.allSettled(promises);
      const rejected = results.filter(r => r.status === 'rejected');
      
      expect(rejected.length).toBeGreaterThan(0);
    });
  });

  describe('analyzeNutrition', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          nutrition: {
            calories: 231,
            protein: 43.5,
            carbohydrates: 0,
            fat: 5.0
          },
          glycemicImpact: 0,
          insights: {
            fertilityScore: 85,
            muscleScore: 95,
            insulinScore: 90
          }
        }),
      });
    });

    it('analyzes nutrition successfully', async () => {
      const result = await analyzeNutrition('chicken breast', '150g', 'user-123');
      
      expect(result.nutrition.calories).toBe(231);
      expect(result.nutrition.protein).toBe(43.5);
      expect(result.insights.muscleScore).toBe(95);
    });

    it('handles missing food data', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Food not found' }),
      });

      await expect(analyzeNutrition('unknown food', '100g', 'user-123')).rejects.toThrow();
    });
  });

  describe('generateSpeech', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          audioData: 'base64-audio-data',
          contentType: 'audio/mpeg',
          duration: 5.2
        }),
      });
    });

    it('generates speech successfully', async () => {
      const result = await generateSpeech('Hello world');
      
      expect(result.audioData).toBe('base64-audio-data');
      expect(result.contentType).toBe('audio/mpeg');
      expect(result.duration).toBe(5.2);
    });

    it('handles TTS service errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ error: 'Rate limit exceeded' }),
      });

      await expect(generateSpeech('Hello world')).rejects.toThrow();
    });
  });
});