# 🌸 Swasthyashe — Women's Wellness Platform

Swasthyashe (meaning "self-health" in Sanskrit) is an AI-powered women's wellness platform that brings back the time-tested Ayurvedic wisdom of Indian grandmothers (Bhammas) into the modern world — using technology to make ancient natural healing accessible to every woman.

**Live App:** https://d2hrs5gbgj30ej.cloudfront.net

---

## The Problem We're Solving

For generations, Indian women managed their menstrual health, pregnancy, and overall wellness through natural Ayurvedic remedies — ginger tea for cramps, turmeric milk for immunity, ashwagandha for stress, shatavari for hormonal balance. These remedies were passed down from grandmother to mother to daughter.

But somewhere along the way, we lost touch with this wisdom. Today, most women reach for painkillers during their periods, rely on synthetic supplements, and turn to artificial medicines for problems that nature already has answers to. The knowledge that sustained women's health for thousands of years is fading.

Swasthyashe aims to change that.

This app is built on a simple belief: **why depend on artificial medicines when we have all the natural support we need?** Every herb in your kitchen — haldi (turmeric), jeera (cumin), ajwain (carom seeds), tulsi (holy basil) — carries healing properties that our ancestors understood deeply. Swasthyashe uses AI to bring this knowledge back, personalized to each woman's unique body constitution (dosha), menstrual cycle phase, and symptoms.

We're not against modern medicine — we believe in informed choices. But for everyday wellness, period care, and preventive health, nature has already provided everything a woman needs. Swasthyashe makes it easy to rediscover that.

---

## Why Swasthyashe Matters

Women's health is often underserved by generic health apps. Swasthyashe addresses this gap by providing a culturally rooted, personalized wellness experience that understands the unique rhythms of a woman's body — menstrual cycles, hormonal changes, emotional patterns, and constitutional health (dosha).

The app empowers women to:
- Track their menstrual cycles and predict upcoming periods
- Log symptoms and receive traditional Ayurvedic remedies
- Understand their Ayurvedic body constitution (Vata, Pitta, Kapha)
- Get AI-generated personalized meal plans, wellness routines, and herbal recommendations
- Access health education content in 6 Indian languages

---

## Key Features

### 🩸 Cycle Tracker
- Log period start/end dates and flow intensity
- AI-powered cycle predictions (next period, fertile window, ovulation)
- Visual calendar with color-coded cycle phases
- Cycle history with expandable detail cards

### 🌿 Symptom Tracker
- Log 21+ physical and emotional symptoms with severity levels
- AI-powered symptom analysis identifying patterns and dosha imbalances
- Personalized Ayurvedic herbal remedies based on logged symptoms
- Cycle-symptom correlation mapping across menstrual phases
- Herbal remedy finder with traditional Indian grandmother-style remedies

### 🧘 Wellness Planner
- 15-question Dosha Assessment to determine Ayurvedic constitution
- AI-generated 7-day personalized meal plans (Indian vegetarian, dosha-specific)
- Phase-specific yoga, meditation, and exercise recommendations
- AI Ayurvedic recipe generator
- Daily wellness tracker with water intake monitoring
- Weekly wellness summary combining cycle, symptom, and dosha data
- Assessment history with edit and resubmit capability

### 💬 AI Wellness Chat
- Conversational AI wellness coach powered by Amazon Bedrock
- Ask any health question and get Ayurvedic-informed responses

---

## AI Features

Swasthyashe uses Amazon Bedrock (Meta Llama 3.2) to power several AI features:

| Feature | How It Works |
|---------|-------------|
| AI Symptom Analysis | Analyzes logged symptoms to identify patterns, possible Ayurvedic causes, dosha imbalances, and action items |
| Herbal Remedy Finder | Generates traditional Indian herbal remedies for specific symptoms with preparation methods |
| AI Meal Plan Generator | Creates 7-day dosha-specific Indian vegetarian meal plans tailored to the current cycle phase |
| AI Recipe Generator | Generates Ayurvedic recipes with ingredients, instructions, and health benefits |
| Weekly Wellness Summary | Combines cycle data, symptoms, and dosha profile into a personalized weekly health report |
| AI Wellness Chat | Open-ended conversational AI for any women's health question |
| Daily Wellness Tracker | AI-generated daily routines including water intake, sleep, and exercise recommendations |

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling (frosted glass card design system)
- **React Router** for client-side routing
- **i18next** for internationalization (6 languages)

### Backend
- **AWS Lambda** (Node.js 18) — Serverless compute
- **Amazon API Gateway** — REST API endpoints
- **Amazon DynamoDB** — NoSQL database for all persistent data
- **Amazon Bedrock** (Meta Llama 3.2 3B Instruct) — AI/ML inference
- **Amazon Cognito** — User authentication (OAuth 2.0 implicit flow)
- **Amazon S3** — Static website hosting
- **Amazon CloudFront** — CDN for global content delivery
- **Amazon SES** — Email notifications for newsletter subscriptions

### Infrastructure
- **AWS CDK** (TypeScript) — Infrastructure as Code
- All resources defined in `backend/lib/swasthyashe-stack.ts`

### Architecture Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  CloudFront │────▶│  S3 Bucket   │     │  Cognito        │
│  (CDN)      │     │  (Frontend)  │     │  (Auth)         │
└─────────────┘     └──────────────┘     └─────────────────┘
                           │
                    ┌──────▼──────┐
                    │ API Gateway │
                    └──────┬──────┘
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
   │ Lambda      │ │ Lambda      │ │ Lambda      │
   │ (Cycles)    │ │ (Symptoms)  │ │ (Wellness)  │
   └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
          ▼                ▼                ▼
   ┌─────────────────────────────────────────────┐
   │              DynamoDB Tables                 │
   │  CyclesTable | SymptomsTable | UserProfiles  │
   └─────────────────────────────────────────────┘
          │
          ▼
   ┌─────────────┐
   │  Bedrock    │
   │  (AI/ML)    │
   └─────────────┘
```


---

## Getting Started

### Prerequisites
- Node.js 18+
- AWS CLI configured with credentials
- AWS CDK CLI (`npm install -g aws-cdk`)

### Backend Setup

```bash
cd backend
npm install
npx tsc                    # Compile TypeScript
npx cdk deploy             # Deploy to AWS
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```
REACT_APP_API_ENDPOINT=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_COGNITO_USER_POOL_ID=your-pool-id
REACT_APP_COGNITO_CLIENT_ID=your-client-id
REACT_APP_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
REACT_APP_COGNITO_REDIRECT_URI=http://localhost:3000
REACT_APP_COGNITO_SIGN_OUT_URI=http://localhost:3000
```

### Run Locally

```bash
cd frontend
npm start                  # Starts on http://localhost:3000
```

### Deploy to Production

```bash
cd frontend
npm run build
aws s3 sync build/ s3://your-s3-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Environment Configuration

The app uses separate env files for development and production:

| File | Used When | Redirect URI |
|------|-----------|-------------|
| `.env.development` | `npm start` | http://localhost:3000 |
| `.env.production` | `npm run build` | https://your-cloudfront-url |

This prevents the Cognito redirect URI mismatch issue between local development and production deployment.

---


---

Built with ❤️ for women's wellness, combining the timeless wisdom of Ayurveda with the power of AI.
