/**
 * Shared TypeScript interfaces for Swasthyashe application
 * Contains all data models for cycle tracking, forum, symptoms, user profiles, search, and wellness features
 */

// ============================================
// Cycle Tracking Types
// ============================================

/** Flow intensity levels for period tracking */
export type FlowIntensity = 'light' | 'medium' | 'heavy';

/** Cycle phases throughout the menstrual cycle */
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

/** Cycle entry stored in database */
export interface CycleEntry {
  PK: string;           // USER#{userId}
  SK: string;           // CYCLE#{startDate}
  userId: string;
  startDate: string;    // ISO date
  endDate?: string;     // ISO date
  flowIntensity: FlowIntensity;
  cycleLength?: number; // Calculated when next cycle starts
  createdAt: string;
  updatedAt: string;
}

/** Input for logging a new cycle entry */
export interface CycleLogInput {
  startDate: string;
  endDate?: string;
  flowIntensity: FlowIntensity;
}

/** Prediction data for upcoming cycle events */
export interface CyclePrediction {
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  ovulationDate: Date;
  pmsStart: Date;
  pmsEnd: Date;
  averageCycleLength: number;
  averagePeriodLength: number;
  confidence: 'low' | 'medium' | 'high';
}

// ============================================
// Forum Types
// ============================================

/** Forum category options */
export type ForumCategory = 'Period Health' | 'Mental Wellness' | 'Pregnancy' | 'Ayurveda' | 'General';

/** Forum thread stored in database */
export interface ForumThread {
  PK: string;           // THREAD#{threadId}
  SK: string;           // METADATA
  threadId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  tags: ForumCategory[];
  replyCount: number;
  createdAt: string;
  lastActivityAt: string;
}

/** Forum reply stored in database */
export interface ForumReply {
  PK: string;           // THREAD#{threadId}
  SK: string;           // REPLY#{timestamp}#{replyId}
  replyId: string;
  threadId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

/** Input for creating a new thread */
export interface ThreadInput {
  title: string;
  content: string;
  tags?: ForumCategory[];
}

/** Input for creating a reply */
export interface ReplyInput {
  threadId: string;
  content: string;
}

// ============================================
// Symptom Tracking Types
// ============================================

/** Symptom category classification */
export type SymptomCategory = 'physical' | 'emotional';

/** Energy level options */
export type EnergyLevel = 'low' | 'medium' | 'high';

/** Severity scale for symptoms (1-5) */
export type SymptomSeverity = 1 | 2 | 3 | 4 | 5;

/** Selected symptom with severity */
export interface SelectedSymptom {
  id: string;
  category: SymptomCategory;
  name: string;
  severity: SymptomSeverity;
}

/** Symptom option for selection UI */
export interface SymptomOption {
  id: string;
  category: SymptomCategory;
  name: string;
  nameKey: string;      // i18n key
}

/** Symptom entry stored in database */
export interface SymptomEntry {
  PK: string;           // USER#{userId}
  SK: string;           // SYMPTOM#{date}
  userId: string;
  date: string;         // ISO date
  symptoms: SelectedSymptom[];
  energyLevel: EnergyLevel;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Input for logging symptoms */
export interface SymptomLogInput {
  date: string;
  symptoms: SelectedSymptom[];
  energyLevel: EnergyLevel;
  notes?: string;
}

/** Ayurvedic recommendation type */
export type RecommendationType = 'herbal' | 'dietary' | 'yoga' | 'lifestyle';

/** Ayurvedic recommendation for symptoms */
export interface AyurvedicRecommendation {
  id: string;
  symptomIds: string[];
  type: RecommendationType;
  title: string;
  titleKey: string;
  description: string;
  descriptionKey: string;
  instructions?: string;
  cautions?: string;
}

// ============================================
// User Profile Types
// ============================================

/** Supported languages for the application */
export type SupportedLanguage = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml';

/** Dosha types in Ayurveda */
export type DoshaType = 'vata' | 'pitta' | 'kapha';

/** User's dosha profile from assessment */
export interface DoshaProfile {
  primaryDosha: DoshaType;
  secondaryDosha?: DoshaType;
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;
  assessmentDate: string;
}

/** User profile stored in database */
export interface UserProfile {
  PK: string;           // USER#{userId}
  SK: string;           // PROFILE
  userId: string;
  doshaProfile?: DoshaProfile;
  languagePreference: SupportedLanguage;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Search Types
// ============================================

/** Search result category types */
export type SearchCategory = 'articles' | 'remedies' | 'forum' | 'diet';

/** Search result item */
export interface SearchResult {
  id: string;
  type: SearchCategory;
  title: string;
  snippet: string;
  url: string;
  matchedTerms: string[];
}

// ============================================
// Wellness Plan Types
// ============================================

/** Activity type for wellness recommendations */
export type ActivityType = 'yoga' | 'meditation' | 'exercise';

/** Meal suggestion for diet plans */
export interface MealSuggestion {
  name: string;
  nameKey: string;
  description?: string;
  benefits?: string[];
}

/** Single day meal plan */
export interface DayMealPlan {
  day: string;
  breakfast: MealSuggestion;
  lunch: MealSuggestion;
  dinner: MealSuggestion;
  snacks: MealSuggestion[];
}

/** Weekly meal plan structure */
export interface MealPlan {
  days: DayMealPlan[];
}

/** Wellness activity recommendation */
export interface WellnessActivity {
  type: ActivityType;
  name: string;
  nameKey: string;
  duration: string;
  description: string;
  benefits: string[];
}

/** Complete wellness plan */
export interface WellnessPlan {
  doshaType: DoshaType;
  cyclePhase: CyclePhase;
  mealPlan: MealPlan;
  activities: WellnessActivity[];
  herbsAndTeas: string[];
  foodsToAvoid: string[];
  tips: string[];
}

// ============================================
// Dosha Assessment Types
// ============================================

/** Dosha question for assessment */
export interface DoshaQuestion {
  id: string;
  question: string;
  questionKey: string;
  category?: string;
  options: DoshaQuestionOption[];
}

/** Option for dosha question */
export interface DoshaQuestionOption {
  text: string;
  textKey: string;
  doshaType: DoshaType;
  score: number;
}

/** Input for dosha assessment submission */
export interface DoshaAssessmentInput {
  answers: DoshaAssessmentAnswer[];
}

/** A single completed dosha assessment record from history */
export interface AssessmentRecord {
  assessmentId: string;
  userId: string;
  answers: DoshaAssessmentAnswer[];
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;
  primaryDosha: DoshaType;
  secondaryDosha?: DoshaType;
  createdAt: string;
}

/** Single answer in dosha assessment */
export interface DoshaAssessmentAnswer {
  questionId: string;
  selectedOption: string;
  doshaType: DoshaType;
  score: number;
}

// ============================================
// API Response Types
// ============================================

/** Standard API error response */
export interface ApiError {
  error: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'INTERNAL_ERROR' | 'RATE_LIMITED';
  message: string;
  fields?: string[];
  retryAfter?: number;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  items: T[];
  nextToken?: string;
  totalCount?: number;
}

// ============================================
// Context Types
// ============================================

/** Language context value */
export interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

// ============================================
// Predefined Constants
// ============================================

/** Predefined physical symptoms */
export const PHYSICAL_SYMPTOMS: SymptomOption[] = [
  { id: 'cramps', category: 'physical', name: 'Cramps', nameKey: 'symptoms.physical.cramps' },
  { id: 'headache', category: 'physical', name: 'Headache', nameKey: 'symptoms.physical.headache' },
  { id: 'bloating', category: 'physical', name: 'Bloating', nameKey: 'symptoms.physical.bloating' },
  { id: 'fatigue', category: 'physical', name: 'Fatigue', nameKey: 'symptoms.physical.fatigue' },
  { id: 'breast_tenderness', category: 'physical', name: 'Breast Tenderness', nameKey: 'symptoms.physical.breastTenderness' },
  { id: 'back_pain', category: 'physical', name: 'Back Pain', nameKey: 'symptoms.physical.backPain' },
  { id: 'nausea', category: 'physical', name: 'Nausea', nameKey: 'symptoms.physical.nausea' },
  { id: 'acne', category: 'physical', name: 'Acne/Skin Issues', nameKey: 'symptoms.physical.acne' },
  { id: 'insomnia', category: 'physical', name: 'Insomnia', nameKey: 'symptoms.physical.insomnia' },
  { id: 'dizziness', category: 'physical', name: 'Dizziness', nameKey: 'symptoms.physical.dizziness' },
  { id: 'hot_flashes', category: 'physical', name: 'Hot Flashes', nameKey: 'symptoms.physical.hotFlashes' },
  { id: 'joint_pain', category: 'physical', name: 'Joint Pain', nameKey: 'symptoms.physical.jointPain' },
  { id: 'constipation', category: 'physical', name: 'Constipation', nameKey: 'symptoms.physical.constipation' },
];

/** Predefined emotional symptoms */
export const EMOTIONAL_SYMPTOMS: SymptomOption[] = [
  { id: 'mood_swings', category: 'emotional', name: 'Mood Swings', nameKey: 'symptoms.emotional.moodSwings' },
  { id: 'anxiety', category: 'emotional', name: 'Anxiety', nameKey: 'symptoms.emotional.anxiety' },
  { id: 'irritability', category: 'emotional', name: 'Irritability', nameKey: 'symptoms.emotional.irritability' },
  { id: 'sadness', category: 'emotional', name: 'Sadness', nameKey: 'symptoms.emotional.sadness' },
  { id: 'stress', category: 'emotional', name: 'Stress', nameKey: 'symptoms.emotional.stress' },
  { id: 'brain_fog', category: 'emotional', name: 'Brain Fog', nameKey: 'symptoms.emotional.brainFog' },
  { id: 'low_motivation', category: 'emotional', name: 'Low Motivation', nameKey: 'symptoms.emotional.lowMotivation' },
  { id: 'crying_spells', category: 'emotional', name: 'Crying Spells', nameKey: 'symptoms.emotional.cryingSpells' },
];

/** All forum categories */
export const FORUM_CATEGORIES: ForumCategory[] = [
  'Period Health',
  'Mental Wellness',
  'Pregnancy',
  'Ayurveda',
  'General',
];

/** All supported languages with display names */
export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];
