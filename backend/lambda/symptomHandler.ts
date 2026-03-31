import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  successResponse,
  errorResponse,
  validateDateFormat,
  validateEnum,
  validateRange,
  createUserKey,
  createSymptomKey,
  getCurrentISOTimestamp,
} from './utils';

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = process.env.SYMPTOMS_TABLE_NAME || 'SwasthyasheSymptoms';

// Valid symptom categories
const VALID_CATEGORIES = ['physical', 'emotional'] as const;
type SymptomCategory = (typeof VALID_CATEGORIES)[number];

// Valid energy levels
const VALID_ENERGY_LEVELS = ['low', 'medium', 'high'] as const;
type EnergyLevel = (typeof VALID_ENERGY_LEVELS)[number];

// Severity range
const MIN_SEVERITY = 1;
const MAX_SEVERITY = 5;
type SymptomSeverity = 1 | 2 | 3 | 4 | 5;

// Valid physical symptoms
const VALID_PHYSICAL_SYMPTOMS = ['cramps', 'headache', 'bloating', 'fatigue', 'breast_tenderness', 'back_pain', 'nausea', 'acne', 'insomnia', 'dizziness', 'hot_flashes', 'joint_pain', 'constipation'];

// Valid emotional symptoms
const VALID_EMOTIONAL_SYMPTOMS = ['mood_swings', 'anxiety', 'irritability', 'sadness', 'stress', 'brain_fog', 'low_motivation', 'crying_spells'];

// All valid symptom IDs
const ALL_VALID_SYMPTOMS = [...VALID_PHYSICAL_SYMPTOMS, ...VALID_EMOTIONAL_SYMPTOMS];

// Recommendation types
type RecommendationType = 'herbal' | 'dietary' | 'yoga' | 'lifestyle';

// Selected symptom interface
interface SelectedSymptom {
  id: string;
  category: SymptomCategory;
  name: string;
  severity: SymptomSeverity;
}

// Symptom entry interface
interface SymptomEntry {
  PK: string;
  SK: string;
  userId: string;
  date: string;
  symptoms: SelectedSymptom[];
  energyLevel: EnergyLevel;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Symptom log input interface
interface SymptomLogInput {
  date: string;
  symptoms: SelectedSymptom[];
  energyLevel: EnergyLevel;
  notes?: string;
}

// Ayurvedic recommendation interface
interface AyurvedicRecommendation {
  id: string;
  symptomIds: string[];
  type: RecommendationType;
  title: string;
  description: string;
  instructions?: string;
  cautions?: string;
}

// Validation error interface
interface ValidationError {
  field: string;
  message: string;
}

// ============================================
// Ayurvedic Recommendations Data
// ============================================

const AYURVEDIC_RECOMMENDATIONS: AyurvedicRecommendation[] = [
  // Cramps recommendations
  {
    id: 'rec-cramps-herbal-1',
    symptomIds: ['cramps'],
    type: 'herbal',
    title: 'Ginger Tea',
    description: 'Ginger has natural anti-inflammatory properties that help reduce menstrual cramps and improve blood circulation.',
    instructions: 'Boil fresh ginger slices in water for 10 minutes. Add honey and drink 2-3 times daily.',
    cautions: 'Avoid excessive consumption if you have acid reflux.',
  },
  {
    id: 'rec-cramps-herbal-2',
    symptomIds: ['cramps'],
    type: 'herbal',
    title: 'Ajwain (Carom Seeds) Water',
    description: 'Ajwain helps relax uterine muscles and provides relief from menstrual cramps.',
    instructions: 'Soak 1 tsp ajwain in warm water overnight. Drink in the morning on empty stomach.',
  },
  {
    id: 'rec-cramps-yoga-1',
    symptomIds: ['cramps'],
    type: 'yoga',
    title: 'Balasana (Child\'s Pose)',
    description: 'This gentle pose helps relax the lower back and abdomen, easing cramp discomfort.',
    instructions: 'Kneel on the floor, sit back on heels, and stretch arms forward while lowering forehead to the ground. Hold for 1-3 minutes.',
  },
  {
    id: 'rec-cramps-dietary-1',
    symptomIds: ['cramps'],
    type: 'dietary',
    title: 'Warm Foods and Spices',
    description: 'Include warming spices like turmeric, cumin, and cinnamon in your meals to improve circulation and reduce cramping.',
    instructions: 'Add a pinch of turmeric to warm milk or include cumin in your cooking.',
  },
  {
    id: 'rec-cramps-lifestyle-1',
    symptomIds: ['cramps'],
    type: 'lifestyle',
    title: 'Warm Compress',
    description: 'Applying heat to the lower abdomen helps relax muscles and reduce cramp intensity.',
    instructions: 'Use a hot water bottle or heating pad on your lower abdomen for 15-20 minutes.',
  },

  // Headache recommendations
  {
    id: 'rec-headache-herbal-1',
    symptomIds: ['headache'],
    type: 'herbal',
    title: 'Peppermint Oil',
    description: 'Peppermint has cooling properties that help relieve tension headaches.',
    instructions: 'Apply diluted peppermint oil to temples and forehead. Massage gently.',
    cautions: 'Do a patch test first. Avoid contact with eyes.',
  },
  {
    id: 'rec-headache-herbal-2',
    symptomIds: ['headache'],
    type: 'herbal',
    title: 'Brahmi Tea',
    description: 'Brahmi is known for its calming effects on the nervous system and can help reduce headaches.',
    instructions: 'Steep brahmi leaves in hot water for 5-10 minutes. Drink once or twice daily.',
  },
  {
    id: 'rec-headache-yoga-1',
    symptomIds: ['headache'],
    type: 'yoga',
    title: 'Shavasana (Corpse Pose)',
    description: 'Deep relaxation helps release tension that causes headaches.',
    instructions: 'Lie flat on your back, close eyes, and focus on deep breathing for 10-15 minutes.',
  },
  {
    id: 'rec-headache-dietary-1',
    symptomIds: ['headache'],
    type: 'dietary',
    title: 'Stay Hydrated',
    description: 'Dehydration is a common cause of headaches. Drink warm water throughout the day.',
    instructions: 'Aim for 8-10 glasses of water daily. Add a pinch of rock salt for electrolytes.',
  },
  {
    id: 'rec-headache-lifestyle-1',
    symptomIds: ['headache'],
    type: 'lifestyle',
    title: 'Reduce Screen Time',
    description: 'Eye strain from screens can trigger headaches. Take regular breaks.',
    instructions: 'Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.',
  },

  // Bloating recommendations
  {
    id: 'rec-bloating-herbal-1',
    symptomIds: ['bloating'],
    type: 'herbal',
    title: 'Fennel Tea',
    description: 'Fennel seeds help reduce bloating and gas by relaxing digestive muscles.',
    instructions: 'Steep 1 tsp fennel seeds in hot water for 10 minutes. Drink after meals.',
  },
  {
    id: 'rec-bloating-herbal-2',
    symptomIds: ['bloating'],
    type: 'herbal',
    title: 'Triphala',
    description: 'This Ayurvedic blend supports healthy digestion and reduces bloating.',
    instructions: 'Take 1/2 tsp triphala powder with warm water before bed.',
    cautions: 'Start with a small dose to assess tolerance.',
  },
  {
    id: 'rec-bloating-yoga-1',
    symptomIds: ['bloating'],
    type: 'yoga',
    title: 'Pawanmuktasana (Wind-Relieving Pose)',
    description: 'This pose helps release trapped gas and reduces abdominal bloating.',
    instructions: 'Lie on your back, bring knees to chest, and hug them. Rock gently side to side.',
  },
  {
    id: 'rec-bloating-dietary-1',
    symptomIds: ['bloating'],
    type: 'dietary',
    title: 'Avoid Cold Foods',
    description: 'Cold foods and drinks can slow digestion and increase bloating according to Ayurveda.',
    instructions: 'Prefer warm, cooked foods and room temperature or warm beverages.',
  },
  {
    id: 'rec-bloating-lifestyle-1',
    symptomIds: ['bloating'],
    type: 'lifestyle',
    title: 'Mindful Eating',
    description: 'Eating slowly and chewing thoroughly aids digestion and prevents bloating.',
    instructions: 'Chew each bite 20-30 times. Avoid talking while eating.',
  },

  // Fatigue recommendations
  {
    id: 'rec-fatigue-herbal-1',
    symptomIds: ['fatigue'],
    type: 'herbal',
    title: 'Ashwagandha',
    description: 'Ashwagandha is an adaptogen that helps combat fatigue and boost energy levels.',
    instructions: 'Take 1/4 tsp ashwagandha powder with warm milk before bed.',
    cautions: 'Consult a healthcare provider if pregnant or on medications.',
  },
  {
    id: 'rec-fatigue-herbal-2',
    symptomIds: ['fatigue'],
    type: 'herbal',
    title: 'Shatavari',
    description: 'Shatavari is excellent for women\'s health and helps restore energy during menstruation.',
    instructions: 'Mix 1/2 tsp shatavari powder in warm milk. Drink once daily.',
  },
  {
    id: 'rec-fatigue-yoga-1',
    symptomIds: ['fatigue'],
    type: 'yoga',
    title: 'Viparita Karani (Legs Up the Wall)',
    description: 'This restorative pose helps improve circulation and reduces fatigue.',
    instructions: 'Lie on your back with legs extended up against a wall. Stay for 5-10 minutes.',
  },
  {
    id: 'rec-fatigue-dietary-1',
    symptomIds: ['fatigue'],
    type: 'dietary',
    title: 'Iron-Rich Foods',
    description: 'Include iron-rich foods to combat fatigue caused by blood loss during menstruation.',
    instructions: 'Eat spinach, dates, pomegranate, and jaggery. Pair with vitamin C for better absorption.',
  },
  {
    id: 'rec-fatigue-lifestyle-1',
    symptomIds: ['fatigue'],
    type: 'lifestyle',
    title: 'Adequate Rest',
    description: 'Listen to your body and allow extra rest during menstruation.',
    instructions: 'Aim for 7-8 hours of sleep. Take short naps if needed.',
  },

  // Breast tenderness recommendations
  {
    id: 'rec-breast_tenderness-herbal-1',
    symptomIds: ['breast_tenderness'],
    type: 'herbal',
    title: 'Evening Primrose Oil',
    description: 'Evening primrose oil contains GLA which helps reduce breast tenderness.',
    instructions: 'Take as directed on the supplement label, typically 1-2 capsules daily.',
    cautions: 'Consult healthcare provider before starting supplements.',
  },
  {
    id: 'rec-breast_tenderness-herbal-2',
    symptomIds: ['breast_tenderness'],
    type: 'herbal',
    title: 'Castor Oil Pack',
    description: 'Castor oil has anti-inflammatory properties that can soothe breast tenderness.',
    instructions: 'Apply warm castor oil to breasts, cover with cloth, and rest for 30 minutes.',
  },
  {
    id: 'rec-breast_tenderness-yoga-1',
    symptomIds: ['breast_tenderness'],
    type: 'yoga',
    title: 'Gentle Chest Stretches',
    description: 'Gentle stretching can help relieve tension and discomfort in the chest area.',
    instructions: 'Stand in a doorway, place arms on frame, and lean forward gently. Hold for 30 seconds.',
  },
  {
    id: 'rec-breast_tenderness-dietary-1',
    symptomIds: ['breast_tenderness'],
    type: 'dietary',
    title: 'Reduce Salt and Caffeine',
    description: 'Salt and caffeine can worsen water retention and breast tenderness.',
    instructions: 'Limit salt intake and avoid coffee, tea, and chocolate during this time.',
  },
  {
    id: 'rec-breast_tenderness-lifestyle-1',
    symptomIds: ['breast_tenderness'],
    type: 'lifestyle',
    title: 'Supportive Bra',
    description: 'Wearing a well-fitted, supportive bra can reduce discomfort from breast tenderness.',
    instructions: 'Choose a comfortable sports bra or soft-cup bra during this time.',
  },

  // Mood swings recommendations
  {
    id: 'rec-mood_swings-herbal-1',
    symptomIds: ['mood_swings'],
    type: 'herbal',
    title: 'Chamomile Tea',
    description: 'Chamomile has calming properties that help stabilize mood fluctuations.',
    instructions: 'Steep chamomile flowers in hot water for 5 minutes. Drink 2-3 cups daily.',
  },
  {
    id: 'rec-mood_swings-herbal-2',
    symptomIds: ['mood_swings'],
    type: 'herbal',
    title: 'Jatamansi',
    description: 'Jatamansi is known for its mood-stabilizing and calming effects in Ayurveda.',
    instructions: 'Take 1/4 tsp jatamansi powder with warm water before bed.',
    cautions: 'Consult an Ayurvedic practitioner for proper dosage.',
  },
  {
    id: 'rec-mood_swings-yoga-1',
    symptomIds: ['mood_swings'],
    type: 'yoga',
    title: 'Pranayama (Breathing Exercises)',
    description: 'Controlled breathing helps balance emotions and calm the mind.',
    instructions: 'Practice Anulom Vilom (alternate nostril breathing) for 10 minutes daily.',
  },
  {
    id: 'rec-mood_swings-dietary-1',
    symptomIds: ['mood_swings'],
    type: 'dietary',
    title: 'Complex Carbohydrates',
    description: 'Complex carbs help maintain stable blood sugar levels, reducing mood swings.',
    instructions: 'Include whole grains, oats, and brown rice in your meals.',
  },
  {
    id: 'rec-mood_swings-lifestyle-1',
    symptomIds: ['mood_swings'],
    type: 'lifestyle',
    title: 'Regular Sleep Schedule',
    description: 'Consistent sleep patterns help regulate hormones and stabilize mood.',
    instructions: 'Go to bed and wake up at the same time daily, even on weekends.',
  },

  // Anxiety recommendations
  {
    id: 'rec-anxiety-herbal-1',
    symptomIds: ['anxiety'],
    type: 'herbal',
    title: 'Tulsi (Holy Basil) Tea',
    description: 'Tulsi is an adaptogen that helps reduce stress and anxiety.',
    instructions: 'Steep fresh or dried tulsi leaves in hot water for 5-10 minutes. Drink 2-3 times daily.',
  },
  {
    id: 'rec-anxiety-herbal-2',
    symptomIds: ['anxiety'],
    type: 'herbal',
    title: 'Shankhpushpi',
    description: 'Shankhpushpi is traditionally used to calm the mind and reduce anxiety.',
    instructions: 'Take 1/4 tsp shankhpushpi powder with warm milk before bed.',
  },
  {
    id: 'rec-anxiety-yoga-1',
    symptomIds: ['anxiety'],
    type: 'yoga',
    title: 'Bhramari Pranayama (Bee Breath)',
    description: 'This breathing technique has an immediate calming effect on the nervous system.',
    instructions: 'Close eyes, cover ears with thumbs, and hum like a bee while exhaling. Repeat 5-10 times.',
  },
  {
    id: 'rec-anxiety-dietary-1',
    symptomIds: ['anxiety'],
    type: 'dietary',
    title: 'Warm Milk with Nutmeg',
    description: 'Warm milk with nutmeg has natural calming properties that help reduce anxiety.',
    instructions: 'Add a pinch of nutmeg to warm milk and drink before bed.',
    cautions: 'Use nutmeg sparingly as large amounts can be harmful.',
  },
  {
    id: 'rec-anxiety-lifestyle-1',
    symptomIds: ['anxiety'],
    type: 'lifestyle',
    title: 'Abhyanga (Self-Massage)',
    description: 'Warm oil massage calms the nervous system and reduces anxiety.',
    instructions: 'Massage warm sesame oil on body before bathing. Focus on feet and scalp.',
  },

  // Irritability recommendations
  {
    id: 'rec-irritability-herbal-1',
    symptomIds: ['irritability'],
    type: 'herbal',
    title: 'Rose Water',
    description: 'Rose has cooling properties that help calm irritability and anger.',
    instructions: 'Add rose water to drinking water or spray on face for instant cooling effect.',
  },
  {
    id: 'rec-irritability-herbal-2',
    symptomIds: ['irritability'],
    type: 'herbal',
    title: 'Brahmi',
    description: 'Brahmi helps calm the mind and reduce irritability.',
    instructions: 'Take brahmi as tea or 1/4 tsp powder with warm water.',
  },
  {
    id: 'rec-irritability-yoga-1',
    symptomIds: ['irritability'],
    type: 'yoga',
    title: 'Sheetali Pranayama (Cooling Breath)',
    description: 'This cooling breath technique helps reduce heat and irritability in the body.',
    instructions: 'Roll tongue into a tube, inhale through it, close mouth, exhale through nose. Repeat 10 times.',
  },
  {
    id: 'rec-irritability-dietary-1',
    symptomIds: ['irritability'],
    type: 'dietary',
    title: 'Cooling Foods',
    description: 'Include cooling foods to balance pitta and reduce irritability.',
    instructions: 'Eat cucumber, coconut, mint, and sweet fruits. Avoid spicy and fried foods.',
  },
  {
    id: 'rec-irritability-lifestyle-1',
    symptomIds: ['irritability'],
    type: 'lifestyle',
    title: 'Nature Walks',
    description: 'Spending time in nature helps calm the mind and reduce irritability.',
    instructions: 'Take a 15-20 minute walk in a park or garden, preferably in the morning or evening.',
  },

  // Sadness recommendations
  {
    id: 'rec-sadness-herbal-1',
    symptomIds: ['sadness'],
    type: 'herbal',
    title: 'Saffron Milk',
    description: 'Saffron is known to uplift mood and combat feelings of sadness.',
    instructions: 'Add 2-3 strands of saffron to warm milk. Drink once daily.',
    cautions: 'Use genuine saffron in small quantities.',
  },
  {
    id: 'rec-sadness-herbal-2',
    symptomIds: ['sadness'],
    type: 'herbal',
    title: 'St. John\'s Wort',
    description: 'This herb has been traditionally used to support emotional well-being.',
    instructions: 'Take as directed on supplement label.',
    cautions: 'Can interact with medications. Consult healthcare provider first.',
  },
  {
    id: 'rec-sadness-yoga-1',
    symptomIds: ['sadness'],
    type: 'yoga',
    title: 'Surya Namaskar (Sun Salutation)',
    description: 'This energizing sequence helps lift mood and increase vitality.',
    instructions: 'Practice 5-10 rounds of sun salutation in the morning.',
  },
  {
    id: 'rec-sadness-dietary-1',
    symptomIds: ['sadness'],
    type: 'dietary',
    title: 'Omega-3 Rich Foods',
    description: 'Omega-3 fatty acids support brain health and help improve mood.',
    instructions: 'Include walnuts, flaxseeds, and chia seeds in your diet.',
  },
  {
    id: 'rec-sadness-lifestyle-1',
    symptomIds: ['sadness'],
    type: 'lifestyle',
    title: 'Sunlight Exposure',
    description: 'Natural sunlight helps boost serotonin levels and improve mood.',
    instructions: 'Spend 15-20 minutes in morning sunlight daily.',
  },
];

// Safety disclaimer
const SAFETY_DISCLAIMER = 'These Ayurvedic recommendations are for informational purposes only and should not be considered medical advice. Please consult with a qualified healthcare provider before starting any new treatment, especially if you are pregnant, nursing, or taking medications. If symptoms persist or worsen, seek professional medical attention.';

// ============================================
// Validation Functions
// ============================================

/**
 * Validates symptom log input data
 * @param input - The symptom log input to validate
 * @returns Array of validation errors, empty if valid
 */
function validateSymptomInput(input: Partial<SymptomLogInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate date is required
  if (!input.date) {
    errors.push({ field: 'date', message: 'date is required' });
  } else if (!validateDateFormat(input.date)) {
    errors.push({ field: 'date', message: 'date must be in ISO format (YYYY-MM-DD)' });
  }

  // Validate symptoms array is not empty
  if (!input.symptoms) {
    errors.push({ field: 'symptoms', message: 'symptoms is required' });
  } else if (!Array.isArray(input.symptoms)) {
    errors.push({ field: 'symptoms', message: 'symptoms must be an array' });
  } else if (input.symptoms.length === 0) {
    errors.push({ field: 'symptoms', message: 'symptoms array cannot be empty' });
  } else {
    // Validate each symptom
    input.symptoms.forEach((symptom, index) => {
      // Validate symptom id
      if (!symptom.id) {
        errors.push({ field: `symptoms[${index}].id`, message: `symptoms[${index}].id is required` });
      } else if (!ALL_VALID_SYMPTOMS.includes(symptom.id)) {
        errors.push({ field: `symptoms[${index}].id`, message: `symptoms[${index}].id '${symptom.id}' is not a valid symptom` });
      }

      // Validate category
      if (!symptom.category) {
        errors.push({ field: `symptoms[${index}].category`, message: `symptoms[${index}].category is required` });
      } else if (!validateEnum(symptom.category, [...VALID_CATEGORIES])) {
        errors.push({ field: `symptoms[${index}].category`, message: `symptoms[${index}].category must be one of: 'physical', 'emotional'` });
      }

      // Validate severity is in range 1-5
      if (symptom.severity === undefined || symptom.severity === null) {
        errors.push({ field: `symptoms[${index}].severity`, message: `symptoms[${index}].severity is required` });
      } else if (!validateRange(symptom.severity, MIN_SEVERITY, MAX_SEVERITY)) {
        errors.push({ field: `symptoms[${index}].severity`, message: `symptoms[${index}].severity must be between ${MIN_SEVERITY} and ${MAX_SEVERITY}` });
      }
    });
  }

  // Validate energyLevel
  if (!input.energyLevel) {
    errors.push({ field: 'energyLevel', message: 'energyLevel is required' });
  } else if (!validateEnum(input.energyLevel, [...VALID_ENERGY_LEVELS])) {
    errors.push({ field: 'energyLevel', message: "energyLevel must be one of: 'low', 'medium', 'high'" });
  }

  return errors;
}

// ============================================
// Database Operations
// ============================================

/**
 * Gets user's symptom history from DynamoDB
 */
async function getSymptoms(userId: string, startDate?: string, endDate?: string): Promise<SymptomEntry[]> {
  const pk = createUserKey(userId);
  
  let keyConditionExpression = 'PK = :pk AND begins_with(SK, :skPrefix)';
  const expressionAttributeValues: Record<string, unknown> = {
    ':pk': pk,
    ':skPrefix': 'SYMPTOM#',
  };

  // If date range is provided, use between condition
  if (startDate && endDate) {
    keyConditionExpression = 'PK = :pk AND SK BETWEEN :skStart AND :skEnd';
    expressionAttributeValues[':skStart'] = createSymptomKey(startDate);
    expressionAttributeValues[':skEnd'] = createSymptomKey(endDate) + 'Z'; // Add Z to include the end date
    delete expressionAttributeValues[':skPrefix'];
  }

  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ScanIndexForward: true, // Sort by SK ascending (chronological order)
  };

  const result = await docClient.send(new QueryCommand(params));
  return (result.Items || []) as SymptomEntry[];
}

/**
 * Creates a new symptom entry in DynamoDB
 */
async function createSymptomEntry(userId: string, input: SymptomLogInput): Promise<SymptomEntry> {
  const now = getCurrentISOTimestamp();
  const pk = createUserKey(userId);
  const sk = createSymptomKey(input.date);

  const symptomEntry: SymptomEntry = {
    PK: pk,
    SK: sk,
    userId,
    date: input.date,
    symptoms: input.symptoms,
    energyLevel: input.energyLevel,
    createdAt: now,
    updatedAt: now,
  };

  if (input.notes) {
    symptomEntry.notes = input.notes;
  }

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: symptomEntry,
    })
  );

  return symptomEntry;
}

/**
 * Gets a specific symptom entry by date
 */
async function getSymptomByDate(userId: string, date: string): Promise<SymptomEntry | null> {
  const pk = createUserKey(userId);
  const sk = createSymptomKey(date);

  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
    })
  );

  return result.Item as SymptomEntry | null;
}

// ============================================
// Recommendation Matching Logic
// ============================================

/**
 * Gets Ayurvedic recommendations based on logged symptoms
 * @param symptomIds - Array of symptom IDs to get recommendations for
 * @returns Object containing recommendations grouped by type and safety disclaimer
 */
function getRecommendationsForSymptoms(symptomIds: string[]): {
  recommendations: AyurvedicRecommendation[];
  byType: Record<RecommendationType, AyurvedicRecommendation[]>;
  disclaimer: string;
} {
  // Find all recommendations that match any of the logged symptoms
  const matchedRecommendations = AYURVEDIC_RECOMMENDATIONS.filter((rec) =>
    rec.symptomIds.some((symptomId) => symptomIds.includes(symptomId))
  );

  // Group recommendations by type
  const byType: Record<RecommendationType, AyurvedicRecommendation[]> = {
    herbal: [],
    dietary: [],
    yoga: [],
    lifestyle: [],
  };

  matchedRecommendations.forEach((rec) => {
    byType[rec.type].push(rec);
  });

  return {
    recommendations: matchedRecommendations,
    byType,
    disclaimer: SAFETY_DISCLAIMER,
  };
}

/**
 * Extracts userId from the event (from query params, headers, or path)
 */
function getUserId(event: APIGatewayProxyEvent): string | null {
  // Try query string parameters first
  if (event.queryStringParameters?.userId) {
    return event.queryStringParameters.userId;
  }

  // Try headers (e.g., from Cognito authorizer)
  if (event.requestContext?.authorizer?.claims?.sub) {
    return event.requestContext.authorizer.claims.sub as string;
  }

  // Try custom header
  if (event.headers?.['x-user-id']) {
    return event.headers['x-user-id'];
  }

  return null;
}

// ============================================
// Lambda Handler
// ============================================

/**
 * Lambda handler for symptom tracking operations
 * Endpoints:
 * - GET /symptoms - Get symptom history for user
 * - POST /symptoms - Log symptoms for a date
 * - GET /symptoms/recommendations - Get Ayurvedic recommendations based on symptoms
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path } = event;

    // Handle OPTIONS for CORS preflight
    if (httpMethod === 'OPTIONS') {
      return successResponse(200, {});
    }

    // Get userId from request
    const userId = getUserId(event);
    if (!userId) {
      return errorResponse(400, 'VALIDATION_ERROR', 'userId is required', ['userId']);
    }

    // Handle recommendations endpoint
    if (path.endsWith('/recommendations') && httpMethod === 'GET') {
      // Get symptom IDs from query parameters
      const symptomIdsParam = event.queryStringParameters?.symptomIds;
      
      if (!symptomIdsParam) {
        // If no symptom IDs provided, get recommendations based on recent symptoms
        const symptoms = await getSymptoms(userId);
        
        if (symptoms.length === 0) {
          return successResponse(200, {
            recommendations: [],
            byType: { herbal: [], dietary: [], yoga: [], lifestyle: [] },
            disclaimer: SAFETY_DISCLAIMER,
            message: 'No symptoms logged yet. Log symptoms to get personalized Ayurvedic recommendations.',
          });
        }

        // Get the most recent symptom entry
        const recentEntry = symptoms[symptoms.length - 1];
        const symptomIds = recentEntry.symptoms.map((s) => s.id);
        const result = getRecommendationsForSymptoms(symptomIds);

        return successResponse(200, {
          ...result,
          basedOn: {
            date: recentEntry.date,
            symptoms: recentEntry.symptoms,
          },
        });
      }

      // Parse symptom IDs from query parameter
      const symptomIds = symptomIdsParam.split(',').map((id) => id.trim());
      
      // Validate symptom IDs
      const invalidSymptoms = symptomIds.filter((id) => !ALL_VALID_SYMPTOMS.includes(id));
      if (invalidSymptoms.length > 0) {
        return errorResponse(
          400,
          'VALIDATION_ERROR',
          `Invalid symptom IDs: ${invalidSymptoms.join(', ')}`,
          ['symptomIds']
        );
      }

      const result = getRecommendationsForSymptoms(symptomIds);
      return successResponse(200, result);
    }

    // Handle base symptoms endpoint
    switch (httpMethod) {
      case 'GET': {
        // Get optional date range from query parameters
        const startDate = event.queryStringParameters?.startDate;
        const endDate = event.queryStringParameters?.endDate;

        // Validate date formats if provided
        if (startDate && !validateDateFormat(startDate)) {
          return errorResponse(400, 'VALIDATION_ERROR', 'startDate must be in ISO format (YYYY-MM-DD)', ['startDate']);
        }
        if (endDate && !validateDateFormat(endDate)) {
          return errorResponse(400, 'VALIDATION_ERROR', 'endDate must be in ISO format (YYYY-MM-DD)', ['endDate']);
        }

        const symptoms = await getSymptoms(userId, startDate, endDate);
        
        return successResponse(200, {
          symptoms,
          count: symptoms.length,
        });
      }

      case 'POST': {
        // Parse and validate request body
        let input: SymptomLogInput;
        try {
          input = event.body ? JSON.parse(event.body) : {};
        } catch {
          return errorResponse(400, 'VALIDATION_ERROR', 'Invalid JSON in request body');
        }

        // Validate input
        const errors = validateSymptomInput(input);
        if (errors.length > 0) {
          return errorResponse(
            400,
            'VALIDATION_ERROR',
            errors.map((e) => e.message).join('; '),
            errors.map((e) => e.field)
          );
        }

        // Check if entry already exists for this date
        const existingEntry = await getSymptomByDate(userId, input.date);
        if (existingEntry) {
          // Update existing entry by overwriting
          const updatedEntry = await createSymptomEntry(userId, input);
          return successResponse(200, {
            message: 'Symptoms updated successfully',
            symptom: updatedEntry,
            updated: true,
          });
        }

        // Create the symptom entry
        const symptomEntry = await createSymptomEntry(userId, input);

        // Get recommendations for the logged symptoms
        const symptomIds = input.symptoms.map((s) => s.id);
        const recommendations = getRecommendationsForSymptoms(symptomIds);

        return successResponse(201, {
          message: 'Symptoms logged successfully',
          symptom: symptomEntry,
          recommendations,
        });
      }

      default:
        return errorResponse(405, 'METHOD_NOT_ALLOWED', `Method ${httpMethod} not allowed`);
    }
  } catch (error) {
    console.error('Error in symptomHandler:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'An error occurred');
  }
};
