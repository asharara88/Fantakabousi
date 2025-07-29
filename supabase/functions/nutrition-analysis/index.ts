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
    const { foodName, quantity, userId } = await req.json()

    if (!foodName || !userId) {
      return new Response(
        JSON.stringify({ error: 'Food name and user ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Call Spoonacular API for nutrition analysis
    const spoonacularUrl = `https://api.spoonacular.com/recipes/parseIngredients`
    const response = await fetch(spoonacularUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Key': Deno.env.get('SPOONACULAR_API_KEY') ?? '',
      },
      body: new URLSearchParams({
        ingredientList: `${quantity || '1 serving'} ${foodName}`,
        servings: '1',
        includeNutrition: 'true'
      })
    })

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`)
    }

    const nutritionData = await response.json()
    const ingredient = nutritionData[0]

    if (!ingredient) {
      return new Response(
        JSON.stringify({ error: 'Food not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract key nutrients
    const nutrients = ingredient.nutrition?.nutrients || []
    const calories = nutrients.find((n: any) => n.name === 'Calories')?.amount || 0
    const protein = nutrients.find((n: any) => n.name === 'Protein')?.amount || 0
    const carbs = nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount || 0
    const fat = nutrients.find((n: any) => n.name === 'Fat')?.amount || 0
    const fiber = nutrients.find((n: any) => n.name === 'Fiber')?.amount || 0
    const sugar = nutrients.find((n: any) => n.name === 'Sugar')?.amount || 0

    // Calculate glucose impact for Ahmed's insulin resistance
    const glycemicLoad = calculateGlycemicImpact(carbs, fiber, sugar, foodName)
    
    // Generate AI insights for Ahmed's goals
    const insights = generateNutritionInsights(calories, protein, carbs, fat, glycemicLoad, foodName)

    // Save to food logs
    const { error: logError } = await supabaseClient
      .from('food_logs')
      .insert({
        user_id: userId,
        food_name: foodName,
        portion_size: quantity || '1 serving',
        calories: Math.round(calories),
        protein: Math.round(protein * 10) / 10,
        carbohydrates: Math.round(carbs * 10) / 10,
        fat: Math.round(fat * 10) / 10,
        glucose_impact: glycemicLoad,
        meal_time: new Date().toISOString(),
        notes: insights.summary
      })

    if (logError) {
      console.error('Error saving food log:', logError)
    }

    return new Response(
      JSON.stringify({
        nutrition: {
          calories: Math.round(calories),
          protein: Math.round(protein * 10) / 10,
          carbohydrates: Math.round(carbs * 10) / 10,
          fat: Math.round(fat * 10) / 10,
          fiber: Math.round(fiber * 10) / 10,
          sugar: Math.round(sugar * 10) / 10,
        },
        glycemicImpact: glycemicLoad,
        insights: insights,
        foodName: ingredient.name,
        image: ingredient.image
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in nutrition-analysis function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function calculateGlycemicImpact(carbs: number, fiber: number, sugar: number, foodName: string): number {
  // Simplified glycemic load calculation
  const netCarbs = carbs - fiber
  let glycemicIndex = 50 // Default moderate GI
  
  // Adjust GI based on food type
  const lowGIFoods = ['vegetables', 'leafy', 'broccoli', 'spinach', 'avocado', 'nuts', 'seeds']
  const highGIFoods = ['bread', 'rice', 'pasta', 'potato', 'sugar', 'candy', 'fruit']
  
  if (lowGIFoods.some(food => foodName.toLowerCase().includes(food))) {
    glycemicIndex = 25
  } else if (highGIFoods.some(food => foodName.toLowerCase().includes(food))) {
    glycemicIndex = 70
  }
  
  // Adjust for sugar content
  if (sugar > 10) glycemicIndex += 20
  if (fiber > 5) glycemicIndex -= 15
  
  const glycemicLoad = (glycemicIndex * netCarbs) / 100
  return Math.max(0, Math.round(glycemicLoad))
}

function generateNutritionInsights(calories: number, protein: number, carbs: number, fat: number, glycemicLoad: number, foodName: string) {
  const insights = []
  let summary = ''
  
  // Insulin resistance insights
  if (glycemicLoad > 15) {
    insights.push({
      type: 'warning',
      message: `High glycemic load (${glycemicLoad}) may cause glucose spikes. Consider pairing with protein or fiber.`
    })
    summary += 'High glucose impact. '
  } else if (glycemicLoad < 5) {
    insights.push({
      type: 'success',
      message: 'Low glycemic impact - excellent for insulin sensitivity.'
    })
    summary += 'Insulin-friendly. '
  }
  
  // Muscle building insights
  if (protein > 20) {
    insights.push({
      type: 'success',
      message: `Excellent protein content (${protein}g) supports muscle building goals.`
    })
    summary += 'High protein. '
  } else if (protein < 10) {
    insights.push({
      type: 'tip',
      message: 'Consider adding protein to support muscle building goals.'
    })
  }
  
  // Fertility insights
  const fertilityFoods = ['salmon', 'nuts', 'seeds', 'avocado', 'leafy greens', 'berries']
  if (fertilityFoods.some(food => foodName.toLowerCase().includes(food))) {
    insights.push({
      type: 'success',
      message: 'Contains nutrients that support fertility and sperm health.'
    })
    summary += 'Fertility-supporting. '
  }
  
  return {
    insights,
    summary: summary || 'Nutritional data logged.',
    fertilityScore: calculateFertilityFriendly(foodName, protein, fat),
    muscleScore: protein > 15 ? 85 : protein > 10 ? 70 : 50,
    insulinScore: glycemicLoad < 5 ? 90 : glycemicLoad < 10 ? 70 : glycemicLoad < 15 ? 50 : 30
  }
}

function calculateFertilityFriendly(foodName: string, protein: number, fat: number): number {
  let score = 50
  
  // Fertility-supporting foods
  const fertilityFoods = {
    'salmon': 20, 'nuts': 15, 'seeds': 15, 'avocado': 15,
    'spinach': 10, 'berries': 10, 'eggs': 15, 'olive oil': 10
  }
  
  Object.entries(fertilityFoods).forEach(([food, points]) => {
    if (foodName.toLowerCase().includes(food)) {
      score += points
    }
  })
  
  // High protein and healthy fats boost fertility
  if (protein > 15) score += 10
  if (fat > 10 && !foodName.toLowerCase().includes('fried')) score += 10
  
  return Math.min(100, score)
}