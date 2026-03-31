import React, { useState } from 'react';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  benefits: string[];
  doshaBalance: string;
}

interface AyurvedicRecipeGeneratorProps {
  doshaType: string | null;
  cyclePhase: string;
}

const AyurvedicRecipeGenerator: React.FC<AyurvedicRecipeGeneratorProps> = ({ doshaType, cyclePhase }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [rawResponse, setRawResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const commonVegetables = [
    '🥔 Potato', '🍅 Tomato', '🥕 Carrot', '🧅 Onion', '🌶️ Green Chili',
    '🥒 Cucumber', '🍆 Brinjal', '🫑 Capsicum', '🥬 Spinach', '🌿 Coriander',
    '🧄 Garlic', '🫚 Ginger', '🥦 Cauliflower', '🫘 Beans', '🌽 Corn',
    '🥜 Peas', '🍠 Sweet Potato', '🫛 Drumstick', '🥗 Cabbage', '🥭 Raw Mango',
    '🍋 Lemon', '🥥 Coconut', '🫒 Okra (Bhindi)', '🌱 Methi (Fenugreek)', '🍃 Curry Leaves',
    '🌾 Ridge Gourd', '🫐 Bitter Gourd', '🧊 Bottle Gourd', '🪷 Lotus Stem', '🌰 Beetroot',
  ];

  const commonSpices = [
    '🟡 Turmeric', '🔴 Red Chili Powder', '🟤 Cumin Seeds', '⚫ Mustard Seeds', '🟠 Coriander Powder',
    '🫚 Ginger Powder', '🟤 Garam Masala', '🌿 Fenugreek Seeds', '⬛ Black Pepper', '🟡 Asafoetida (Hing)',
    '🌿 Cardamom', '🟤 Cinnamon', '⭐ Star Anise', '🌿 Bay Leaf', '🟤 Cloves',
    '🟡 Saffron', '🌿 Fennel Seeds', '🟤 Nutmeg', '🫚 Dry Ginger', '🌿 Tulsi (Holy Basil)',
  ];

  const commonGrains = [
    '🍚 Rice', '🫓 Wheat Flour', '🌾 Millet (Ragi)', '🫘 Moong Dal', '🫘 Toor Dal',
    '🫘 Chana Dal', '🌾 Oats', '🌾 Quinoa', '🫘 Rajma', '🫘 Black Gram (Urad)',
  ];

  const addTag = (tag: string) => {
    const clean = tag.replace(/^[^\w]*/, '').trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setInputValue('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) addTag(inputValue.trim());
    }
  };

  const generateRecipes = async () => {
    if (tags.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }
    setLoading(true);
    setError(null);
    setRecipes([]);
    setRawResponse('');

    const ingredientList = tags.join(', ');
    const prompt = `I have these vegetables/ingredients: ${ingredientList}. 
Generate 3 Ayurvedic recipes suitable for ${doshaType || 'balanced'} dosha during ${cyclePhase} phase.
For each recipe provide:
- Recipe name (Indian/Ayurvedic dish)
- List of ingredients with quantities
- Step by step cooking instructions
- Health benefits according to Ayurveda
- Which doshas it balances

IMPORTANT: Do NOT include any greeting or introduction. Start directly with "Recipe 1:" 
Format each recipe with clear headers: "Recipe 1:", "Recipe 2:", "Recipe 3:"
Use bullet points for ingredients, numbered steps for instructions.`;

    try {
      const response = await fetch(`${API_ENDPOINT}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          doshaProfile: doshaType ? { dominantDosha: doshaType } : undefined,
          cyclePhase,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate recipes');
      const data = await response.json();
      const aiText = data.reply || '';
      setRawResponse(aiText);

      // Parse AI response into recipes
      const parsed = parseRecipes(aiText);
      setRecipes(parsed);
    } catch (err) {
      setError('Could not generate recipes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parseRecipes = (text: string): Recipe[] => {
    const allBlocks = text.split(/Recipe\s*\d+\s*:/i);
    // First block is text before "Recipe 1:" (greeting/intro) — skip it
    const recipeBlocks = allBlocks.slice(1).filter(b => b.trim().length > 20);
    return recipeBlocks.slice(0, 3).map(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      
      // Skip greeting/intro lines
      const skipPatterns = /^(namaste|hello|hi |dear|welcome|greetings|warm|here are|sure|certainly|of course|i'd|let me|based on|🌿|🌸|✨)/i;
      const filteredLines = lines.filter(l => {
        const cleaned = l.replace(/^[-*#\s]+/, '').replace(/\*\*/g, '').trim();
        return !skipPatterns.test(cleaned) && cleaned.length > 2;
      });
      
      // Find the recipe name - first non-empty line that looks like a name (not a section header)
      const sectionHeaders = /^(ingredient|instruction|method|step|benefit|health|dosha|direction|preparation|cooking)/i;
      let name = 'Ayurvedic Recipe';
      for (const line of filteredLines) {
        const cleaned = line.replace(/^[-*#\s]+/, '').replace(/\*\*/g, '').trim();
        if (cleaned.length > 3 && cleaned.length < 80 && !sectionHeaders.test(cleaned) && !cleaned.startsWith('•')) {
          name = cleaned;
          break;
        }
      }
      
      const ingredients: string[] = [];
      const instructions: string[] = [];
      const benefits: string[] = [];
      let section = '';

      for (const line of filteredLines) {
        const lower = line.toLowerCase();
        if (lower.includes('ingredient')) { section = 'ing'; continue; }
        if (lower.includes('instruction') || lower.includes('method') || lower.includes('step') || lower.includes('direction') || lower.includes('preparation')) { section = 'ins'; continue; }
        if (lower.includes('benefit') || lower.includes('health')) { section = 'ben'; continue; }
        if (lower.includes('dosha') || lower.includes('balance')) { section = 'dosha'; continue; }

        const cleaned = line.replace(/^[-*•\d.)\s]+/, '').replace(/\*\*/g, '').trim();
        if (cleaned.length < 3 || cleaned === name) continue;

        if (section === 'ing' && ingredients.length < 10) ingredients.push(cleaned);
        else if (section === 'ins' && instructions.length < 8) instructions.push(cleaned);
        else if (section === 'ben' && benefits.length < 5) benefits.push(cleaned);
      }

      return { name, ingredients, instructions, benefits, doshaBalance: doshaType || 'balanced' };
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">🍳</span>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">Ayurvedic Recipe Generator</h3>
            <span className="px-2.5 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-xs font-medium">🤖 AI Powered</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 ml-[52px]">Enter your available vegetables and get personalized Ayurvedic recipes</p>
      </div>

      {/* Quick Add Ingredients */}
      <div className="mb-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">🥬 Vegetables</p>
          <div className="flex flex-wrap gap-2">
            {commonVegetables.map((veg) => {
              const name = veg.replace(/^[^\w]*\s*/, '');
              const isAdded = tags.includes(name);
              return (
                <button key={veg} onClick={() => !isAdded && addTag(name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-90 ${
                    isAdded ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                  }`}
                >{veg} {isAdded && '✓'}</button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1">🌶️ Spices & Herbs</p>
          <div className="flex flex-wrap gap-2">
            {commonSpices.map((spice) => {
              const name = spice.replace(/^[^\w]*\s*/, '');
              const isAdded = tags.includes(name);
              return (
                <button key={spice} onClick={() => !isAdded && addTag(name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-90 ${
                    isAdded ? 'bg-orange-100 text-orange-700 border border-orange-300' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700'
                  }`}
                >{spice} {isAdded && '✓'}</button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-1">🌾 Grains & Lentils</p>
          <div className="flex flex-wrap gap-2">
            {commonGrains.map((grain) => {
              const name = grain.replace(/^[^\w]*\s*/, '');
              const isAdded = tags.includes(name);
              return (
                <button key={grain} onClick={() => !isAdded && addTag(name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-90 ${
                    isAdded ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
                  }`}
                >{grain} {isAdded && '✓'}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Input Field */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 p-3 bg-white border-2 border-gray-200 rounded-xl focus-within:border-orange-400 transition-colors min-h-[48px]">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-red-600 ml-1 text-xs">✕</button>
            </span>
          ))}
          <input
            type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? "Type vegetables (press Enter to add)..." : "Add more..."}
            className="flex-1 min-w-[150px] outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add each ingredient</p>
      </div>

      {/* Generate Button */}
      <button onClick={generateRecipes} disabled={loading || tags.length === 0}
        className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl ${
          loading || tags.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {loading ? (
          <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> Generating Recipes...</>
        ) : (
          <><span className="text-lg">🍳</span> Generate Ayurvedic Recipes ({tags.length} ingredients)</>
        )}
      </button>

      {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

      {/* Recipe Results */}
      {recipes.length > 0 && (
        <div className="mt-6 space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span>🍽️</span> Your Personalized Recipes
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">✨ AI Generated</span>
          </h4>
          {recipes.map((recipe, idx) => (
            <div key={idx} className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 rounded-2xl border border-orange-100 p-6 hover:shadow-lg transition-all duration-300 animate-fadeInUp" style={{ opacity: 0, animationDelay: `${idx * 150}ms`, animationFillMode: 'forwards' }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-2xl">🥘</span>
                </div>
                <div>
                  <h5 className="text-lg font-bold text-gray-900">{recipe.name}</h5>
                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full capitalize">{recipe.doshaBalance} balancing</span>
                </div>
              </div>

              {recipe.ingredients.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1"><span>🧂</span> Ingredients</h6>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.map((ing, i) => (
                      <span key={i} className="px-3 py-1 bg-white rounded-full text-xs text-gray-700 border border-gray-200 shadow-sm hover:scale-[1.02] transition-all duration-200">{ing}</span>
                    ))}
                  </div>
                </div>
              )}

              {recipe.instructions.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1"><span>👩‍🍳</span> Instructions</h6>
                  <ol className="space-y-2">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-700 hover:scale-[1.02] transition-all duration-200">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {recipe.benefits.length > 0 && (
                <div>
                  <h6 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1"><span>🌿</span> Ayurvedic Benefits</h6>
                  <div className="flex flex-wrap gap-2">
                    {recipe.benefits.map((b, i) => (
                      <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200 hover:scale-[1.02] transition-all duration-200">{b}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Raw AI Response fallback */}
      {rawResponse && recipes.length === 0 && !loading && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>🍽️</span> AI Recipe Suggestions
          </h4>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{rawResponse}</div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AyurvedicRecipeGenerator;
