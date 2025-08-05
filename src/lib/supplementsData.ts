import { supabase } from './supabase';

export interface SupplementData {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  detailed_description?: string;
  key_benefits?: string;
  ingredients?: string;
  serving_size?: string;
  servings_per_container?: number;
  directions_for_use?: string;
  warnings?: string;
  price: string;
  compare_at_price?: string;
  currency?: string;
  stock_quantity?: number;
  is_available?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  image_url?: string;
  nutrition_facts?: any;
  certifications?: string;
  target_audience?: string;
  health_conditions?: string;
  allergen_info?: string;
  manufacturer?: string;
  country_of_origin?: string;
  expiry_date?: string;
  barcode?: string;
  sku?: string;
  weight_grams?: string;
  tags?: string;
  seo_title?: string;
  seo_description?: string;
}

export interface SupplementStack {
  id: string;
  category: string;
  name: string;
  total_price: number;
  components: any;
}

// Cache for supplements data
let supplementsCache: SupplementData[] | null = null;
let stacksCache: SupplementStack[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch supplements from Supabase
export const fetchSupplementsFromDatabase = async (): Promise<SupplementData[]> => {
  try {
    console.log('Fetching supplements from Supabase...');
    
    // Try the main supplement table first
    let { data: supplements, error } = await supabase
      .from('supplement')
      .select('*')
      .eq('is_available', true);

    if (error || !supplements || supplements.length === 0) {
      console.log('Main supplement table failed, trying demo table...');
      
      // Try the demo table
      const { data: demoSupplements, error: demoError } = await supabase
        .from('Supplement Stacks Demo')
        .select('*')
        .eq('is_available', true);

      if (demoError) {
        console.error('Demo table error:', demoError);
        throw demoError;
      }
      
      supplements = demoSupplements;
    }

    if (!supplements || supplements.length === 0) {
      console.warn('No supplements found in database, using fallback data');
      return getFallbackSupplements();
    }

    console.log(`Found ${supplements.length} supplements in database`);
    
    // Process and clean the data
    const processedSupplements = supplements.map((supplement: any) => ({
      id: supplement.id || `supplement_${Date.now()}_${Math.random()}`,
      name: supplement.name || 'Unknown Supplement',
      brand: supplement.brand || 'Biowell',
      category: supplement.category || 'Health',
      subcategory: supplement.subcategory || '',
      description: supplement.description || 'Premium health supplement',
      detailed_description: supplement.detailed_description || '',
      key_benefits: supplement.key_benefits || '',
      ingredients: supplement.ingredients || '',
      serving_size: supplement.serving_size || '1 capsule',
      servings_per_container: supplement.servings_per_container || 30,
      directions_for_use: supplement.directions_for_use || 'Take as directed',
      warnings: supplement.warnings || 'Consult physician if pregnant or nursing',
      price: supplement.price || '99',
      compare_at_price: supplement.compare_at_price || '',
      currency: supplement.currency || 'AED',
      stock_quantity: supplement.stock_quantity || 100,
      is_available: supplement.is_available !== false,
      is_featured: supplement.is_featured || false,
      is_bestseller: supplement.is_bestseller || false,
      image_url: supplement.image_url || 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
      nutrition_facts: supplement.nutrition_facts || {},
      certifications: supplement.certifications || 'Third-party tested',
      target_audience: supplement.target_audience || 'Adults',
      health_conditions: supplement.health_conditions || '',
      allergen_info: supplement.allergen_info || '',
      manufacturer: supplement.manufacturer || 'Biowell Labs',
      country_of_origin: supplement.country_of_origin || 'UAE',
      expiry_date: supplement.expiry_date || '',
      barcode: supplement.barcode || '',
      sku: supplement.sku || '',
      weight_grams: supplement.weight_grams || '',
      tags: supplement.tags || '',
      seo_title: supplement.seo_title || '',
      seo_description: supplement.seo_description || ''
    }));

    return processedSupplements;
  } catch (error) {
    console.error('Error fetching supplements from database:', error);
    return getFallbackSupplements();
  }
};

// Fetch supplement stacks from Supabase
export const fetchSupplementStacks = async (): Promise<SupplementStack[]> => {
  try {
    console.log('Fetching supplement stacks from Supabase...');
    
    const { data: stacks, error } = await supabase
      .from('supplement_stacks')
      .select('*');

    if (error) {
      console.error('Error fetching supplement stacks:', error);
      return getFallbackStacks();
    }

    if (!stacks || stacks.length === 0) {
      console.warn('No supplement stacks found, using fallback data');
      return getFallbackStacks();
    }

    console.log(`Found ${stacks.length} supplement stacks in database`);
    return stacks;
  } catch (error) {
    console.error('Error fetching supplement stacks:', error);
    return getFallbackStacks();
  }
};

// Fallback supplements if database fails
const getFallbackSupplements = (): SupplementData[] => [
  {
    id: 'fallback_1',
    name: 'Premium Omega-3',
    brand: 'Biowell',
    category: 'Essential Fatty Acids',
    subcategory: 'Fish Oil',
    description: 'High-potency omega-3 for heart and brain health',
    detailed_description: 'Premium quality omega-3 fatty acids sourced from wild-caught fish',
    key_benefits: 'Heart health, Brain function, Anti-inflammatory',
    ingredients: 'Fish Oil, EPA, DHA, Vitamin E',
    serving_size: '2 capsules',
    servings_per_container: 30,
    directions_for_use: 'Take 2 capsules daily with food',
    warnings: 'Consult physician if pregnant or nursing',
    price: '89',
    compare_at_price: '120',
    currency: 'AED',
    stock_quantity: 150,
    is_available: true,
    is_featured: true,
    is_bestseller: false,
    image_url: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
    nutrition_facts: {},
    certifications: 'Third-party tested',
    target_audience: 'Adults',
    health_conditions: 'Heart health, Cognitive function',
    allergen_info: 'Contains fish',
    manufacturer: 'Biowell Labs',
    country_of_origin: 'UAE',
    expiry_date: '2026-12-31',
    barcode: '123456789012',
    sku: 'BW-OMEGA3-001',
    weight_grams: '120',
    tags: 'omega-3, heart health, brain health',
    seo_title: 'Premium Omega-3 Supplement',
    seo_description: 'High-quality omega-3 for optimal health'
  },
  {
    id: 'fallback_2',
    name: 'Vitamin D3 + K2',
    brand: 'Biowell',
    category: 'Vitamins',
    subcategory: 'Fat-Soluble Vitamins',
    description: 'Synergistic vitamin D3 and K2 for bone and immune health',
    detailed_description: 'Optimal ratio of D3 and K2 for maximum absorption and utilization',
    key_benefits: 'Bone health, Immune support, Calcium regulation',
    ingredients: 'Vitamin D3, Vitamin K2 (MK-7), MCT Oil',
    serving_size: '1 capsule',
    servings_per_container: 60,
    directions_for_use: 'Take 1 capsule daily with fat-containing meal',
    warnings: 'Consult physician if taking blood thinners',
    price: '79',
    compare_at_price: '99',
    currency: 'AED',
    stock_quantity: 200,
    is_available: true,
    is_featured: true,
    is_bestseller: true,
    image_url: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
    nutrition_facts: {},
    certifications: 'Third-party tested, Non-GMO',
    target_audience: 'Adults',
    health_conditions: 'Vitamin D deficiency, Bone health',
    allergen_info: 'None',
    manufacturer: 'Biowell Labs',
    country_of_origin: 'UAE',
    expiry_date: '2026-12-31',
    barcode: '123456789013',
    sku: 'BW-D3K2-001',
    weight_grams: '90',
    tags: 'vitamin d, vitamin k2, bone health, immune',
    seo_title: 'Vitamin D3 + K2 Supplement',
    seo_description: 'Synergistic D3 and K2 for optimal health'
  }
];

// Fallback stacks if database fails
const getFallbackStacks = (): SupplementStack[] => [
  {
    id: 'stack_1',
    category: 'Performance',
    name: 'Athletic Performance Stack',
    total_price: 299,
    components: {
      supplements: ['Creatine', 'Beta-Alanine', 'Citrulline'],
      description: 'Complete pre and post workout support'
    }
  },
  {
    id: 'stack_2',
    category: 'Recovery',
    name: 'Recovery & Sleep Stack',
    total_price: 249,
    components: {
      supplements: ['Magnesium', 'Melatonin', 'Ashwagandha'],
      description: 'Optimize recovery and sleep quality'
    }
  }
];

// Get supplements with caching
export const getSupplements = async (): Promise<SupplementData[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (supplementsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return supplementsCache;
  }
  
  // Fetch fresh data
  supplementsCache = await fetchSupplementsFromDatabase();
  cacheTimestamp = now;
  
  return supplementsCache;
};

// Get supplement stacks with caching
export const getSupplementStacks = async (): Promise<SupplementStack[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (stacksCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return stacksCache;
  }
  
  // Fetch fresh data
  stacksCache = await fetchSupplementStacks();
  cacheTimestamp = now;
  
  return stacksCache;
};

// Filter supplements by category
export const getSupplementsByCategory = async (category: string): Promise<SupplementData[]> => {
  const supplements = await getSupplements();
  if (category === 'all') return supplements;
  
  return supplements.filter(s => 
    s.category?.toLowerCase().includes(category.toLowerCase()) ||
    s.subcategory?.toLowerCase().includes(category.toLowerCase())
  );
};

// Search supplements
export const searchSupplements = async (query: string): Promise<SupplementData[]> => {
  const supplements = await getSupplements();
  const searchTerm = query.toLowerCase();
  
  return supplements.filter(s =>
    s.name?.toLowerCase().includes(searchTerm) ||
    s.description?.toLowerCase().includes(searchTerm) ||
    s.key_benefits?.toLowerCase().includes(searchTerm) ||
    s.tags?.toLowerCase().includes(searchTerm)
  );
};

// Get featured supplements
export const getFeaturedSupplements = async (): Promise<SupplementData[]> => {
  const supplements = await getSupplements();
  return supplements.filter(s => s.is_featured);
};

// Get bestseller supplements
export const getBestsellerSupplements = async (): Promise<SupplementData[]> => {
  const supplements = await getSupplements();
  return supplements.filter(s => s.is_bestseller);
};

// Format price with AED currency
export const formatSupplementPrice = (price: string | number): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice)) return 'AED 0';
  
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

// Get supplement by ID
export const getSupplementById = async (id: string): Promise<SupplementData | null> => {
  const supplements = await getSupplements();
  return supplements.find(s => s.id === id) || null;
};

// Clear cache (useful for refreshing data)
export const clearSupplementCache = () => {
  supplementsCache = null;
  stacksCache = null;
  cacheTimestamp = 0;
};