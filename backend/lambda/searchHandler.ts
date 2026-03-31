import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { successResponse, errorResponse } from './utils';

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const FORUM_TABLE_NAME = process.env.FORUM_TABLE_NAME || 'SwasthyasheForum';

// Search result limit per category
const RESULTS_PER_CATEGORY = 5;

// Search categories
type SearchCategory = 'articles' | 'remedies' | 'forum' | 'diet';

// Search result interface
interface SearchResult {
  id: string;
  type: SearchCategory;
  title: string;
  snippet: string;
  url: string;
  matchedTerms: string[];
}

// Grouped search results
interface GroupedSearchResults {
  articles: SearchResult[];
  remedies: SearchResult[];
  forum: SearchResult[];
  diet: SearchResult[];
}

// ============================================
// Static Content Data
// ============================================

// Articles content for search
const ARTICLES_CONTENT = [
  {
    id: 'article-period-health',
    title: 'Period Health Guide',
    content: 'Understanding your menstrual cycle is essential for overall health. Learn about period phases, cycle tracking, and maintaining menstrual health. The menstrual cycle typically lasts 28 days and includes menstruation, follicular phase, ovulation, and luteal phase.',
    url: '/period-health',
    tags: ['period', 'menstrual', 'cycle', 'health', 'menstruation', 'ovulation'],
  },
  {
    id: 'article-mental-wellness',
    title: 'Mental Wellness for Women',
    content: 'Mental health is crucial for overall well-being. Explore stress management, anxiety relief, meditation techniques, and emotional balance. Ayurvedic approaches to mental wellness include pranayama, yoga, and herbal remedies.',
    url: '/mental-wellness',
    tags: ['mental', 'wellness', 'stress', 'anxiety', 'meditation', 'emotional', 'yoga'],
  },
  {
    id: 'article-ayurvedic-mental',
    title: 'Ayurvedic Approach to Mental Health',
    content: 'Discover ancient Ayurvedic wisdom for mental health. Learn about doshas, herbs like Brahmi and Ashwagandha, and lifestyle practices for emotional balance and clarity of mind.',
    url: '/ayurvedic-mental-health',
    tags: ['ayurveda', 'mental', 'brahmi', 'ashwagandha', 'dosha', 'herbs'],
  },
  {
    id: 'article-menstrual-hygiene',
    title: 'Menstrual Hygiene Practices',
    content: 'Proper menstrual hygiene is important for preventing infections and maintaining comfort. Learn about sanitary products, cleaning practices, and sustainable period options like menstrual cups.',
    url: '/menstrual-hygiene',
    tags: ['hygiene', 'menstrual', 'sanitary', 'period', 'cups', 'pads'],
  },
  {
    id: 'article-blood-color',
    title: 'Blood Color Guide',
    content: 'Understanding menstrual blood color can provide insights into your health. Learn what different colors mean - from bright red to dark brown, and when to consult a doctor.',
    url: '/blood-color-guide',
    tags: ['blood', 'color', 'menstrual', 'health', 'period'],
  },
  {
    id: 'article-pregnancy-care',
    title: 'Pregnancy Care Guide',
    content: 'Comprehensive guide to pregnancy care including prenatal nutrition, exercise, Ayurvedic practices for expecting mothers, and preparing for childbirth.',
    url: '/pregnancy-care',
    tags: ['pregnancy', 'prenatal', 'care', 'nutrition', 'childbirth', 'expecting'],
  },
  {
    id: 'article-sexual-health',
    title: 'Sexual Health and Wellness',
    content: 'Information about sexual health, reproductive wellness, contraception options, and maintaining intimate health through Ayurvedic practices.',
    url: '/sexual-health',
    tags: ['sexual', 'health', 'reproductive', 'contraception', 'intimate'],
  },
  {
    id: 'article-skincare',
    title: 'Natural Skincare Tips',
    content: 'Ayurvedic skincare routines for glowing skin. Learn about natural ingredients, face masks, and dosha-specific skincare practices for healthy, radiant skin.',
    url: '/skincare',
    tags: ['skin', 'skincare', 'natural', 'ayurveda', 'beauty', 'face'],
  },
  {
    id: 'article-haircare',
    title: 'Ayurvedic Hair Care',
    content: 'Traditional hair care practices using natural oils, herbs, and Ayurvedic treatments. Learn about hair oiling, herbal shampoos, and remedies for hair fall.',
    url: '/haircare',
    tags: ['hair', 'haircare', 'oil', 'herbs', 'ayurveda', 'natural'],
  },
  {
    id: 'article-natural-remedies',
    title: 'Natural Remedies for Common Issues',
    content: 'Explore natural and Ayurvedic remedies for common health issues including cramps, headaches, bloating, and fatigue. Herbal teas, yoga poses, and lifestyle tips.',
    url: '/natural-remedies',
    tags: ['natural', 'remedies', 'herbal', 'ayurveda', 'cramps', 'headache'],
  },
];

// Ayurvedic remedies content for search
const REMEDIES_CONTENT = [
  {
    id: 'remedy-ginger-tea',
    title: 'Ginger Tea for Cramps',
    content: 'Ginger has natural anti-inflammatory properties that help reduce menstrual cramps and improve blood circulation. Boil fresh ginger slices in water for 10 minutes.',
    url: '/natural-remedies#ginger-tea',
    tags: ['ginger', 'tea', 'cramps', 'anti-inflammatory', 'menstrual'],
  },
  {
    id: 'remedy-ajwain',
    title: 'Ajwain (Carom Seeds) Water',
    content: 'Ajwain helps relax uterine muscles and provides relief from menstrual cramps. Soak 1 tsp ajwain in warm water overnight and drink in the morning.',
    url: '/natural-remedies#ajwain',
    tags: ['ajwain', 'carom', 'seeds', 'cramps', 'uterine'],
  },
  {
    id: 'remedy-ashwagandha',
    title: 'Ashwagandha for Energy',
    content: 'Ashwagandha is an adaptogen that helps combat fatigue and boost energy levels. Take 1/4 tsp ashwagandha powder with warm milk before bed.',
    url: '/natural-remedies#ashwagandha',
    tags: ['ashwagandha', 'energy', 'fatigue', 'adaptogen', 'milk'],
  },
  {
    id: 'remedy-shatavari',
    title: 'Shatavari for Women\'s Health',
    content: 'Shatavari is excellent for women\'s health and helps restore energy during menstruation. Mix 1/2 tsp shatavari powder in warm milk.',
    url: '/natural-remedies#shatavari',
    tags: ['shatavari', 'women', 'health', 'energy', 'menstruation'],
  },
  {
    id: 'remedy-fennel-tea',
    title: 'Fennel Tea for Bloating',
    content: 'Fennel seeds help reduce bloating and gas by relaxing digestive muscles. Steep 1 tsp fennel seeds in hot water for 10 minutes.',
    url: '/natural-remedies#fennel',
    tags: ['fennel', 'tea', 'bloating', 'gas', 'digestion'],
  },
  {
    id: 'remedy-triphala',
    title: 'Triphala for Digestion',
    content: 'This Ayurvedic blend supports healthy digestion and reduces bloating. Take 1/2 tsp triphala powder with warm water before bed.',
    url: '/natural-remedies#triphala',
    tags: ['triphala', 'digestion', 'bloating', 'ayurveda'],
  },
  {
    id: 'remedy-chamomile',
    title: 'Chamomile Tea for Mood',
    content: 'Chamomile has calming properties that help stabilize mood fluctuations. Steep chamomile flowers in hot water for 5 minutes.',
    url: '/natural-remedies#chamomile',
    tags: ['chamomile', 'tea', 'mood', 'calming', 'relaxation'],
  },
  {
    id: 'remedy-tulsi',
    title: 'Tulsi (Holy Basil) for Stress',
    content: 'Tulsi is an adaptogen that helps reduce stress and anxiety. Steep fresh or dried tulsi leaves in hot water for 5-10 minutes.',
    url: '/natural-remedies#tulsi',
    tags: ['tulsi', 'basil', 'stress', 'anxiety', 'adaptogen'],
  },
  {
    id: 'remedy-brahmi',
    title: 'Brahmi for Mental Clarity',
    content: 'Brahmi is known for its calming effects on the nervous system and can help reduce headaches and improve mental clarity.',
    url: '/natural-remedies#brahmi',
    tags: ['brahmi', 'mental', 'clarity', 'headache', 'nervous'],
  },
  {
    id: 'remedy-saffron',
    title: 'Saffron Milk for Mood',
    content: 'Saffron is known to uplift mood and combat feelings of sadness. Add 2-3 strands of saffron to warm milk.',
    url: '/natural-remedies#saffron',
    tags: ['saffron', 'milk', 'mood', 'sadness', 'uplift'],
  },
  {
    id: 'remedy-peppermint',
    title: 'Peppermint Oil for Headaches',
    content: 'Peppermint has cooling properties that help relieve tension headaches. Apply diluted peppermint oil to temples and forehead.',
    url: '/natural-remedies#peppermint',
    tags: ['peppermint', 'oil', 'headache', 'tension', 'cooling'],
  },
  {
    id: 'remedy-yoga-cramps',
    title: 'Yoga Poses for Cramps',
    content: 'Balasana (Child\'s Pose) helps relax the lower back and abdomen, easing cramp discomfort. Kneel on the floor and stretch arms forward.',
    url: '/natural-remedies#yoga-cramps',
    tags: ['yoga', 'cramps', 'balasana', 'child', 'pose', 'stretch'],
  },
  {
    id: 'remedy-pranayama',
    title: 'Pranayama for Anxiety',
    content: 'Controlled breathing helps balance emotions and calm the mind. Practice Anulom Vilom (alternate nostril breathing) for 10 minutes daily.',
    url: '/natural-remedies#pranayama',
    tags: ['pranayama', 'breathing', 'anxiety', 'calm', 'anulom', 'vilom'],
  },
];

// Diet plan content for search
const DIET_CONTENT = [
  {
    id: 'diet-menstrual-phase',
    title: 'Diet During Menstrual Phase',
    content: 'During menstruation, focus on iron-rich foods like spinach, dates, and pomegranate. Include warming spices like turmeric and ginger. Avoid cold foods and caffeine.',
    url: '/diet-plan#menstrual',
    tags: ['diet', 'menstrual', 'iron', 'spinach', 'dates', 'turmeric'],
  },
  {
    id: 'diet-follicular-phase',
    title: 'Diet During Follicular Phase',
    content: 'After your period, focus on protein-rich foods and fresh vegetables. Include sprouts, eggs, and lean proteins. This is a good time for lighter, energizing meals.',
    url: '/diet-plan#follicular',
    tags: ['diet', 'follicular', 'protein', 'vegetables', 'sprouts', 'energy'],
  },
  {
    id: 'diet-ovulation-phase',
    title: 'Diet During Ovulation',
    content: 'During ovulation, include fiber-rich foods and antioxidants. Focus on fruits, vegetables, and whole grains. Stay hydrated and include cooling foods.',
    url: '/diet-plan#ovulation',
    tags: ['diet', 'ovulation', 'fiber', 'antioxidants', 'fruits', 'grains'],
  },
  {
    id: 'diet-luteal-phase',
    title: 'Diet During Luteal Phase',
    content: 'Before your period, focus on complex carbohydrates and magnesium-rich foods. Include brown rice, oats, dark chocolate, and leafy greens to manage PMS symptoms.',
    url: '/diet-plan#luteal',
    tags: ['diet', 'luteal', 'pms', 'carbohydrates', 'magnesium', 'chocolate'],
  },
  {
    id: 'diet-vata-dosha',
    title: 'Diet for Vata Dosha',
    content: 'Vata types benefit from warm, grounding foods. Include cooked vegetables, soups, ghee, and warming spices. Avoid raw, cold, and dry foods.',
    url: '/diet-plan#vata',
    tags: ['diet', 'vata', 'dosha', 'warm', 'grounding', 'ghee', 'soup'],
  },
  {
    id: 'diet-pitta-dosha',
    title: 'Diet for Pitta Dosha',
    content: 'Pitta types need cooling, calming foods. Include sweet fruits, cucumber, coconut, and mint. Avoid spicy, sour, and fermented foods.',
    url: '/diet-plan#pitta',
    tags: ['diet', 'pitta', 'dosha', 'cooling', 'cucumber', 'coconut', 'mint'],
  },
  {
    id: 'diet-kapha-dosha',
    title: 'Diet for Kapha Dosha',
    content: 'Kapha types benefit from light, stimulating foods. Include spicy foods, leafy greens, and legumes. Avoid heavy, oily, and sweet foods.',
    url: '/diet-plan#kapha',
    tags: ['diet', 'kapha', 'dosha', 'light', 'spicy', 'greens', 'legumes'],
  },
  {
    id: 'diet-iron-rich',
    title: 'Iron-Rich Foods for Women',
    content: 'Combat fatigue with iron-rich foods: spinach, lentils, chickpeas, dates, jaggery, and pomegranate. Pair with vitamin C for better absorption.',
    url: '/diet-plan#iron',
    tags: ['iron', 'foods', 'spinach', 'lentils', 'dates', 'jaggery', 'fatigue'],
  },
  {
    id: 'diet-anti-inflammatory',
    title: 'Anti-Inflammatory Foods',
    content: 'Reduce inflammation with turmeric, ginger, fatty fish, walnuts, and berries. These foods help manage period pain and overall wellness.',
    url: '/diet-plan#anti-inflammatory',
    tags: ['anti-inflammatory', 'turmeric', 'ginger', 'walnuts', 'berries', 'pain'],
  },
  {
    id: 'diet-hormonal-balance',
    title: 'Foods for Hormonal Balance',
    content: 'Support hormonal balance with flaxseeds, sesame seeds, cruciferous vegetables, and healthy fats. Avoid processed foods and excess sugar.',
    url: '/diet-plan#hormonal',
    tags: ['hormonal', 'balance', 'flaxseeds', 'sesame', 'vegetables', 'fats'],
  },
];


// ============================================
// Search Helper Functions
// ============================================

/**
 * Highlights search terms in text by wrapping them with markers
 * @param text - The text to search in
 * @param searchTerms - Array of terms to highlight
 * @returns Text with highlighted terms
 */
function highlightTerms(text: string, searchTerms: string[]): string {
  let highlighted = text;
  searchTerms.forEach((term) => {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    highlighted = highlighted.replace(regex, '**$1**');
  });
  return highlighted;
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates a snippet from content with search term context
 * @param content - Full content text
 * @param searchTerms - Terms to find
 * @param maxLength - Maximum snippet length
 * @returns Snippet with context around matched terms
 */
function createSnippet(content: string, searchTerms: string[], maxLength: number = 150): string {
  const lowerContent = content.toLowerCase();
  
  // Find the first matching term position
  let firstMatchPos = -1;
  let matchedTerm = '';
  
  for (const term of searchTerms) {
    const pos = lowerContent.indexOf(term.toLowerCase());
    if (pos !== -1 && (firstMatchPos === -1 || pos < firstMatchPos)) {
      firstMatchPos = pos;
      matchedTerm = term;
    }
  }
  
  if (firstMatchPos === -1) {
    // No match found, return beginning of content
    return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
  }
  
  // Calculate snippet start position (show some context before the match)
  const contextBefore = 30;
  let start = Math.max(0, firstMatchPos - contextBefore);
  
  // Adjust to start at word boundary
  if (start > 0) {
    const spacePos = content.indexOf(' ', start);
    if (spacePos !== -1 && spacePos < firstMatchPos) {
      start = spacePos + 1;
    }
  }
  
  // Extract snippet
  let snippet = content.substring(start, start + maxLength);
  
  // Add ellipsis if needed
  if (start > 0) {
    snippet = '...' + snippet;
  }
  if (start + maxLength < content.length) {
    // Try to end at word boundary
    const lastSpace = snippet.lastIndexOf(' ');
    if (lastSpace > maxLength - 30) {
      snippet = snippet.substring(0, lastSpace);
    }
    snippet = snippet + '...';
  }
  
  // Highlight the matched terms
  return highlightTerms(snippet, searchTerms);
}

/**
 * Checks if content matches search query (case-insensitive partial matching)
 * @param content - Content to search in (title, content, tags)
 * @param searchTerms - Array of search terms
 * @returns Object with match status and matched terms
 */
function matchesSearch(
  title: string,
  content: string,
  tags: string[],
  searchTerms: string[]
): { matches: boolean; matchedTerms: string[] } {
  const searchableText = `${title} ${content} ${tags.join(' ')}`.toLowerCase();
  const matchedTerms: string[] = [];
  
  for (const term of searchTerms) {
    if (searchableText.includes(term.toLowerCase())) {
      matchedTerms.push(term);
    }
  }
  
  return {
    matches: matchedTerms.length > 0,
    matchedTerms,
  };
}

/**
 * Searches static content (articles, remedies, diet)
 */
function searchStaticContent(
  contentArray: Array<{ id: string; title: string; content: string; url: string; tags: string[] }>,
  searchTerms: string[],
  category: SearchCategory,
  limit: number
): SearchResult[] {
  const results: SearchResult[] = [];
  
  for (const item of contentArray) {
    if (results.length >= limit) break;
    
    const { matches, matchedTerms } = matchesSearch(
      item.title,
      item.content,
      item.tags,
      searchTerms
    );
    
    if (matches) {
      results.push({
        id: item.id,
        type: category,
        title: highlightTerms(item.title, matchedTerms),
        snippet: createSnippet(item.content, matchedTerms),
        url: item.url,
        matchedTerms,
      });
    }
  }
  
  return results;
}

/**
 * Searches forum threads from DynamoDB
 */
async function searchForumThreads(
  searchTerms: string[],
  limit: number
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  
  try {
    // Query all threads using the byLastActivity GSI
    const queryResult = await docClient.send(
      new QueryCommand({
        TableName: FORUM_TABLE_NAME,
        IndexName: 'byLastActivity',
        KeyConditionExpression: 'entityType = :entityType',
        ExpressionAttributeValues: {
          ':entityType': 'THREAD',
        },
        ScanIndexForward: false,
        Limit: 100, // Get more threads to search through
      })
    );
    
    const threads = queryResult.Items || [];
    
    for (const thread of threads) {
      if (results.length >= limit) break;
      
      const title = thread.title as string || '';
      const content = thread.content as string || '';
      const tags = (thread.tags as string[]) || [];
      
      const { matches, matchedTerms } = matchesSearch(title, content, tags, searchTerms);
      
      if (matches) {
        results.push({
          id: thread.threadId as string,
          type: 'forum',
          title: highlightTerms(title, matchedTerms),
          snippet: createSnippet(content, matchedTerms),
          url: `/community-forum/thread/${thread.threadId}`,
          matchedTerms,
        });
      }
    }
  } catch (error) {
    console.error('Error searching forum threads:', error);
    // Return empty results on error, don't fail the entire search
  }
  
  return results;
}

/**
 * Performs search across all content types
 */
async function performSearch(
  query: string,
  categories: SearchCategory[]
): Promise<GroupedSearchResults> {
  // Parse search query into terms (split by spaces, filter empty)
  const searchTerms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length >= 2); // Minimum 2 characters per term
  
  if (searchTerms.length === 0) {
    return {
      articles: [],
      remedies: [],
      forum: [],
      diet: [],
    };
  }
  
  // Determine which categories to search
  const searchAll = categories.length === 0;
  const searchArticles = searchAll || categories.includes('articles');
  const searchRemedies = searchAll || categories.includes('remedies');
  const searchForum = searchAll || categories.includes('forum');
  const searchDiet = searchAll || categories.includes('diet');
  
  // Perform searches in parallel
  const [articles, remedies, forum, diet] = await Promise.all([
    searchArticles
      ? Promise.resolve(searchStaticContent(ARTICLES_CONTENT, searchTerms, 'articles', RESULTS_PER_CATEGORY))
      : Promise.resolve([]),
    searchRemedies
      ? Promise.resolve(searchStaticContent(REMEDIES_CONTENT, searchTerms, 'remedies', RESULTS_PER_CATEGORY))
      : Promise.resolve([]),
    searchForum
      ? searchForumThreads(searchTerms, RESULTS_PER_CATEGORY)
      : Promise.resolve([]),
    searchDiet
      ? Promise.resolve(searchStaticContent(DIET_CONTENT, searchTerms, 'diet', RESULTS_PER_CATEGORY))
      : Promise.resolve([]),
  ]);
  
  return {
    articles,
    remedies,
    forum,
    diet,
  };
}

// ============================================
// Lambda Handler
// ============================================

/**
 * Lambda handler for search operations
 * Endpoints:
 * - GET /search - Search across content (articles, remedies, forum, diet plans)
 * 
 * Query Parameters:
 * - q: Search query string (required)
 * - categories: Comma-separated list of categories to search (optional)
 *   Valid values: articles, remedies, forum, diet
 *   If not provided, searches all categories
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, queryStringParameters } = event;

    // Handle OPTIONS for CORS preflight
    if (httpMethod === 'OPTIONS') {
      return successResponse(200, {});
    }

    if (httpMethod !== 'GET') {
      return errorResponse(405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
    }

    // Get search query
    const query = queryStringParameters?.q?.trim() || '';
    
    if (!query) {
      return errorResponse(400, 'VALIDATION_ERROR', 'Search query (q) is required', ['q']);
    }
    
    if (query.length < 2) {
      return errorResponse(400, 'VALIDATION_ERROR', 'Search query must be at least 2 characters', ['q']);
    }

    // Parse categories filter
    const categoriesParam = queryStringParameters?.categories || '';
    const validCategories: SearchCategory[] = ['articles', 'remedies', 'forum', 'diet'];
    const requestedCategories: SearchCategory[] = categoriesParam
      ? (categoriesParam.split(',').filter((c) => validCategories.includes(c as SearchCategory)) as SearchCategory[])
      : [];

    // Perform search
    const results = await performSearch(query, requestedCategories);
    
    // Calculate total results
    const totalResults =
      results.articles.length +
      results.remedies.length +
      results.forum.length +
      results.diet.length;

    return successResponse(200, {
      query,
      categories: requestedCategories.length > 0 ? requestedCategories : validCategories,
      totalResults,
      results,
    });
  } catch (error) {
    console.error('Error in searchHandler:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'An error occurred while searching');
  }
};
