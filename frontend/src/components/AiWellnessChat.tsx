import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
// Force demo mode — set to false to use Bedrock AI
const USE_DEMO_MODE = false;

const DEMO_RESPONSES: Record<string, string> = {
  default: "🌿 Namaste! I'm Dr. Ayur, your Ayurvedic wellness guide.\n\nBased on Ayurvedic principles, every person has a unique constitution (Prakriti) governed by three doshas — Vata, Pitta, and Kapha. Understanding yours helps tailor the right remedies.\n\nFor general daily wellness:\n- Start your morning with warm water and lemon to kindle Agni (digestive fire)\n- Practice 10 min of Nadi Shodhana (alternate nostril breathing)\n- Include all 6 tastes in your meals: sweet, sour, salty, bitter, pungent, astringent\n- End your day with warm golden milk (turmeric + milk + black pepper)\n\nCould you tell me more about what specific concern you have? I can give more targeted advice on skin, hair, periods, diet, yoga, stress, pregnancy, or any women's health topic.\n\n*This is educational Ayurvedic guidance. Please consult a healthcare professional for medical concerns.*",
  period: "🌸 During menstruation, Ayurveda recommends rest and gentle self-care:\n\n**Diet**: Warm, easily digestible foods — khichdi, ginger tea, warm milk with turmeric and nutmeg. Avoid cold, raw, and heavy foods.\n\n**Herbs**: Ashoka bark tea for menstrual comfort. Shatavari for hormonal balance. Ajwain (carom seeds) in warm water for cramps.\n\n**Yoga**: Gentle poses only — Supta Baddha Konasana (reclining butterfly), Balasana (child's pose). Avoid inversions.\n\n**For irregular periods**: Triphala at night, Shatavari daily, and regular Baddha Konasana practice help regulate cycles.\n\n🧘 Honor this time as natural cleansing. Rest when you can.\n\n*Consult your doctor for persistent pain or heavy bleeding.*",
  diet: "🌿 Ayurvedic diet principles for women's wellness:\n\n**Morning (6-8 AM)**: Warm water + lemon. Warm breakfast — oatmeal with cinnamon, stewed apples, or upma.\n\n**Lunch (12-1 PM)**: Largest meal — balanced thali with rice, dal, sabzi, salad. Include all 6 tastes.\n\n**Dinner (6-7 PM)**: Light and early — soup, khichdi, or light vegetables.\n\n**Golden Milk before bed**: Warm milk + turmeric + black pepper + cardamom + ghee.\n\n**Key healing spices**: Turmeric (anti-inflammatory), cumin (digestion), coriander (cooling), fennel (hormonal balance), ginger (circulation), black pepper (absorption).\n\n**Foods for women**: Dates, almonds, ghee, sesame seeds, pomegranate, amla (Indian gooseberry).\n\n*Adjust portions and spices based on your dosha type.*",
  yoga: "🧘 Daily Ayurvedic yoga routine for women:\n\n**Morning (20-30 min)**:\n1. Surya Namaskar — 5 rounds to energize\n2. Bhujangasana (Cobra) — reproductive health\n3. Malasana (Garland Pose) — pelvic floor strength\n4. Baddha Konasana (Butterfly) — circulation to reproductive organs\n5. Viparita Karani (Legs Up Wall) — hormonal balance\n\n**Pranayama (10 min)**:\n- Nadi Shodhana (Alternate Nostril) — balances Vata, calms mind\n- Bhramari (Bee Breath) — reduces anxiety, supports thyroid\n\n**Evening**: Gentle stretching + Yoga Nidra (15 min guided relaxation)\n\n**For PCOS**: Add Dhanurasana (Bow Pose) and Setu Bandhasana (Bridge Pose)\n\n*Avoid inversions during menstruation.*",
  stress: "🌸 Ayurveda views stress as a Vata imbalance. Here's a holistic approach:\n\n**Herbs**:\n- Ashwagandha (500mg with warm milk before bed) — queen of adaptogens\n- Brahmi — calms mind, improves focus\n- Jatamansi — natural sedative for anxiety\n- Tulsi tea (2-3 cups daily) — reduces cortisol\n\n**Practices**:\n- Abhyanga (self-massage with warm sesame oil before bathing)\n- Shirodhara at home — warm oil on forehead for 10 min\n- Meditation — 10 min silent sitting or Om Shanti mantra\n- Journaling before bed to release mental clutter\n\n**Lifestyle**: Regular routine (Dinacharya), consistent sleep/wake times, warm grounding foods, reduce screen time before bed.\n\n*If stress is persistent or severe, please consult a mental health professional.*",
  skin: "✨ For skin concerns, Ayurveda treats from inside out:\n\n**For dark spots/pigmentation**:\n- Apply a paste of **kumkumadi oil** (saffron-based) nightly — the gold standard in Ayurvedic skin care\n- **Turmeric + raw honey + lemon** face mask twice weekly\n- **Aloe vera gel** with a pinch of turmeric applied to dark spots\n- **Manjistha** (Rubia cordifolia) — take internally as powder or capsule, it purifies blood and clears skin\n- **Chandan (sandalwood) paste** with rose water — cooling and brightening\n\n**Diet for clear skin**: Drink warm water with lemon morning, eat amla (Indian gooseberry) daily, include bitter greens (neem leaves, bitter gourd), avoid fried/spicy foods.\n\n**Lifestyle**: Avoid direct sun 10am-4pm, use natural sunscreen with zinc oxide, get 7-8 hours sleep.\n\n**Dosha connection**: Pitta imbalance often causes pigmentation. Cool your Pitta with coconut oil massage, cooling foods (cucumber, watermelon), and avoid excess heat.\n\n*For persistent or spreading pigmentation, consult a dermatologist.*",
  hair: "🌿 Ayurvedic hair care remedies:\n\n**For hair fall**:\n- **Bhringraj oil** head massage 2-3 times/week — the king of hair herbs\n- **Amla (Indian gooseberry)** — eat fresh or take as supplement\n- **Coconut oil + curry leaves** heated together — massage into scalp\n- **Fenugreek (methi) seed paste** — soak overnight, grind, apply as mask\n\n**For dandruff**: Neem oil + tea tree oil scalp massage. Rinse with diluted apple cider vinegar.\n\n**For premature greying**: Amla + Bhringraj oil. Eat black sesame seeds daily.\n\n**Internal support**: Take Shatavari and Ashwagandha for hormonal hair loss. Iron-rich foods (dates, spinach, pomegranate).\n\n**Ayurvedic hair wash**: Shikakai + Reetha (soapnut) powder — natural, chemical-free cleansing.\n\n*Hair health reflects internal health. Address digestion and stress first.*",
  pregnancy: "🤰 Ayurvedic pregnancy care (Garbhini Paricharya):\n\n**First trimester**: Sip coconut water and pomegranate juice. Eat light, sweet foods. Shatavari milk (warm milk + Shatavari powder) supports the growing baby.\n\n**Second trimester**: Ghee with meals for baby's brain development. Gentle walks and Baddha Konasana. Abhyanga with sesame oil.\n\n**Third trimester**: Dates (6 per day from week 36) for easier labor. Raspberry leaf tea. Gentle squats and pelvic floor exercises.\n\n**Throughout pregnancy**:\n- Morning sickness: Ginger tea, fennel seeds, small frequent meals\n- Constipation: Warm water + ghee in morning, Triphala (only under guidance)\n- Back pain: Warm sesame oil massage, Cat-Cow stretches\n- Anxiety: Brahmi tea, gentle pranayama, meditation\n\n*Always consult your OB-GYN before taking any herbs during pregnancy.*",
  pcos: "🌿 Ayurvedic approach to PCOS/PCOD:\n\n**Herbs**:\n- **Shatavari** — balances female hormones, supports ovarian health\n- **Ashoka** — regulates menstrual cycle\n- **Guduchi (Giloy)** — boosts immunity, reduces inflammation\n- **Kanchanar Guggulu** — traditional remedy for cysts\n- **Cinnamon** — improves insulin sensitivity\n\n**Diet**: Avoid sugar, dairy, and processed foods. Eat whole grains, green vegetables, seeds (flax, pumpkin, sunflower). Anti-inflammatory spices: turmeric, ginger, fenugreek.\n\n**Yoga**: Surya Namaskar, Dhanurasana (Bow), Setu Bandhasana (Bridge), Bharadvajasana (Seated Twist) — all support reproductive organs.\n\n**Lifestyle**: Regular sleep schedule, 30 min daily exercise, stress management through meditation.\n\n*PCOS requires medical monitoring. Use Ayurveda as complementary support alongside your doctor's treatment.*",
  immunity: "🌿 Ayurvedic immunity boosters for women:\n\n**Daily rasayana (rejuvenation)**:\n- **Chyawanprash** — 1 tablespoon morning with warm milk\n- **Amla** — richest natural source of Vitamin C\n- **Turmeric milk** (Golden Milk) — anti-inflammatory powerhouse\n- **Tulsi tea** — 2-3 cups daily\n- **Giloy (Guduchi)** — the Ayurvedic immunity herb\n\n**Kitchen pharmacy**: Ginger-honey-lemon morning drink. Cook with turmeric, black pepper, cumin daily. Garlic and onion in meals.\n\n**Lifestyle**: Oil pulling with sesame oil (5 min morning). Nasya — 2 drops sesame oil in each nostril. Regular Abhyanga massage.\n\n**Seasonal care**: In winter add warming spices. In summer add cooling herbs like mint and coriander.\n\n*Strong Agni (digestive fire) = strong immunity. Focus on digestion first.*",
  hello: "🌿 Namaste! Welcome to Swasthyashe!\n\nI'm Dr. Ayur, your Ayurvedic wellness companion. I'm here to help you with:\n\n🌸 **Menstrual health** — cycle care, cramps, irregular periods, PCOS\n✨ **Skin & beauty** — pigmentation, acne, natural glow\n💇 **Hair care** — hair fall, dandruff, premature greying\n🧘 **Yoga & exercise** — poses for women's health\n🍽️ **Diet & nutrition** — Ayurvedic meal plans, healing foods\n😌 **Stress & mental wellness** — herbs, meditation, sleep\n🤰 **Pregnancy care** — trimester-wise Ayurvedic guidance\n💪 **Immunity** — natural boosters and rasayanas\n\nJust ask me anything! For example:\n- \"I have dark spots on my face\"\n- \"What should I eat during my period?\"\n- \"Suggest yoga for PCOS\"\n- \"I'm feeling stressed and can't sleep\"\n\nHow can I help you today? 🙏",
};

function getDemoResponse(message: string): string {
  const lower = message.toLowerCase();
  // Greetings
  if (/^(hi|hello|hey|namaste|hii+|hola|good morning|good evening)\b/.test(lower)) return DEMO_RESPONSES.hello;
  // Skin
  if (lower.includes('skin') || lower.includes('face') || lower.includes('pigment') || lower.includes('dark spot') || lower.includes('acne') || lower.includes('pimple') || lower.includes('glow') || lower.includes('wrinkle') || lower.includes('tan') || lower.includes('blemish') || lower.includes('complexion') || lower.includes('dark circle')) return DEMO_RESPONSES.skin;
  // Hair
  if (lower.includes('hair') || lower.includes('dandruff') || lower.includes('bald') || lower.includes('grey') || lower.includes('gray') || lower.includes('scalp')) return DEMO_RESPONSES.hair;
  // Period/menstrual
  if (lower.includes('period') || lower.includes('menstr') || lower.includes('cramp') || lower.includes('cycle') || lower.includes('bleeding') || lower.includes('irregular')) return DEMO_RESPONSES.period;
  // PCOS
  if (lower.includes('pcos') || lower.includes('pcod') || lower.includes('polycystic') || lower.includes('ovarian cyst')) return DEMO_RESPONSES.pcos;
  // Pregnancy
  if (lower.includes('pregnan') || lower.includes('conceiv') || lower.includes('fertility') || lower.includes('baby') || lower.includes('trimester') || lower.includes('morning sickness') || lower.includes('postpartum')) return DEMO_RESPONSES.pregnancy;
  // Diet
  if (lower.includes('diet') || lower.includes('food') || lower.includes('eat') || lower.includes('meal') || lower.includes('nutrition') || lower.includes('recipe') || lower.includes('cook') || lower.includes('weight')) return DEMO_RESPONSES.diet;
  // Yoga
  if (lower.includes('yoga') || lower.includes('exercise') || lower.includes('asana') || lower.includes('pranayama') || lower.includes('meditation') || lower.includes('stretch')) return DEMO_RESPONSES.yoga;
  // Stress/mental
  if (lower.includes('stress') || lower.includes('anxiety') || lower.includes('sleep') || lower.includes('mental') || lower.includes('depress') || lower.includes('insomnia') || lower.includes('tired') || lower.includes('fatigue') || lower.includes('mood') || lower.includes('emotional')) return DEMO_RESPONSES.stress;
  // Immunity
  if (lower.includes('immun') || lower.includes('cold') || lower.includes('fever') || lower.includes('cough') || lower.includes('sick') || lower.includes('infection') || lower.includes('boost')) return DEMO_RESPONSES.immunity;
  return DEMO_RESPONSES.default;
}

const AiWellnessChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '🌿 Namaste! I\'m Dr. Ayur, your Ayurvedic wellness guide. Ask me anything about women\'s health, Ayurvedic remedies, yoga, diet, menstrual wellness, or holistic self-care. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let reply: string;

      if (USE_DEMO_MODE) {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
        reply = getDemoResponse(trimmed);
      } else {
        const res = await fetch(`${API_ENDPOINT}/ai-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, history: messages }),
        });
        const data = await res.json();
        reply = data.reply || 'I apologize, I could not process that. Please try again.';
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Simple markdown: **bold**, *italic*, - bullets, \n to <br>
  const renderMarkdown = (text: string) => {
    const html = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '• $1')
      .replace(/\n/g, '<br/>');
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all hover:scale-110 flex items-center justify-center text-2xl z-50"
          aria-label="Open AI Wellness Chat">
          🧘
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-purple-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧘</span>
              <div>
                <p className="font-semibold text-sm">Dr. Ayur</p>
                <p className="text-xs text-purple-200">Ayurvedic Wellness Coach</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-purple-200 text-lg" aria-label="Close chat">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                }`}>
                  {msg.role === 'user' ? msg.content : renderMarkdown(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Ask Dr. Ayur anything..."
                disabled={loading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none disabled:opacity-50" />
              <button onClick={sendMessage} disabled={loading || !input.trim()}
                className="w-9 h-9 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex-shrink-0">
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiWellnessChat;
