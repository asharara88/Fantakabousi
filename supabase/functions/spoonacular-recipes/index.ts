import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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

    // Build Spoonacular API URL
    const spoonacularUrl = new URL('https://api.spoonacular.com/recipes/complexSearch')
    spoonacularUrl.searchParams.set('apiKey', Deno.env.get('SPOONACULAR_API_KEY') ?? '')
    spoonacularUrl.searchParams.set('query', query)
    spoonacularUrl.searchParams.set('number', number)
    spoonacularUrl.searchParams.set('maxReadyTime', maxReadyTime)
    spoonacularUrl.searchParams.set('addRecipeInformation', 'true')
    spoonacularUrl.searchParams.set('fillIngredients', 'true')
    spoonacularUrl.searchParams.set('addRecipeNutrition', 'true')
    
    if (diet) spoonacularUrl.searchParams.set('diet', diet)
    if (intolerances) spoonacularUrl.searchParams.set('intolerances', intolerances)

    // For Ahmed's specific needs (insulin resistance, muscle building)
    spoonacularUrl.searchParams.set('maxCarbs', '30') // Low carb for insulin resistance
    spoonacularUrl.searchParams.set('minProtein', '25') // High protein for muscle building

    const response = await fetch(spoonacularUrl.toString())

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`)
    }

    const data = await response.json()

    // Filter and enhance recipes for Ahmed's goals
    const enhancedRecipes = data.results?.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      summary: recipe.summary,
      nutrition: recipe.nutrition,
      dishTypes: recipe.dishTypes,
      diets: recipe.diets,
      occasions: recipe.occasions,
      instructions: recipe.analyzedInstructions,
      // Add fertility/muscle building tags
      healthTags: [
        ...(recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount > 25 ? ['High Protein'] : []),
        ...(recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount < 30 ? ['Low Carb'] : []),
        ...(recipe.dishTypes?.includes('main course') ? ['Muscle Building'] : []),
        ...(recipe.diets?.includes('gluten free') ? ['Anti-Inflammatory'] : []),
      ],
      fertilityScore: calculateFertilityScore(recipe),
      muscleScore: calculateMuscleScore(recipe),
    })) || []

    return new Response(
      JSON.stringify({ 
        recipes: enhancedRecipes,
        totalResults: data.totalResults,
        offset: data.offset,
        number: data.number
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in spoonacular-recipes function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function calculateFertilityScore(recipe: any): number {
  let score = 50 // Base score
  const nutrients = recipe.nutrition?.nutrients || []
  
  // Boost score for fertility-supporting nutrients
  const zinc = nutrients.find((n: any) => n.name === 'Zinc')?.amount || 0
  const folate = nutrients.find((n: any) => n.name === 'Folate')?.amount || 0
  const vitaminE = nutrients.find((n: any) => n.name === 'Vitamin E')?.amount || 0
  const omega3 = recipe.title?.toLowerCase().includes('salmon') || recipe.title?.toLowerCase().includes('fish') ? 20 : 0
  
  score += Math.min(zinc * 2, 20) // Zinc is crucial for sperm production
  score += Math.min(folate * 0.1, 15) // Folate supports DNA synthesis
  score += Math.min(vitaminE * 0.5, 10) // Antioxidant for sperm health
  score += omega3 // Omega-3 for sperm motility
  
  // Penalize high sugar (bad for insulin resistance)
  const sugar = nutrients.find((n: any) => n.name === 'Sugar')?.amount || 0
  score -= Math.min(sugar * 0.5, 20)
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

function calculateMuscleScore(recipe: any): number {
  let score = 50 // Base score
  const nutrients = recipe.nutrition?.nutrients || []
  
  // Boost score for muscle-building nutrients
  const protein = nutrients.find((n: any) => n.name === 'Protein')?.amount || 0
  const leucine = recipe.title?.toLowerCase().includes('chicken') || recipe.title?.toLowerCase().includes('beef') ? 15 : 0
  const creatine = recipe.title?.toLowerCase().includes('beef') ? 10 : 0
  
  score += Math.min(protein * 2, 30) // High protein essential
  score += leucine // Leucine for muscle protein synthesis
  score += creatine // Natural creatine sources
  
  // Bonus for post-workout timing (simple carbs)
  const carbs = nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount || 0
  if (carbs > 20 && carbs < 40) score += 10 // Moderate carbs for post-workout
  
  return Math.max(0, Math.min(100, Math.round(score)))
}