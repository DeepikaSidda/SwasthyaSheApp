import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  successResponse,
  errorResponse,
  validateEnum,
  createUserKey,
  getCurrentISOTimestamp,
  getCurrentISODate,
} from './utils';

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = process.env.USER_PROFILES_TABLE_NAME || 'SwasthyasheUserProfiles';

// ============================================
// Type Definitions
// ============================================

type DoshaType = 'vata' | 'pitta' | 'kapha';
type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
type ActivityType = 'yoga' | 'meditation' | 'exercise';

const VALID_DOSHAS: DoshaType[] = ['vata', 'pitta', 'kapha'];
const VALID_CYCLE_PHASES: CyclePhase[] = ['menstrual', 'follicular', 'ovulatory', 'luteal'];

interface DoshaProfile {
  primaryDosha: DoshaType;
  secondaryDosha?: DoshaType;
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;
  assessmentDate: string;
}

interface UserProfile {
  PK: string;
  SK: string;
  userId: string;
  doshaProfile?: DoshaProfile;
  createdAt: string;
  updatedAt: string;
}

interface DoshaAssessmentAnswer {
  questionId: string;
  doshaType: DoshaType;
}

interface DoshaAssessmentInput {
  answers: DoshaAssessmentAnswer[];
}


interface MealSuggestion {
  name: string;
  nameKey: string;
  description?: string;
  benefits?: string[];
}

interface DayMealPlan {
  day: string;
  breakfast: MealSuggestion;
  lunch: MealSuggestion;
  dinner: MealSuggestion;
  snacks: MealSuggestion[];
}

interface MealPlan {
  days: DayMealPlan[];
}

interface WellnessActivity {
  type: ActivityType;
  name: string;
  nameKey: string;
  duration: string;
  description: string;
  benefits: string[];
}

interface WellnessPlan {
  doshaType: DoshaType | null;
  cyclePhase: CyclePhase;
  mealPlan: MealPlan;
  activities: WellnessActivity[];
  herbsAndTeas: string[];
  foodsToAvoid: string[];
  tips: string[];
}

// ============================================
// Dosha Assessment Questions
// ============================================

interface DoshaQuestion {
  id: string;
  question: string;
  questionKey: string;
  category: string;
}

const DOSHA_QUESTIONS: DoshaQuestion[] = [
  { id: 'q1', question: 'What is your body frame?', questionKey: 'wellness.dosha.questions.bodyFrame', category: 'physical' },
  { id: 'q2', question: 'How is your skin type?', questionKey: 'wellness.dosha.questions.skinType', category: 'physical' },
  { id: 'q3', question: 'How is your hair texture?', questionKey: 'wellness.dosha.questions.hairTexture', category: 'physical' },
  { id: 'q4', question: 'How is your appetite?', questionKey: 'wellness.dosha.questions.appetite', category: 'digestion' },
  { id: 'q5', question: 'How is your digestion?', questionKey: 'wellness.dosha.questions.digestion', category: 'digestion' },
  { id: 'q6', question: 'How do you handle stress?', questionKey: 'wellness.dosha.questions.stress', category: 'mental' },
  { id: 'q7', question: 'How is your sleep pattern?', questionKey: 'wellness.dosha.questions.sleep', category: 'lifestyle' },
  { id: 'q8', question: 'What is your energy level throughout the day?', questionKey: 'wellness.dosha.questions.energy', category: 'lifestyle' },
  { id: 'q9', question: 'How do you make decisions?', questionKey: 'wellness.dosha.questions.decisions', category: 'mental' },
  { id: 'q10', question: 'What is your body temperature preference?', questionKey: 'wellness.dosha.questions.temperature', category: 'physical' },
  { id: 'q11', question: 'How is your memory?', questionKey: 'wellness.dosha.questions.memory', category: 'mental' },
  { id: 'q12', question: 'What is your walking pace?', questionKey: 'wellness.dosha.questions.walkingPace', category: 'physical' },
  { id: 'q13', question: 'How are your menstrual cycles typically?', questionKey: 'wellness.dosha.questions.menstrualCycle', category: 'womens_health' },
  { id: 'q14', question: 'How do you feel emotionally before your period?', questionKey: 'wellness.dosha.questions.prePeriodEmotions', category: 'womens_health' },
  { id: 'q15', question: 'How does your body respond to exercise?', questionKey: 'wellness.dosha.questions.exerciseResponse', category: 'lifestyle' },
];


// ============================================
// Meal Plan Data by Dosha and Cycle Phase
// ============================================

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Vata-balancing meals
const VATA_MEALS = {
  breakfast: [
    { name: 'Warm Oatmeal with Ghee', nameKey: 'wellness.meals.vata.warmOatmeal', description: 'Cooked oats with ghee, cinnamon, and dates', benefits: ['Grounding', 'Warming', 'Nourishing'] },
    { name: 'Rice Porridge (Kheer)', nameKey: 'wellness.meals.vata.riceKheer', description: 'Sweet rice pudding with cardamom', benefits: ['Calming', 'Easy to digest'] },
    { name: 'Warm Milk with Almonds', nameKey: 'wellness.meals.vata.almondMilk', description: 'Spiced warm milk with soaked almonds', benefits: ['Strengthening', 'Grounding'] },
    { name: 'Upma with Vegetables', nameKey: 'wellness.meals.vata.upma', description: 'Semolina porridge with mild spices', benefits: ['Warming', 'Satisfying'] },
    { name: 'Banana Pancakes', nameKey: 'wellness.meals.vata.bananaPancakes', description: 'Soft pancakes with ripe bananas', benefits: ['Sweet', 'Grounding'] },
    { name: 'Poha with Peanuts', nameKey: 'wellness.meals.vata.poha', description: 'Flattened rice with mild spices', benefits: ['Light', 'Easy to digest'] },
    { name: 'Sweet Potato Hash', nameKey: 'wellness.meals.vata.sweetPotato', description: 'Roasted sweet potatoes with ghee', benefits: ['Grounding', 'Nourishing'] },
  ],
  lunch: [
    { name: 'Dal with Rice', nameKey: 'wellness.meals.vata.dalRice', description: 'Yellow lentils with basmati rice and ghee', benefits: ['Protein-rich', 'Grounding'] },
    { name: 'Vegetable Khichdi', nameKey: 'wellness.meals.vata.khichdi', description: 'One-pot rice and lentil dish', benefits: ['Easy to digest', 'Balancing'] },
    { name: 'Paneer Curry with Roti', nameKey: 'wellness.meals.vata.paneerCurry', description: 'Mild paneer curry with whole wheat bread', benefits: ['Protein-rich', 'Satisfying'] },
    { name: 'Sambar with Rice', nameKey: 'wellness.meals.vata.sambarRice', description: 'Lentil vegetable stew with rice', benefits: ['Warming', 'Nourishing'] },
    { name: 'Vegetable Pulao', nameKey: 'wellness.meals.vata.vegPulao', description: 'Spiced rice with seasonal vegetables', benefits: ['Balanced', 'Flavorful'] },
    { name: 'Rajma Chawal', nameKey: 'wellness.meals.vata.rajmaChawal', description: 'Kidney beans curry with rice', benefits: ['Protein-rich', 'Grounding'] },
    { name: 'Palak Dal', nameKey: 'wellness.meals.vata.palakDal', description: 'Spinach lentils with rice', benefits: ['Iron-rich', 'Nourishing'] },
  ],
  dinner: [
    { name: 'Vegetable Soup with Bread', nameKey: 'wellness.meals.vata.vegSoup', description: 'Warm vegetable soup with whole grain bread', benefits: ['Light', 'Easy to digest'] },
    { name: 'Moong Dal Soup', nameKey: 'wellness.meals.vata.moongSoup', description: 'Light mung bean soup with spices', benefits: ['Detoxifying', 'Light'] },
    { name: 'Steamed Vegetables with Quinoa', nameKey: 'wellness.meals.vata.quinoaVeg', description: 'Lightly spiced vegetables with quinoa', benefits: ['Nutritious', 'Balanced'] },
    { name: 'Chapati with Sabzi', nameKey: 'wellness.meals.vata.chapatiSabzi', description: 'Whole wheat flatbread with vegetable curry', benefits: ['Satisfying', 'Warming'] },
    { name: 'Rice with Curd', nameKey: 'wellness.meals.vata.curdRice', description: 'Cooling rice with fresh yogurt', benefits: ['Probiotic', 'Soothing'] },
    { name: 'Idli with Sambar', nameKey: 'wellness.meals.vata.idliSambar', description: 'Steamed rice cakes with lentil soup', benefits: ['Light', 'Easy to digest'] },
    { name: 'Dalia Khichdi', nameKey: 'wellness.meals.vata.daliaKhichdi', description: 'Broken wheat with lentils', benefits: ['Fiber-rich', 'Warming'] },
  ],
  snacks: [
    { name: 'Soaked Almonds', nameKey: 'wellness.meals.vata.soakedAlmonds', benefits: ['Brain health', 'Energy'] },
    { name: 'Dates with Ghee', nameKey: 'wellness.meals.vata.datesGhee', benefits: ['Iron-rich', 'Energy boost'] },
    { name: 'Warm Milk', nameKey: 'wellness.meals.vata.warmMilk', benefits: ['Calming', 'Nourishing'] },
    { name: 'Banana', nameKey: 'wellness.meals.vata.banana', benefits: ['Energy', 'Potassium'] },
  ],
};


// Pitta-balancing meals
const PITTA_MEALS = {
  breakfast: [
    { name: 'Coconut Rice Flakes', nameKey: 'wellness.meals.pitta.coconutFlakes', description: 'Rice flakes with coconut and cooling spices', benefits: ['Cooling', 'Light'] },
    { name: 'Fresh Fruit Bowl', nameKey: 'wellness.meals.pitta.fruitBowl', description: 'Sweet seasonal fruits with mint', benefits: ['Cooling', 'Hydrating'] },
    { name: 'Oats with Coconut Milk', nameKey: 'wellness.meals.pitta.oatsCoconut', description: 'Cooling oatmeal with coconut milk', benefits: ['Soothing', 'Nutritious'] },
    { name: 'Cucumber Raita with Paratha', nameKey: 'wellness.meals.pitta.raitaParatha', description: 'Cooling yogurt with flatbread', benefits: ['Cooling', 'Satisfying'] },
    { name: 'Melon Smoothie', nameKey: 'wellness.meals.pitta.melonSmoothie', description: 'Blended melon with mint', benefits: ['Hydrating', 'Cooling'] },
    { name: 'Rice Idli with Coconut Chutney', nameKey: 'wellness.meals.pitta.idliChutney', description: 'Steamed rice cakes with coconut', benefits: ['Light', 'Cooling'] },
    { name: 'Muesli with Milk', nameKey: 'wellness.meals.pitta.muesli', description: 'Cold muesli with fresh milk', benefits: ['Fiber-rich', 'Cooling'] },
  ],
  lunch: [
    { name: 'Coconut Rice with Vegetables', nameKey: 'wellness.meals.pitta.coconutRice', description: 'Fragrant rice with coconut and mild vegetables', benefits: ['Cooling', 'Satisfying'] },
    { name: 'Cucumber Salad with Dal', nameKey: 'wellness.meals.pitta.cucumberDal', description: 'Fresh salad with mild lentils', benefits: ['Cooling', 'Protein-rich'] },
    { name: 'Curd Rice', nameKey: 'wellness.meals.pitta.curdRice', description: 'Cooling yogurt rice with pomegranate', benefits: ['Probiotic', 'Cooling'] },
    { name: 'Mint Pulao', nameKey: 'wellness.meals.pitta.mintPulao', description: 'Rice with fresh mint and mild spices', benefits: ['Cooling', 'Aromatic'] },
    { name: 'Lauki Kofta', nameKey: 'wellness.meals.pitta.laukiKofta', description: 'Bottle gourd dumplings in mild gravy', benefits: ['Cooling', 'Light'] },
    { name: 'Moong Dal with Rice', nameKey: 'wellness.meals.pitta.moongRice', description: 'Light mung lentils with rice', benefits: ['Easy to digest', 'Cooling'] },
    { name: 'Vegetable Biryani (mild)', nameKey: 'wellness.meals.pitta.mildBiryani', description: 'Fragrant rice with vegetables, mild spices', benefits: ['Flavorful', 'Balanced'] },
  ],
  dinner: [
    { name: 'Lauki Soup', nameKey: 'wellness.meals.pitta.laukiSoup', description: 'Cooling bottle gourd soup', benefits: ['Light', 'Cooling'] },
    { name: 'Steamed Vegetables with Ghee', nameKey: 'wellness.meals.pitta.steamedVeg', description: 'Lightly steamed vegetables with ghee', benefits: ['Nutritious', 'Easy to digest'] },
    { name: 'Khichdi with Cucumber Raita', nameKey: 'wellness.meals.pitta.khichdiRaita', description: 'Light rice-lentil dish with cooling raita', benefits: ['Balanced', 'Soothing'] },
    { name: 'Chapati with Palak', nameKey: 'wellness.meals.pitta.chapatiPalak', description: 'Flatbread with mild spinach curry', benefits: ['Iron-rich', 'Light'] },
    { name: 'Rice with Kadhi', nameKey: 'wellness.meals.pitta.riceKadhi', description: 'Rice with yogurt-based curry', benefits: ['Probiotic', 'Cooling'] },
    { name: 'Dosa with Sambar', nameKey: 'wellness.meals.pitta.dosaSambar', description: 'Crispy crepe with mild lentil soup', benefits: ['Light', 'Satisfying'] },
    { name: 'Vegetable Uttapam', nameKey: 'wellness.meals.pitta.uttapam', description: 'Thick pancake with vegetables', benefits: ['Nutritious', 'Easy to digest'] },
  ],
  snacks: [
    { name: 'Coconut Water', nameKey: 'wellness.meals.pitta.coconutWater', benefits: ['Hydrating', 'Cooling'] },
    { name: 'Sweet Grapes', nameKey: 'wellness.meals.pitta.grapes', benefits: ['Cooling', 'Antioxidants'] },
    { name: 'Cucumber Slices', nameKey: 'wellness.meals.pitta.cucumber', benefits: ['Hydrating', 'Cooling'] },
    { name: 'Pomegranate', nameKey: 'wellness.meals.pitta.pomegranate', benefits: ['Cooling', 'Iron-rich'] },
  ],
};


// Kapha-balancing meals
const KAPHA_MEALS = {
  breakfast: [
    { name: 'Warm Ginger Tea with Light Toast', nameKey: 'wellness.meals.kapha.gingerToast', description: 'Stimulating ginger tea with dry toast', benefits: ['Stimulating', 'Light'] },
    { name: 'Spiced Apple', nameKey: 'wellness.meals.kapha.spicedApple', description: 'Baked apple with cinnamon and cloves', benefits: ['Warming', 'Light'] },
    { name: 'Vegetable Upma', nameKey: 'wellness.meals.kapha.vegUpma', description: 'Light semolina with vegetables and spices', benefits: ['Stimulating', 'Low-fat'] },
    { name: 'Millet Porridge', nameKey: 'wellness.meals.kapha.milletPorridge', description: 'Light millet with warming spices', benefits: ['Fiber-rich', 'Energizing'] },
    { name: 'Sprouts Salad', nameKey: 'wellness.meals.kapha.sproutsSalad', description: 'Fresh sprouts with lemon and spices', benefits: ['Protein-rich', 'Light'] },
    { name: 'Besan Chilla', nameKey: 'wellness.meals.kapha.besanChilla', description: 'Spiced chickpea flour pancake', benefits: ['Protein-rich', 'Stimulating'] },
    { name: 'Honey Lemon Water', nameKey: 'wellness.meals.kapha.honeyLemon', description: 'Warm water with honey and lemon', benefits: ['Detoxifying', 'Energizing'] },
  ],
  lunch: [
    { name: 'Spiced Vegetable Stir-fry', nameKey: 'wellness.meals.kapha.vegStirfry', description: 'Lightly cooked vegetables with warming spices', benefits: ['Light', 'Stimulating'] },
    { name: 'Barley Soup', nameKey: 'wellness.meals.kapha.barleySoup', description: 'Hearty barley soup with vegetables', benefits: ['Fiber-rich', 'Satisfying'] },
    { name: 'Millet with Vegetables', nameKey: 'wellness.meals.kapha.milletVeg', description: 'Light millet with spiced vegetables', benefits: ['Low-fat', 'Energizing'] },
    { name: 'Spiced Lentil Soup', nameKey: 'wellness.meals.kapha.lentilSoup', description: 'Light dal with black pepper and ginger', benefits: ['Protein-rich', 'Warming'] },
    { name: 'Vegetable Curry (dry)', nameKey: 'wellness.meals.kapha.dryCurry', description: 'Dry vegetable curry with minimal oil', benefits: ['Light', 'Flavorful'] },
    { name: 'Quinoa Salad', nameKey: 'wellness.meals.kapha.quinoaSalad', description: 'Light quinoa with vegetables and lemon', benefits: ['Protein-rich', 'Light'] },
    { name: 'Ragi Roti with Sabzi', nameKey: 'wellness.meals.kapha.ragiRoti', description: 'Finger millet flatbread with vegetables', benefits: ['Calcium-rich', 'Light'] },
  ],
  dinner: [
    { name: 'Clear Vegetable Soup', nameKey: 'wellness.meals.kapha.clearSoup', description: 'Light broth with vegetables and spices', benefits: ['Light', 'Easy to digest'] },
    { name: 'Steamed Greens', nameKey: 'wellness.meals.kapha.steamedGreens', description: 'Lightly steamed leafy greens with spices', benefits: ['Detoxifying', 'Light'] },
    { name: 'Moong Sprouts', nameKey: 'wellness.meals.kapha.moongSprouts', description: 'Spiced mung bean sprouts', benefits: ['Protein-rich', 'Light'] },
    { name: 'Vegetable Stew', nameKey: 'wellness.meals.kapha.vegStew', description: 'Light vegetable stew with warming spices', benefits: ['Nutritious', 'Easy to digest'] },
    { name: 'Bajra Roti with Greens', nameKey: 'wellness.meals.kapha.bajraRoti', description: 'Pearl millet flatbread with leafy vegetables', benefits: ['Warming', 'Fiber-rich'] },
    { name: 'Tomato Rasam', nameKey: 'wellness.meals.kapha.rasam', description: 'Spiced tomato soup with pepper', benefits: ['Stimulating', 'Light'] },
    { name: 'Grilled Vegetables', nameKey: 'wellness.meals.kapha.grilledVeg', description: 'Lightly grilled vegetables with herbs', benefits: ['Light', 'Flavorful'] },
  ],
  snacks: [
    { name: 'Roasted Chickpeas', nameKey: 'wellness.meals.kapha.roastedChickpeas', benefits: ['Protein-rich', 'Crunchy'] },
    { name: 'Apple Slices', nameKey: 'wellness.meals.kapha.appleSlices', benefits: ['Light', 'Fiber-rich'] },
    { name: 'Ginger Tea', nameKey: 'wellness.meals.kapha.gingerTea', benefits: ['Stimulating', 'Warming'] },
    { name: 'Puffed Rice', nameKey: 'wellness.meals.kapha.puffedRice', benefits: ['Light', 'Low-calorie'] },
  ],
};


// Generic meals for users without dosha profile
const GENERIC_MEALS = {
  breakfast: [
    { name: 'Oatmeal with Fruits', nameKey: 'wellness.meals.generic.oatmealFruits', description: 'Warm oatmeal with seasonal fruits', benefits: ['Fiber-rich', 'Energizing'] },
    { name: 'Idli with Chutney', nameKey: 'wellness.meals.generic.idliChutney', description: 'Steamed rice cakes with coconut chutney', benefits: ['Light', 'Easy to digest'] },
    { name: 'Poha', nameKey: 'wellness.meals.generic.poha', description: 'Flattened rice with vegetables', benefits: ['Light', 'Quick energy'] },
    { name: 'Upma', nameKey: 'wellness.meals.generic.upma', description: 'Semolina porridge with vegetables', benefits: ['Satisfying', 'Nutritious'] },
    { name: 'Fresh Fruit Smoothie', nameKey: 'wellness.meals.generic.smoothie', description: 'Blended fruits with yogurt', benefits: ['Refreshing', 'Vitamin-rich'] },
    { name: 'Paratha with Curd', nameKey: 'wellness.meals.generic.parathaCurd', description: 'Whole wheat flatbread with yogurt', benefits: ['Satisfying', 'Probiotic'] },
    { name: 'Dosa with Sambar', nameKey: 'wellness.meals.generic.dosaSambar', description: 'Crispy crepe with lentil soup', benefits: ['Protein-rich', 'Satisfying'] },
  ],
  lunch: [
    { name: 'Dal Rice', nameKey: 'wellness.meals.generic.dalRice', description: 'Lentils with rice and vegetables', benefits: ['Balanced', 'Protein-rich'] },
    { name: 'Vegetable Biryani', nameKey: 'wellness.meals.generic.biryani', description: 'Fragrant rice with mixed vegetables', benefits: ['Flavorful', 'Satisfying'] },
    { name: 'Roti with Sabzi', nameKey: 'wellness.meals.generic.rotiSabzi', description: 'Whole wheat bread with vegetable curry', benefits: ['Fiber-rich', 'Nutritious'] },
    { name: 'Curd Rice', nameKey: 'wellness.meals.generic.curdRice', description: 'Cooling rice with yogurt', benefits: ['Probiotic', 'Soothing'] },
    { name: 'Khichdi', nameKey: 'wellness.meals.generic.khichdi', description: 'Rice and lentil comfort food', benefits: ['Easy to digest', 'Balanced'] },
    { name: 'Vegetable Pulao', nameKey: 'wellness.meals.generic.pulao', description: 'Spiced rice with vegetables', benefits: ['Flavorful', 'Nutritious'] },
    { name: 'Sambar Rice', nameKey: 'wellness.meals.generic.sambarRice', description: 'Rice with lentil vegetable stew', benefits: ['Protein-rich', 'Satisfying'] },
  ],
  dinner: [
    { name: 'Vegetable Soup', nameKey: 'wellness.meals.generic.vegSoup', description: 'Warm vegetable soup', benefits: ['Light', 'Nutritious'] },
    { name: 'Chapati with Dal', nameKey: 'wellness.meals.generic.chapatiDal', description: 'Flatbread with lentils', benefits: ['Balanced', 'Satisfying'] },
    { name: 'Rice with Kadhi', nameKey: 'wellness.meals.generic.riceKadhi', description: 'Rice with yogurt curry', benefits: ['Probiotic', 'Comforting'] },
    { name: 'Moong Dal Khichdi', nameKey: 'wellness.meals.generic.moongKhichdi', description: 'Light mung bean rice dish', benefits: ['Easy to digest', 'Light'] },
    { name: 'Vegetable Uttapam', nameKey: 'wellness.meals.generic.uttapam', description: 'Thick pancake with vegetables', benefits: ['Nutritious', 'Satisfying'] },
    { name: 'Palak Roti', nameKey: 'wellness.meals.generic.palakRoti', description: 'Spinach flatbread with vegetables', benefits: ['Iron-rich', 'Nutritious'] },
    { name: 'Light Khichdi', nameKey: 'wellness.meals.generic.lightKhichdi', description: 'Simple rice and lentil dish', benefits: ['Soothing', 'Easy to digest'] },
  ],
  snacks: [
    { name: 'Fresh Fruits', nameKey: 'wellness.meals.generic.fruits', benefits: ['Vitamin-rich', 'Hydrating'] },
    { name: 'Nuts Mix', nameKey: 'wellness.meals.generic.nuts', benefits: ['Protein-rich', 'Energy'] },
    { name: 'Buttermilk', nameKey: 'wellness.meals.generic.buttermilk', benefits: ['Probiotic', 'Cooling'] },
    { name: 'Roasted Makhana', nameKey: 'wellness.meals.generic.makhana', benefits: ['Light', 'Nutritious'] },
  ],
};


// ============================================
// Activity Recommendations by Dosha and Cycle Phase
// ============================================

const VATA_ACTIVITIES: Record<CyclePhase, WellnessActivity[]> = {
  menstrual: [
    { type: 'yoga', name: 'Restorative Yoga', nameKey: 'wellness.activities.vata.restorativeYoga', duration: '20-30 min', description: 'Gentle, supported poses to calm the nervous system', benefits: ['Grounding', 'Calming', 'Reduces anxiety'] },
    { type: 'meditation', name: 'Body Scan Meditation', nameKey: 'wellness.activities.vata.bodyScan', duration: '15 min', description: 'Guided relaxation focusing on each body part', benefits: ['Deep relaxation', 'Reduces tension'] },
    { type: 'exercise', name: 'Gentle Walking', nameKey: 'wellness.activities.vata.gentleWalking', duration: '15-20 min', description: 'Slow, mindful walking in nature', benefits: ['Grounding', 'Gentle movement'] },
  ],
  follicular: [
    { type: 'yoga', name: 'Hatha Yoga', nameKey: 'wellness.activities.vata.hathaYoga', duration: '30-45 min', description: 'Balanced practice with standing and seated poses', benefits: ['Strength building', 'Flexibility'] },
    { type: 'meditation', name: 'Breath Awareness', nameKey: 'wellness.activities.vata.breathAwareness', duration: '10-15 min', description: 'Focus on natural breath rhythm', benefits: ['Calming', 'Centering'] },
    { type: 'exercise', name: 'Swimming', nameKey: 'wellness.activities.vata.swimming', duration: '30 min', description: 'Gentle swimming or water exercises', benefits: ['Low impact', 'Full body workout'] },
  ],
  ovulatory: [
    { type: 'yoga', name: 'Vinyasa Flow', nameKey: 'wellness.activities.vata.vinyasaFlow', duration: '45 min', description: 'Dynamic flowing sequences', benefits: ['Energy boost', 'Strength'] },
    { type: 'meditation', name: 'Loving-Kindness Meditation', nameKey: 'wellness.activities.vata.lovingKindness', duration: '15 min', description: 'Cultivating compassion and connection', benefits: ['Emotional balance', 'Heart opening'] },
    { type: 'exercise', name: 'Dance', nameKey: 'wellness.activities.vata.dance', duration: '30-45 min', description: 'Expressive movement and dance', benefits: ['Joy', 'Creative expression'] },
  ],
  luteal: [
    { type: 'yoga', name: 'Yin Yoga', nameKey: 'wellness.activities.vata.yinYoga', duration: '30-45 min', description: 'Long-held passive stretches', benefits: ['Deep release', 'Calming'] },
    { type: 'meditation', name: 'Yoga Nidra', nameKey: 'wellness.activities.vata.yogaNidra', duration: '20-30 min', description: 'Guided deep relaxation practice', benefits: ['Deep rest', 'Stress relief'] },
    { type: 'exercise', name: 'Tai Chi', nameKey: 'wellness.activities.vata.taiChi', duration: '20-30 min', description: 'Slow, flowing movements', benefits: ['Balance', 'Grounding'] },
  ],
};

const PITTA_ACTIVITIES: Record<CyclePhase, WellnessActivity[]> = {
  menstrual: [
    { type: 'yoga', name: 'Cooling Yoga', nameKey: 'wellness.activities.pitta.coolingYoga', duration: '20-30 min', description: 'Gentle poses with cooling breath', benefits: ['Cooling', 'Calming'] },
    { type: 'meditation', name: 'Moon Meditation', nameKey: 'wellness.activities.pitta.moonMeditation', duration: '15 min', description: 'Visualization of cool moonlight', benefits: ['Cooling', 'Soothing'] },
    { type: 'exercise', name: 'Leisurely Swimming', nameKey: 'wellness.activities.pitta.leisureSwim', duration: '20 min', description: 'Gentle swimming in cool water', benefits: ['Cooling', 'Refreshing'] },
  ],
  follicular: [
    { type: 'yoga', name: 'Moon Salutation', nameKey: 'wellness.activities.pitta.moonSalutation', duration: '30 min', description: 'Cooling lunar flow sequence', benefits: ['Balancing', 'Calming'] },
    { type: 'meditation', name: 'Sheetali Pranayama', nameKey: 'wellness.activities.pitta.sheetali', duration: '10 min', description: 'Cooling breath practice', benefits: ['Reduces heat', 'Calming'] },
    { type: 'exercise', name: 'Morning Walk', nameKey: 'wellness.activities.pitta.morningWalk', duration: '30 min', description: 'Walk during cooler morning hours', benefits: ['Refreshing', 'Energizing'] },
  ],
  ovulatory: [
    { type: 'yoga', name: 'Moderate Vinyasa', nameKey: 'wellness.activities.pitta.moderateVinyasa', duration: '40 min', description: 'Balanced flow without overheating', benefits: ['Strength', 'Balance'] },
    { type: 'meditation', name: 'Compassion Meditation', nameKey: 'wellness.activities.pitta.compassion', duration: '15 min', description: 'Cultivating patience and compassion', benefits: ['Emotional balance', 'Cooling anger'] },
    { type: 'exercise', name: 'Cycling', nameKey: 'wellness.activities.pitta.cycling', duration: '30-45 min', description: 'Moderate cycling in cool weather', benefits: ['Cardio', 'Enjoyable'] },
  ],
  luteal: [
    { type: 'yoga', name: 'Restorative Yoga', nameKey: 'wellness.activities.pitta.restorativeYoga', duration: '30 min', description: 'Supported poses for deep relaxation', benefits: ['Cooling', 'Calming'] },
    { type: 'meditation', name: 'Guided Relaxation', nameKey: 'wellness.activities.pitta.guidedRelax', duration: '20 min', description: 'Progressive muscle relaxation', benefits: ['Stress relief', 'Cooling'] },
    { type: 'exercise', name: 'Nature Walk', nameKey: 'wellness.activities.pitta.natureWalk', duration: '30 min', description: 'Walking near water or in shade', benefits: ['Cooling', 'Grounding'] },
  ],
};


const KAPHA_ACTIVITIES: Record<CyclePhase, WellnessActivity[]> = {
  menstrual: [
    { type: 'yoga', name: 'Gentle Flow Yoga', nameKey: 'wellness.activities.kapha.gentleFlow', duration: '25-30 min', description: 'Light movement to maintain energy', benefits: ['Stimulating', 'Warming'] },
    { type: 'meditation', name: 'Energizing Breath', nameKey: 'wellness.activities.kapha.energizingBreath', duration: '10 min', description: 'Kapalabhati and ujjayi breathing', benefits: ['Energizing', 'Clearing'] },
    { type: 'exercise', name: 'Light Stretching', nameKey: 'wellness.activities.kapha.lightStretch', duration: '15-20 min', description: 'Gentle stretches to keep energy moving', benefits: ['Prevents stagnation', 'Warming'] },
  ],
  follicular: [
    { type: 'yoga', name: 'Power Yoga', nameKey: 'wellness.activities.kapha.powerYoga', duration: '45 min', description: 'Dynamic, strength-building practice', benefits: ['Energizing', 'Strength building'] },
    { type: 'meditation', name: 'Walking Meditation', nameKey: 'wellness.activities.kapha.walkingMed', duration: '15 min', description: 'Mindful walking practice', benefits: ['Movement', 'Awareness'] },
    { type: 'exercise', name: 'Jogging', nameKey: 'wellness.activities.kapha.jogging', duration: '30-40 min', description: 'Moderate pace running', benefits: ['Cardio', 'Energizing'] },
  ],
  ovulatory: [
    { type: 'yoga', name: 'Ashtanga Yoga', nameKey: 'wellness.activities.kapha.ashtanga', duration: '60 min', description: 'Vigorous, structured practice', benefits: ['Strength', 'Discipline'] },
    { type: 'meditation', name: 'Active Visualization', nameKey: 'wellness.activities.kapha.visualization', duration: '10 min', description: 'Energizing imagery and affirmations', benefits: ['Motivation', 'Energy'] },
    { type: 'exercise', name: 'HIIT Workout', nameKey: 'wellness.activities.kapha.hiit', duration: '30 min', description: 'High-intensity interval training', benefits: ['Fat burning', 'Energizing'] },
  ],
  luteal: [
    { type: 'yoga', name: 'Moderate Vinyasa', nameKey: 'wellness.activities.kapha.moderateVinyasa', duration: '40 min', description: 'Flowing practice with moderate intensity', benefits: ['Maintains energy', 'Balancing'] },
    { type: 'meditation', name: 'Breath of Fire', nameKey: 'wellness.activities.kapha.breathOfFire', duration: '10 min', description: 'Stimulating breath practice', benefits: ['Energizing', 'Clearing'] },
    { type: 'exercise', name: 'Brisk Walking', nameKey: 'wellness.activities.kapha.briskWalking', duration: '30-45 min', description: 'Fast-paced walking', benefits: ['Cardio', 'Prevents sluggishness'] },
  ],
};

const GENERIC_ACTIVITIES: Record<CyclePhase, WellnessActivity[]> = {
  menstrual: [
    { type: 'yoga', name: 'Gentle Yoga', nameKey: 'wellness.activities.generic.gentleYoga', duration: '20-30 min', description: 'Soft, nurturing practice', benefits: ['Relaxing', 'Supportive'] },
    { type: 'meditation', name: 'Deep Breathing', nameKey: 'wellness.activities.generic.deepBreathing', duration: '10-15 min', description: 'Slow, deep breathing exercises', benefits: ['Calming', 'Centering'] },
    { type: 'exercise', name: 'Light Walking', nameKey: 'wellness.activities.generic.lightWalking', duration: '15-20 min', description: 'Gentle, easy-paced walking', benefits: ['Gentle movement', 'Fresh air'] },
  ],
  follicular: [
    { type: 'yoga', name: 'Hatha Yoga', nameKey: 'wellness.activities.generic.hathaYoga', duration: '30-45 min', description: 'Balanced yoga practice', benefits: ['Strength', 'Flexibility'] },
    { type: 'meditation', name: 'Mindfulness Meditation', nameKey: 'wellness.activities.generic.mindfulness', duration: '15 min', description: 'Present moment awareness', benefits: ['Focus', 'Clarity'] },
    { type: 'exercise', name: 'Moderate Cardio', nameKey: 'wellness.activities.generic.moderateCardio', duration: '30 min', description: 'Walking, cycling, or swimming', benefits: ['Heart health', 'Energy'] },
  ],
  ovulatory: [
    { type: 'yoga', name: 'Dynamic Yoga', nameKey: 'wellness.activities.generic.dynamicYoga', duration: '45 min', description: 'Energetic flowing practice', benefits: ['Energy', 'Strength'] },
    { type: 'meditation', name: 'Gratitude Meditation', nameKey: 'wellness.activities.generic.gratitude', duration: '10 min', description: 'Focusing on appreciation', benefits: ['Positive mindset', 'Joy'] },
    { type: 'exercise', name: 'Active Exercise', nameKey: 'wellness.activities.generic.activeExercise', duration: '45 min', description: 'Your favorite workout', benefits: ['Peak performance', 'Strength'] },
  ],
  luteal: [
    { type: 'yoga', name: 'Restorative Yoga', nameKey: 'wellness.activities.generic.restorativeYoga', duration: '30 min', description: 'Supported, relaxing poses', benefits: ['Deep rest', 'Stress relief'] },
    { type: 'meditation', name: 'Body Relaxation', nameKey: 'wellness.activities.generic.bodyRelax', duration: '15-20 min', description: 'Progressive relaxation', benefits: ['Tension release', 'Calm'] },
    { type: 'exercise', name: 'Gentle Movement', nameKey: 'wellness.activities.generic.gentleMovement', duration: '20-30 min', description: 'Light stretching or walking', benefits: ['Maintains mobility', 'Relaxing'] },
  ],
};


// ============================================
// Herbs, Teas, and Foods to Avoid by Dosha
// ============================================

const DOSHA_HERBS_TEAS: Record<DoshaType, string[]> = {
  vata: [
    'Ashwagandha tea',
    'Ginger tea',
    'Cinnamon tea',
    'Licorice root tea',
    'Chamomile tea',
    'Warm milk with nutmeg',
  ],
  pitta: [
    'Mint tea',
    'Rose tea',
    'Fennel tea',
    'Coriander tea',
    'Coconut water',
    'Aloe vera juice',
  ],
  kapha: [
    'Ginger tea',
    'Tulsi (Holy Basil) tea',
    'Green tea',
    'Cinnamon tea',
    'Black pepper tea',
    'Turmeric golden milk',
  ],
};

const DOSHA_FOODS_TO_AVOID: Record<DoshaType, string[]> = {
  vata: [
    'Raw vegetables',
    'Cold foods and drinks',
    'Dried fruits (unless soaked)',
    'Beans (except mung)',
    'Caffeine',
    'Carbonated drinks',
  ],
  pitta: [
    'Spicy foods',
    'Sour foods',
    'Fermented foods',
    'Alcohol',
    'Coffee',
    'Fried foods',
  ],
  kapha: [
    'Heavy, oily foods',
    'Dairy products',
    'Sweet foods',
    'Cold foods and drinks',
    'Wheat products',
    'Red meat',
  ],
};

const GENERIC_HERBS_TEAS = [
  'Chamomile tea',
  'Ginger tea',
  'Mint tea',
  'Tulsi tea',
  'Warm water with lemon',
];

const GENERIC_FOODS_TO_AVOID = [
  'Processed foods',
  'Excessive caffeine',
  'Alcohol',
  'Very spicy foods',
  'Excessive sugar',
];

// ============================================
// Tips by Dosha and Cycle Phase
// ============================================

const CYCLE_PHASE_TIPS: Record<CyclePhase, Record<DoshaType | 'generic', string[]>> = {
  menstrual: {
    vata: [
      'Rest as much as possible during the first 2-3 days',
      'Keep warm with blankets and warm drinks',
      'Avoid cold foods and drinks',
      'Practice gentle self-massage with warm sesame oil',
      'Go to bed early and maintain a regular sleep schedule',
    ],
    pitta: [
      'Stay cool and avoid overheating',
      'Practice cooling breathing exercises',
      'Avoid intense exercise and competition',
      'Eat cooling, sweet foods',
      'Spend time near water or in nature',
    ],
    kapha: [
      'Maintain light movement even during rest',
      'Avoid sleeping during the day',
      'Eat light, warm, spiced foods',
      'Stay warm and dry',
      'Practice gentle breathing exercises',
    ],
    generic: [
      'Listen to your body and rest when needed',
      'Stay hydrated with warm fluids',
      'Avoid strenuous exercise',
      'Practice self-care and relaxation',
      'Eat nourishing, easy-to-digest foods',
    ],
  },
  follicular: {
    vata: [
      'Gradually increase activity levels',
      'Maintain regular meal times',
      'Include grounding foods in your diet',
      'Practice creative activities',
      'Stay warm during exercise',
    ],
    pitta: [
      'Channel your increasing energy productively',
      'Avoid overworking or overheating',
      'Include cooling foods in your diet',
      'Practice patience and compassion',
      'Exercise during cooler parts of the day',
    ],
    kapha: [
      'Take advantage of increasing energy',
      'Try new activities and challenges',
      'Eat lighter meals',
      'Wake up early and stay active',
      'Avoid heavy, oily foods',
    ],
    generic: [
      'Energy is building - great time for new projects',
      'Increase exercise intensity gradually',
      'Focus on nutrient-rich foods',
      'Set intentions for the month ahead',
      'Socialize and connect with others',
    ],
  },
  ovulatory: {
    vata: [
      'Enjoy social activities but don\'t overextend',
      'Maintain grounding practices',
      'Stay hydrated',
      'Balance activity with rest',
      'Eat regular, nourishing meals',
    ],
    pitta: [
      'Channel high energy into meaningful activities',
      'Avoid competitive or heated situations',
      'Stay cool and hydrated',
      'Practice moderation in all things',
      'Include plenty of cooling foods',
    ],
    kapha: [
      'This is your peak energy time - use it well',
      'Challenge yourself with vigorous exercise',
      'Eat light, stimulating foods',
      'Avoid heavy meals and oversleeping',
      'Engage in stimulating activities',
    ],
    generic: [
      'Peak energy phase - ideal for important tasks',
      'Great time for communication and connection',
      'Enjoy physical activities',
      'Stay hydrated and well-nourished',
      'Express creativity and confidence',
    ],
  },
  luteal: {
    vata: [
      'Slow down as energy decreases',
      'Prioritize rest and relaxation',
      'Eat warm, grounding foods',
      'Practice calming activities',
      'Avoid overstimulation',
    ],
    pitta: [
      'Practice patience as emotions may intensify',
      'Avoid making major decisions when irritated',
      'Include cooling, sweet foods',
      'Practice relaxation techniques',
      'Spend time in nature',
    ],
    kapha: [
      'Maintain some activity to prevent sluggishness',
      'Eat light, warm foods',
      'Avoid emotional eating',
      'Practice stimulating breathing exercises',
      'Stay engaged but don\'t overcommit',
    ],
    generic: [
      'Energy is winding down - honor this',
      'Practice self-compassion',
      'Reduce commitments if possible',
      'Eat comfort foods in moderation',
      'Prepare for your upcoming period',
    ],
  },
};


// ============================================
// Dosha Assessment Scoring Logic
// ============================================

interface DoshaScores {
  vata: number;
  pitta: number;
  kapha: number;
}

/**
 * Calculates dosha scores from assessment answers
 * @param answers - Array of assessment answers with dosha type
 * @returns Dosha scores for vata, pitta, and kapha
 */
function calculateDoshaScores(answers: DoshaAssessmentAnswer[]): DoshaScores {
  const scores: DoshaScores = { vata: 0, pitta: 0, kapha: 0 };

  for (const answer of answers) {
    if (VALID_DOSHAS.includes(answer.doshaType)) {
      scores[answer.doshaType]++;
    }
  }

  return scores;
}

/**
 * Determines primary and secondary dosha from scores
 * @param scores - Dosha scores
 * @returns Object with primary dosha, optional secondary dosha, and all scores
 */
function determineDoshaProfile(scores: DoshaScores): {
  primaryDosha: DoshaType;
  secondaryDosha?: DoshaType;
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;
} {
  const sortedDoshas = (Object.entries(scores) as [DoshaType, number][])
    .sort((a, b) => b[1] - a[1]);

  const primaryDosha = sortedDoshas[0][0];
  const primaryScore = sortedDoshas[0][1];
  const secondaryScore = sortedDoshas[1][1];

  // Only set secondary dosha if it's at least 70% of primary score
  const secondaryDosha = secondaryScore >= primaryScore * 0.7 ? sortedDoshas[1][0] : undefined;

  return {
    primaryDosha,
    secondaryDosha,
    vataScore: scores.vata,
    pittaScore: scores.pitta,
    kaphaScore: scores.kapha,
  };
}

// ============================================
// Meal Plan Generation
// ============================================

// Type for meal data structure
interface MealData {
  breakfast: MealSuggestion[];
  lunch: MealSuggestion[];
  dinner: MealSuggestion[];
  snacks: MealSuggestion[];
}

/**
 * Generates a weekly meal plan based on dosha type and cycle phase
 * @param doshaType - User's primary dosha type (or null for generic)
 * @param cyclePhase - Current cycle phase
 * @returns Weekly meal plan
 */
function generateMealPlan(doshaType: DoshaType | null, cyclePhase: CyclePhase): MealPlan {
  let meals: MealData;
  
  switch (doshaType) {
    case 'vata':
      meals = VATA_MEALS;
      break;
    case 'pitta':
      meals = PITTA_MEALS;
      break;
    case 'kapha':
      meals = KAPHA_MEALS;
      break;
    default:
      meals = GENERIC_MEALS;
  }

  // Adjust meals based on cycle phase
  const days: DayMealPlan[] = DAYS_OF_WEEK.map((day, index) => {
    // Rotate through available meals
    const breakfastIndex = index % meals.breakfast.length;
    const lunchIndex = index % meals.lunch.length;
    const dinnerIndex = index % meals.dinner.length;

    // During menstrual phase, prefer lighter, easier-to-digest options
    let breakfast = meals.breakfast[breakfastIndex];
    let lunch = meals.lunch[lunchIndex];
    let dinner = meals.dinner[dinnerIndex];

    // Select 1-2 snacks
    const snackIndices = [index % meals.snacks.length, (index + 1) % meals.snacks.length];
    const snacks = snackIndices.map(i => meals.snacks[i]);

    return {
      day,
      breakfast,
      lunch,
      dinner,
      snacks,
    };
  });

  return { days };
}

// ============================================
// Activity Recommendations Generation
// ============================================

/**
 * Gets activity recommendations based on dosha type and cycle phase
 * @param doshaType - User's primary dosha type (or null for generic)
 * @param cyclePhase - Current cycle phase
 * @returns Array of wellness activities
 */
function getActivities(doshaType: DoshaType | null, cyclePhase: CyclePhase): WellnessActivity[] {
  switch (doshaType) {
    case 'vata':
      return VATA_ACTIVITIES[cyclePhase];
    case 'pitta':
      return PITTA_ACTIVITIES[cyclePhase];
    case 'kapha':
      return KAPHA_ACTIVITIES[cyclePhase];
    default:
      return GENERIC_ACTIVITIES[cyclePhase];
  }
}

/**
 * Gets herbs and teas recommendations based on dosha type
 * @param doshaType - User's primary dosha type (or null for generic)
 * @returns Array of herb and tea recommendations
 */
function getHerbsAndTeas(doshaType: DoshaType | null): string[] {
  if (doshaType && DOSHA_HERBS_TEAS[doshaType]) {
    return DOSHA_HERBS_TEAS[doshaType];
  }
  return GENERIC_HERBS_TEAS;
}

/**
 * Gets foods to avoid based on dosha type
 * @param doshaType - User's primary dosha type (or null for generic)
 * @returns Array of foods to avoid
 */
function getFoodsToAvoid(doshaType: DoshaType | null): string[] {
  if (doshaType && DOSHA_FOODS_TO_AVOID[doshaType]) {
    return DOSHA_FOODS_TO_AVOID[doshaType];
  }
  return GENERIC_FOODS_TO_AVOID;
}

/**
 * Gets wellness tips based on dosha type and cycle phase
 * @param doshaType - User's primary dosha type (or null for generic)
 * @param cyclePhase - Current cycle phase
 * @returns Array of wellness tips
 */
function getTips(doshaType: DoshaType | null, cyclePhase: CyclePhase): string[] {
  const phaseTips = CYCLE_PHASE_TIPS[cyclePhase];
  if (doshaType && phaseTips[doshaType]) {
    return phaseTips[doshaType];
  }
  return phaseTips.generic;
}


// ============================================
// Database Operations
// ============================================

/**
 * Gets user's dosha profile from DynamoDB
 * @param userId - User identifier
 * @returns User profile with dosha information or null
 */
async function getDoshaProfile(userId: string): Promise<UserProfile | null> {
  const pk = createUserKey(userId);
  const sk = 'PROFILE';

  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
    })
  );

  return result.Item as UserProfile | null;
}

/**
 * Saves user's dosha profile to DynamoDB
 * @param userId - User identifier
 * @param doshaProfile - Dosha assessment results
 * @returns Saved user profile
 */
async function saveDoshaProfile(userId: string, doshaProfile: DoshaProfile): Promise<UserProfile> {
  const pk = createUserKey(userId);
  const sk = 'PROFILE';
  const now = getCurrentISOTimestamp();

  // Check if profile exists
  const existingProfile = await getDoshaProfile(userId);

  const userProfile: UserProfile = {
    PK: pk,
    SK: sk,
    userId,
    doshaProfile,
    createdAt: existingProfile?.createdAt || now,
    updatedAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: userProfile,
    })
  );

  return userProfile;
}

// ============================================
// Validation Functions
// ============================================

interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates dosha assessment input
 * @param input - Assessment input to validate
 * @returns Array of validation errors, empty if valid
 */
function validateAssessmentInput(input: Partial<DoshaAssessmentInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.answers) {
    errors.push({ field: 'answers', message: 'answers is required' });
  } else if (!Array.isArray(input.answers)) {
    errors.push({ field: 'answers', message: 'answers must be an array' });
  } else if (input.answers.length === 0) {
    errors.push({ field: 'answers', message: 'answers array cannot be empty' });
  } else {
    // Validate each answer
    input.answers.forEach((answer, index) => {
      if (!answer.questionId) {
        errors.push({ field: `answers[${index}].questionId`, message: `answers[${index}].questionId is required` });
      }
      if (!answer.doshaType) {
        errors.push({ field: `answers[${index}].doshaType`, message: `answers[${index}].doshaType is required` });
      } else if (!validateEnum(answer.doshaType, VALID_DOSHAS)) {
        errors.push({ field: `answers[${index}].doshaType`, message: `answers[${index}].doshaType must be one of: 'vata', 'pitta', 'kapha'` });
      }
    });
  }

  return errors;
}

/**
 * Extracts userId from the event
 * @param event - API Gateway event
 * @returns User ID or null
 */
function getUserId(event: APIGatewayProxyEvent): string {
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

  // Default to demo user for unauthenticated access
  return 'demo-user';
}


// ============================================
// Assessment Validation and Storage
// ============================================

const VALID_QUESTION_IDS = Array.from({ length: 15 }, (_, i) => `q${i + 1}`);

/**
 * Validates dosha assessment answers for completeness and correctness
 * @param answers - Array of assessment answers to validate
 * @returns Object with valid flag and array of error messages
 */
function validateAssessmentAnswers(answers: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(answers)) {
    errors.push('answers must be an array');
    return { valid: false, errors };
  }

  if (answers.length !== 15) {
    errors.push(`Exactly 15 answers are required, but ${answers.length} were provided`);
  }

  const invalidQuestionIds: string[] = [];
  const invalidDoshaTypes: string[] = [];

  for (const answer of answers) {
    if (answer.questionId && !VALID_QUESTION_IDS.includes(answer.questionId)) {
      invalidQuestionIds.push(answer.questionId);
    }
    if (answer.doshaType && !VALID_DOSHAS.includes(answer.doshaType)) {
      invalidDoshaTypes.push(answer.doshaType);
    }
  }

  if (invalidQuestionIds.length > 0) {
    errors.push(`Invalid questionId(s): ${invalidQuestionIds.join(', ')}. Must be in {q1..q15}`);
  }

  if (invalidDoshaTypes.length > 0) {
    errors.push(`Invalid doshaType(s): ${invalidDoshaTypes.join(', ')}. Must be one of: vata, pitta, kapha`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Saves an assessment record to DynamoDB with a timestamped sort key
 * @param userId - User identifier
 * @param answers - Array of assessment answers
 * @param doshaProfile - Calculated dosha profile
 * @returns The saved assessment record
 */
async function saveAssessmentRecord(
  userId: string,
  answers: DoshaAssessmentAnswer[],
  doshaProfile: DoshaProfile
): Promise<Record<string, unknown>> {
  const now = getCurrentISOTimestamp();
  const pk = createUserKey(userId);
  const sk = `DOSHA_ASSESSMENT#${now}`;

  const item = {
    PK: pk,
    SK: sk,
    userId,
    answers,
    vataScore: doshaProfile.vataScore,
    pittaScore: doshaProfile.pittaScore,
    kaphaScore: doshaProfile.kaphaScore,
    primaryDosha: doshaProfile.primaryDosha,
    createdAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );

  return item;
}

/**
 * Retrieves assessment history for a user, sorted newest first
 * @param userId - User identifier
 * @param limit - Maximum number of records to return (default 20, max 50)
 * @returns Array of assessment records
 */
async function getAssessmentHistory(
  userId: string,
  limit: number = 20
): Promise<Record<string, unknown>[]> {
  const effectiveLimit = Math.min(Math.max(limit, 1), 50);

  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': createUserKey(userId),
        ':skPrefix': 'DOSHA_ASSESSMENT#',
      },
      ScanIndexForward: false,
      Limit: effectiveLimit,
    })
  );

  return (result.Items as Record<string, unknown>[]) || [];
}

// ============================================
// Lambda Handler
// ============================================

/**
 * Lambda handler for wellness planner operations
 * Endpoints:
 * - GET /wellness/dosha - Get user's dosha profile
 * - POST /wellness/dosha - Save dosha assessment
 * - GET /wellness/dosha/history - Get assessment history
 * - GET /wellness/plan - Get personalized wellness plan
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path } = event;

    // Handle OPTIONS for CORS preflight
    if (httpMethod === 'OPTIONS') {
      return successResponse(200, {});
    }

    // Get userId from request (defaults to 'demo-user')
    const userId = getUserId(event);

    // Handle dosha history endpoint
    if (path.endsWith('/dosha/history') && httpMethod === 'GET') {
      const historyUserId = event.queryStringParameters?.userId;
      if (!historyUserId) {
        return errorResponse(400, 'VALIDATION_ERROR', 'userId query parameter is required');
      }

      let limit = 20;
      const limitParam = event.queryStringParameters?.limit;
      if (limitParam) {
        const parsed = parseInt(limitParam, 10);
        if (isNaN(parsed) || parsed < 1 || parsed > 50) {
          return errorResponse(400, 'VALIDATION_ERROR', 'limit must be a number between 1 and 50');
        }
        limit = parsed;
      }

      try {
        const assessments = await getAssessmentHistory(historyUserId, limit);
        return successResponse(200, { assessments });
      } catch (error) {
        console.error('Error fetching assessment history:', error);
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to fetch assessment history');
      }
    }

    // Handle dosha endpoint
    if (path.endsWith('/dosha')) {
      switch (httpMethod) {
        case 'GET': {
          // Get user's dosha profile
          const profile = await getDoshaProfile(userId);

          if (!profile || !profile.doshaProfile) {
            return successResponse(200, {
              doshaProfile: null,
              message: 'No dosha assessment found. Complete the assessment to get personalized recommendations.',
              questions: DOSHA_QUESTIONS,
            });
          }

          return successResponse(200, {
            doshaProfile: profile.doshaProfile,
            questions: DOSHA_QUESTIONS,
          });
        }

        case 'POST': {
          // Parse and validate request body
          let input: DoshaAssessmentInput;
          try {
            input = event.body ? JSON.parse(event.body) : {};
          } catch {
            return errorResponse(400, 'VALIDATION_ERROR', 'Invalid JSON in request body');
          }

          // Validate input using existing validation
          const errors = validateAssessmentInput(input);
          if (errors.length > 0) {
            return errorResponse(
              400,
              'VALIDATION_ERROR',
              errors.map((e) => e.message).join('; '),
              errors.map((e) => e.field)
            );
          }

          // Validate answers with stricter assessment-specific validation
          const assessmentValidation = validateAssessmentAnswers(input.answers);
          if (!assessmentValidation.valid) {
            return errorResponse(
              400,
              'VALIDATION_ERROR',
              assessmentValidation.errors.join('; ')
            );
          }

          // Calculate dosha scores
          const scores = calculateDoshaScores(input.answers);
          const doshaResult = determineDoshaProfile(scores);

          // Create dosha profile
          const doshaProfile: DoshaProfile = {
            ...doshaResult,
            assessmentDate: getCurrentISODate(),
          };

          // Save assessment record
          try {
            await saveAssessmentRecord(userId, input.answers, doshaProfile);
          } catch (recordError) {
            console.error('Error saving assessment record:', recordError);
            return errorResponse(500, 'INTERNAL_ERROR', 'Failed to save assessment record');
          }

          // Update the existing PROFILE item
          try {
            const savedProfile = await saveDoshaProfile(userId, doshaProfile);
            return successResponse(201, {
              message: 'Dosha assessment saved successfully',
              doshaProfile: savedProfile.doshaProfile,
            });
          } catch (profileError) {
            console.error('Error updating profile:', profileError);
            return errorResponse(500, 'INTERNAL_ERROR', 'Assessment record saved but failed to update profile');
          }
        }

        default:
          return errorResponse(405, 'METHOD_NOT_ALLOWED', `Method ${httpMethod} not allowed`);
      }
    }

    // Handle plan endpoint
    if (path.endsWith('/plan') && httpMethod === 'GET') {
      // Get cycle phase from query parameters (default to follicular)
      const cyclePhaseParam = event.queryStringParameters?.cyclePhase;
      let cyclePhase: CyclePhase = 'follicular';

      if (cyclePhaseParam) {
        if (!validateEnum(cyclePhaseParam, VALID_CYCLE_PHASES)) {
          return errorResponse(
            400,
            'VALIDATION_ERROR',
            `cyclePhase must be one of: ${VALID_CYCLE_PHASES.join(', ')}`,
            ['cyclePhase']
          );
        }
        cyclePhase = cyclePhaseParam as CyclePhase;
      }

      // Get user's dosha profile
      const profile = await getDoshaProfile(userId);
      const doshaType = profile?.doshaProfile?.primaryDosha || null;

      // Generate wellness plan
      const wellnessPlan: WellnessPlan = {
        doshaType,
        cyclePhase,
        mealPlan: generateMealPlan(doshaType, cyclePhase),
        activities: getActivities(doshaType, cyclePhase),
        herbsAndTeas: getHerbsAndTeas(doshaType),
        foodsToAvoid: getFoodsToAvoid(doshaType),
        tips: getTips(doshaType, cyclePhase),
      };

      // Add message if no dosha profile
      const response: {
        plan: WellnessPlan;
        message?: string;
        doshaProfile?: DoshaProfile;
      } = {
        plan: wellnessPlan,
      };

      if (!doshaType) {
        response.message = 'Showing generic recommendations. Complete the dosha assessment for personalized plans.';
      } else {
        response.doshaProfile = profile?.doshaProfile;
      }

      return successResponse(200, response);
    }

    return errorResponse(404, 'NOT_FOUND', 'Endpoint not found');
  } catch (error) {
    console.error('Error in wellnessHandler:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'An error occurred');
  }
};
