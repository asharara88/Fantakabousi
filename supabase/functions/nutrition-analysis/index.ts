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
    const { foodName, quantity, userId, mealType } = await req.json()

    if (!foodName || !userId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: 'foodName and userId are required'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const spoonacularApiKey = Deno.env.get('SPOONACULAR_API_KEY')
    if (!spoonacularApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Service configuration error',
          details: 'Nutrition analysis service is not properly configured'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user profile for personalized analysis
    const { data: userProfile } = await supabaseClient
      .from('user_profile_signin')
      .select('*')
      .eq('id', userId)
      .single()

    // Call Spoonacular API for nutrition analysis
    const spoonacularUrl = `https://api.spoonacular.com/recipes/parseIngredients`
    const response = await fetch(spoonacularUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Key': spoonacularApiKey,
      },
      body: new URLSearchParams({
        ingredientList: `${quantity || '1 serving'} ${foodName}`,
        servings: '1',
        includeNutrition: 'true'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Spoonacular parse ingredients error:', response.status, errorText)
      
      // Fallback to food search if parsing fails
      const searchUrl = `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(foodName)}&number=1&apiKey=${spoonacularApiKey}`
      const searchResponse = await fetch(searchUrl)
      
      if (!searchResponse.ok) {
        throw new Error(`Food search failed: ${searchResponse.status}`)
      }
      
      const searchData = await searchResponse.json()
      if (!searchData.results || searchData.results.length === 0) {
        return new Response(
          JSON.stringify({ 
            error: 'Food not found',
            details: `Could not find nutritional data for "${foodName}"`
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    const nutritionData = await response.json()
    const ingredient = nutritionData[0]

    if (!ingredient) {
      return new Response(
        JSON.stringify({ 
          error: 'Food not found',
          details: `Could not analyze "${foodName}". Try a more specific food name.`
        }),
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
    const sodium = nutrients.find((n: any) => n.name === 'Sodium')?.amount || 0

    // Calculate health scores based on user profile
    const glycemicImpact = calculateGlycemicImpact(carbs, fiber, sugar, foodName)
    const insights = generatePersonalizedInsights(
      calories, protein, carbs, fat, glycemicImpact, foodName, userProfile
    )

    // Save to food logs
    const foodLogData = {
      user_id: userId,
      food_name: ingredient.name || foodName,
      meal_type: mealType || 'snack',
      portion_size: quantity || '1 serving',
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      carbohydrates: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      glucose_impact: glycemicImpact,
      meal_time: new Date().toISOString(),
      notes: `Auto-logged via nutrition analysis. ${insights.summary}`
    }

    const { data: savedLog, error: logError } = await supabaseClient
      .from('food_logs')
      .insert([foodLogData])
      .select()
      .single()

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
          sodium: Math.round(sodium)
        },
        glycemicImpact: glycemicImpact,
        insights: insights,
        foodName: ingredient.name || foodName,
        image: ingredient.image || `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.id}.jpg`,
        savedToLog: !logError,
        logId: savedLog?.id || null,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in nutrition-analysis function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze nutrition',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function calculateGlycemicImpact(carbs: number, fiber: number, sugar: number, foodName: string): number {
  const netCarbs = Math.max(0, carbs - fiber)
  let glycemicIndex = 50 // Default moderate GI
  
  // Adjust GI based on food type
  const lowGIFoods = ['vegetables', 'leafy', 'broccoli', 'spinach', 'avocado', 'nuts', 'seeds', 'berries']
  const highGIFoods = ['bread', 'rice', 'pasta', 'potato', 'sugar', 'candy', 'banana', 'watermelon']
  
  if (lowGIFoods.some(food => foodName.toLowerCase().includes(food))) {
    glycemicIndex = 25
  } else if (highGIFoods.some(food => foodName.toLowerCase().includes(food))) {
    glycemicIndex = 70
  }
  
  // Adjust for sugar and fiber content
  if (sugar > 10) glycemicIndex += 20
  if (fiber > 5) glycemicIndex -= 15
  
  const glycemicLoad = (glycemicIndex * netCarbs) / 100
  return Math.max(0, Math.round(glycemicLoad))
}

function generatePersonalizedInsights(
  calories: number, 
  protein: number, 
  carbs: number, 
  fat: number, 
  glycemicLoad: number, 
  foodName: string,
  userProfile: any
) {
  const recommendations: string[] = []
  const warnings: string[] = []
  let summary = ''
  
  // Personalized insights based on user goals
  const healthGoals = userProfile?.primary_health_goals || []
  const medicalConditions = userProfile?.medical_conditions || []
  
  // Insulin resistance insights
  if (medicalConditions.includes('insulin_resistance') || healthGoals.includes('insulin_optimization')) {
    if (glycemicLoad > 15) {
      warnings.push('High glycemic load may cause glucose spikes with insulin resistance')
      recommendations.push('Consider pairing with protein or taking a 10-minute walk after eating')
    } else if (glycemicLoad < 5) {
      recommendations.push('Excellent choice for insulin sensitivity - low glucose impact')
      summary += 'Insulin-friendly. '
    }
  }
  
  // Muscle building insights
  if (healthGoals.includes('muscle_building')) {
    if (protein > 20) {
      recommendations.push(`Excellent protein content (${protein}g) supports muscle building goals`)
      summary += 'High protein. '
    } else if (protein < 10) {
      recommendations.push('Consider adding protein to support muscle building goals')
    }
    
    // Post-workout timing
    if (carbs > 20 && carbs < 40) {
      recommendations.push('Good post-workout option with moderate carbs for glycogen replenishment')
    }
  }
  
  // Fertility insights
  if (healthGoals.includes('fertility')) {
    const fertilityFoods = ['salmon', 'nuts', 'seeds', 'avocado', 'leafy greens', 'berries', 'eggs']
    if (fertilityFoods.some(food => foodName.toLowerCase().includes(food))) {
      recommendations.push('Contains nutrients that support fertility and reproductive health')
      summary += 'Fertility-supporting. '
    }
  }
  
  // Heart health insights
  if (healthGoals.includes('heart_health')) {
    if (foodName.toLowerCase().includes('salmon') || foodName.toLowerCase().includes('fish')) {
      recommendations.push('Rich in omega-3 fatty acids for cardiovascular health')
    }
    if (fat > 15 && !foodName.toLowerCase().includes('fried')) {
      recommendations.push('Contains healthy fats that support heart health')
    }
  }
  
  // Weight management
  if (healthGoals.includes('weight_loss')) {
    if (calories < 200 && protein > 15) {
      recommendations.push('Low calorie, high protein - excellent for weight management')
    } else if (calories > 500) {
      warnings.push('High calorie content - consider portion control for weight loss goals')
    }
  }
  
  // General nutrition insights
  if (protein > 25) {
    recommendations.push('High protein content supports muscle maintenance and satiety')
  }
  
  if (fiber > 5) {
    recommendations.push('Good fiber content supports digestive health and glucose control')
  }
  
  return {
    fertilityScore: calculateFertilityScore(foodName, protein, fat),
    muscleScore: protein > 15 ? Math.min(95, 50 + protein * 2) : Math.max(30, 50 - (15 - protein) * 2),
    insulinScore: glycemicLoad < 5 ? 90 : glycemicLoad < 10 ? 70 : glycemicLoad < 15 ? 50 : 30,
    heartScore: calculateHeartScore(foodName, fat, fiber),
    recommendations,
    warnings,
    summary: summary || 'Nutritional data analyzed.',
    optimalTiming: getOptimalTiming(glycemicLoad, protein, healthGoals),
    pairingRecommendations: getPairingRecommendations(glycemicLoad, protein, carbs)
  }
}

function calculateFertilityScore(foodName: string, protein: number, fat: number): number {
  let score = 50
  
  const fertilityFoods = {
    'salmon': 25, 'nuts': 20, 'seeds': 20, 'avocado': 20,
    'spinach': 15, 'berries': 15, 'eggs': 20, 'olive oil': 15,
    'quinoa': 10, 'sweet potato': 10, 'dark chocolate': 10
  }
  
  Object.entries(fertilityFoods).forEach(([food, points]) => {
    if (foodName.toLowerCase().includes(food)) {
      score += points
    }
  })
  
  if (protein > 15) score += 10
  if (fat > 10 && !foodName.toLowerCase().includes('fried')) score += 10
  
  return Math.min(100, score)
}

function calculateHeartScore(foodName: string, fat: number, fiber: number): number {
  let score = 50
  
  const heartHealthyFoods = {
    'salmon': 25, 'olive oil': 20, 'avocado': 20, 'nuts': 15,
    'oats': 15, 'berries': 15, 'leafy greens': 10
  }
  
  Object.entries(heartHealthyFoods).forEach(([food, points]) => {
    if (foodName.toLowerCase().includes(food)) {
      score += points
    }
  })
  
  if (fiber > 5) score += 15
  if (fat > 10 && foodName.toLowerCase().includes('olive')) score += 10
  
  return Math.min(100, score)
}

function getOptimalTiming(glycemicLoad: number, protein: number, healthGoals: string[]): string {
  if (glycemicLoad > 15) {
    return 'Best consumed post-workout when glucose uptake is enhanced'
  } else if (protein > 20) {
    return 'Excellent any time, especially post-workout for muscle recovery'
  } else if (glycemicLoad < 5) {
    return 'Perfect for any time - minimal glucose impact'
  }
  return 'Best consumed as part of a balanced meal'
}

function getPairingRecommendations(glycemicLoad: number, protein: number, carbs: number): string[] {
  const recommendations: string[] = []
  
  if (glycemicLoad > 10) {
    recommendations.push('Pair with protein to slow glucose absorption')
    recommendations.push('Add healthy fats like avocado or nuts')
    recommendations.push('Include fiber-rich vegetables')
  }
  
  if (protein < 10) {
    recommendations.push('Add lean protein like chicken or fish')
    recommendations.push('Consider Greek yogurt or cottage cheese')
  }
  
  if (carbs > 30) {
    recommendations.push('Balance with protein and healthy fats')
    recommendations.push('Consider smaller portion size')
  }
  
  return recommendations
}