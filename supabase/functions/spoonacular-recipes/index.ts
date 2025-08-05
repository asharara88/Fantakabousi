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
    const url = new URL(req.url)
    const query = url.searchParams.get('query') || 'healthy'
    const diet = url.searchParams.get('diet') || ''
    const intolerances = url.searchParams.get('intolerances') || ''
    const maxReadyTime = url.searchParams.get('maxReadyTime') || '45'
    const number = url.searchParams.get('number') || '12'
    const minProtein = url.searchParams.get('minProtein') || ''
    const maxCarbs = url.searchParams.get('maxCarbs') || ''

    const spoonacularApiKey = Deno.env.get('SPOONACULAR_API_KEY')
    if (!spoonacularApiKey) {
      console.error('Spoonacular API key not found')
      return new Response(
        JSON.stringify({ 
          error: 'Service configuration error',
          details: 'Recipe search service is not properly configured'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build Spoonacular API URL
    const spoonacularUrl = new URL('https://api.spoonacular.com/recipes/complexSearch')
    spoonacularUrl.searchParams.set('apiKey', spoonacularApiKey)
    spoonacularUrl.searchParams.set('query', query)
    spoonacularUrl.searchParams.set('number', number)
    spoonacularUrl.searchParams.set('maxReadyTime', maxReadyTime)
    spoonacularUrl.searchParams.set('addRecipeInformation', 'true')
    spoonacularUrl.searchParams.set('fillIngredients', 'true')
    spoonacularUrl.searchParams.set('addRecipeNutrition', 'true')
    spoonacularUrl.searchParams.set('instructionsRequired', 'true')
    
    if (diet) spoonacularUrl.searchParams.set('diet', diet)
    if (intolerances) spoonacularUrl.searchParams.set('intolerances', intolerances)
    if (minProtein) spoonacularUrl.searchParams.set('minProtein', minProtein)
    if (maxCarbs) spoonacularUrl.searchParams.set('maxCarbs', maxCarbs)

    console.log('Calling Spoonacular API:', spoonacularUrl.toString())

    const response = await fetch(spoonacularUrl.toString())

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Spoonacular API error:', response.status, errorText)
      
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ 
            error: 'Authentication failed',
            details: 'Invalid Spoonacular API key'
          }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'Quota exceeded',
            details: 'Daily API quota has been exceeded'
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      throw new Error(`Spoonacular API error: ${response.status}`)
    }

    const data = await response.json()

    // Enhanced recipe processing with health scoring
    const enhancedRecipes = data.results?.map((recipe: any) => {
      const nutrition = recipe.nutrition?.nutrients || []
      const protein = nutrition.find((n: any) => n.name === 'Protein')?.amount || 0
      const carbs = nutrition.find((n: any) => n.name === 'Carbohydrates')?.amount || 0
      const fat = nutrition.find((n: any) => n.name === 'Fat')?.amount || 0
      const fiber = nutrition.find((n: any) => n.name === 'Fiber')?.amount || 0
      const sugar = nutrition.find((n: any) => n.name === 'Sugar')?.amount || 0
      const calories = nutrition.find((n: any) => n.name === 'Calories')?.amount || 0

      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        summary: recipe.summary?.replace(/<[^>]*>/g, '') || '', // Strip HTML
        sourceUrl: recipe.sourceUrl,
        nutrition: {
          calories: Math.round(calories),
          protein: Math.round(protein * 10) / 10,
          carbs: Math.round(carbs * 10) / 10,
          fat: Math.round(fat * 10) / 10,
          fiber: Math.round(fiber * 10) / 10,
          sugar: Math.round(sugar * 10) / 10,
        },
        dishTypes: recipe.dishTypes || [],
        diets: recipe.diets || [],
        occasions: recipe.occasions || [],
        instructions: recipe.analyzedInstructions?.[0]?.steps?.map((step: any) => ({
          number: step.number,
          step: step.step
        })) || [],
        ingredients: recipe.extendedIngredients?.map((ing: any) => ({
          id: ing.id,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          original: ing.original
        })) || [],
        // Health scoring for personalized recommendations
        healthTags: generateHealthTags(recipe, protein, carbs, fiber),
        fertilityScore: calculateFertilityScore(recipe, protein, fat, nutrition),
        muscleScore: calculateMuscleScore(recipe, protein, calories),
        insulinScore: calculateInsulinScore(carbs, fiber, sugar),
        heartScore: calculateHeartScore(recipe, fat, fiber, nutrition),
        glycemicLoad: calculateGlycemicLoad(carbs, fiber, sugar)
      }
    }) || []

    // Sort by health relevance
    enhancedRecipes.sort((a: any, b: any) => {
      const aScore = (a.fertilityScore + a.muscleScore + a.insulinScore) / 3
      const bScore = (b.fertilityScore + b.muscleScore + b.insulinScore) / 3
      return bScore - aScore
    })

    return new Response(
      JSON.stringify({ 
        recipes: enhancedRecipes,
        totalResults: data.totalResults,
        offset: data.offset,
        number: data.number,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in spoonacular-recipes function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to search recipes',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateHealthTags(recipe: any, protein: number, carbs: number, fiber: number): string[] {
  const tags: string[] = []
  
  if (protein > 25) tags.push('High Protein')
  if (carbs < 30) tags.push('Low Carb')
  if (fiber > 5) tags.push('High Fiber')
  if (recipe.diets?.includes('ketogenic')) tags.push('Keto')
  if (recipe.diets?.includes('paleo')) tags.push('Paleo')
  if (recipe.diets?.includes('vegetarian')) tags.push('Vegetarian')
  if (recipe.dishTypes?.includes('main course')) tags.push('Main Course')
  if (recipe.readyInMinutes <= 30) tags.push('Quick')
  
  // Health-specific tags
  if (recipe.title?.toLowerCase().includes('salmon') || recipe.title?.toLowerCase().includes('fish')) {
    tags.push('Omega-3')
  }
  if (recipe.title?.toLowerCase().includes('antioxidant') || recipe.title?.toLowerCase().includes('berry')) {
    tags.push('Antioxidants')
  }
  
  return tags
}

function calculateFertilityScore(recipe: any, protein: number, fat: number, nutrients: any[]): number {
  let score = 50 // Base score
  
  // Boost score for fertility-supporting nutrients
  const zinc = nutrients.find((n: any) => n.name === 'Zinc')?.amount || 0
  const folate = nutrients.find((n: any) => n.name === 'Folate')?.amount || 0
  const vitaminE = nutrients.find((n: any) => n.name === 'Vitamin E')?.amount || 0
  const selenium = nutrients.find((n: any) => n.name === 'Selenium')?.amount || 0
  
  score += Math.min(zinc * 2, 20) // Zinc is crucial for fertility
  score += Math.min(folate * 0.1, 15) // Folate supports DNA synthesis
  score += Math.min(vitaminE * 0.5, 10) // Antioxidant protection
  score += Math.min(selenium * 1, 10) // Selenium for sperm health
  
  // Omega-3 rich foods
  if (recipe.title?.toLowerCase().includes('salmon') || 
      recipe.title?.toLowerCase().includes('fish') ||
      recipe.title?.toLowerCase().includes('walnut')) {
    score += 15
  }
  
  // Antioxidant-rich foods
  if (recipe.title?.toLowerCase().includes('berry') ||
      recipe.title?.toLowerCase().includes('spinach') ||
      recipe.title?.toLowerCase().includes('avocado')) {
    score += 10
  }
  
  // Penalize high sugar (bad for fertility)
  const sugar = nutrients.find((n: any) => n.name === 'Sugar')?.amount || 0
  score -= Math.min(sugar * 0.5, 20)
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

function calculateMuscleScore(recipe: any, protein: number, calories: number): number {
  let score = 50 // Base score
  
  // High protein is essential for muscle building
  score += Math.min(protein * 1.5, 35)
  
  // Leucine-rich foods (chicken, beef, eggs)
  if (recipe.title?.toLowerCase().includes('chicken') ||
      recipe.title?.toLowerCase().includes('beef') ||
      recipe.title?.toLowerCase().includes('egg')) {
    score += 15
  }
  
  // Post-workout carbs (moderate amount)
  const carbs = recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0
  if (carbs > 20 && carbs < 50) score += 10
  
  // Calorie density for muscle building
  if (calories > 300 && calories < 600) score += 5
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

function calculateInsulinScore(carbs: number, fiber: number, sugar: number): number {
  let score = 50 // Base score
  
  // Low carbs are better for insulin sensitivity
  if (carbs < 20) score += 30
  else if (carbs < 40) score += 15
  else if (carbs > 60) score -= 20
  
  // High fiber helps with glucose response
  score += Math.min(fiber * 3, 20)
  
  // Penalize high sugar content
  score -= Math.min(sugar * 2, 30)
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

function calculateHeartScore(recipe: any, fat: number, fiber: number, nutrients: any[]): number {
  let score = 50 // Base score
  
  // Healthy fats boost heart health
  if (recipe.title?.toLowerCase().includes('olive oil') ||
      recipe.title?.toLowerCase().includes('avocado') ||
      recipe.title?.toLowerCase().includes('nuts')) {
    score += 20
  }
  
  // Omega-3 for heart health
  if (recipe.title?.toLowerCase().includes('salmon') ||
      recipe.title?.toLowerCase().includes('fish')) {
    score += 25
  }
  
  // Fiber for cholesterol management
  score += Math.min(fiber * 2, 15)
  
  // Potassium for blood pressure
  const potassium = nutrients.find((n: any) => n.name === 'Potassium')?.amount || 0
  score += Math.min(potassium * 0.01, 10)
  
  // Penalize high sodium
  const sodium = nutrients.find((n: any) => n.name === 'Sodium')?.amount || 0
  if (sodium > 1000) score -= 15
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

function calculateGlycemicLoad(carbs: number, fiber: number, sugar: number): number {
  const netCarbs = Math.max(0, carbs - fiber)
  let glycemicIndex = 50 // Default moderate GI
  
  // Adjust GI based on fiber and sugar content
  if (fiber > 5) glycemicIndex -= 15
  if (sugar > 10) glycemicIndex += 20
  if (sugar < 5) glycemicIndex -= 10
  
  const glycemicLoad = (glycemicIndex * netCarbs) / 100
  return Math.max(0, Math.round(glycemicLoad))
}