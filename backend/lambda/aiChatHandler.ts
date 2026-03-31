import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const BEDROCK_REGION = process.env.BEDROCK_REGION || 'us-east-1';
const MODEL_ID = process.env.MODEL_ID || 'us.meta.llama3-2-3b-instruct-v1:0';

const client = new BedrockRuntimeClient({ region: BEDROCK_REGION });

const SYSTEM_PROMPT = `You are Dr. Ayur, a compassionate Ayurvedic doctor and women's wellness expert. You specialize in Ayurvedic medicine, women's menstrual health, herbal remedies, yoga, Ayurvedic nutrition, pregnancy care, skin and hair care, mental wellness, and traditional Indian grandmother (Bhamma) remedies.

Response format rules you MUST follow:
- Start with a warm 1-line greeting related to the topic
- Use bullet points (- ) for all recommendations, herbs, remedies, yoga poses, and foods
- Bold important herb names, yoga poses, and key terms using **bold**
- Group recommendations under short headers like "Herbs:", "Diet:", "Yoga:", "Lifestyle:"
- Keep responses concise — max 15 bullet points
- End with a short disclaimer: "Note: This is Ayurvedic guidance. Consult a doctor for medical concerns."
- Use relevant emoji sparingly (🌿, 🧘, 🌸, ✨)`;

export async function handler(event: any) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { message, doshaProfile, cyclePhase } = body;

    if (!message) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Message is required' }) };
    }

    let context = SYSTEM_PROMPT;
    if (doshaProfile) {
      context += ` User's Dosha: ${doshaProfile.dominantDosha}.`;
    }
    if (cyclePhase) {
      context += ` Currently in ${cyclePhase} phase.`;
    }

    // Llama 3 prompt format
    const prompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${context}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`;

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        prompt,
        max_gen_len: 1024,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    const response = await client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    const reply = result.generation?.trim() || 'I apologize, I could not generate a response. Please try again.';

    return { statusCode: 200, headers, body: JSON.stringify({ reply }) };
  } catch (error: any) {
    console.error('Bedrock error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to get AI response: ' + (error.message || 'Unknown error') }) };
  }
}
