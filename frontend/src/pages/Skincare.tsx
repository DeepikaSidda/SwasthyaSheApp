import React from 'react';

const Skincare = () => {
  return (
    <div 
      className="container mx-auto px-4 py-8"
      style={{
        backgroundImage: 'url("/images/home-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Cover Image */}
      <div className="w-full h-64 bg-cover bg-center rounded-xl shadow-lg mb-6" 
        style={{ backgroundImage: 'url("/images/skincare.jpg")' }}
      ></div>
      
      <h1 className="text-3xl font-bold text-purple-600 text-center mb-6">🌿 Ayurvedic Classification of Skin & Its Modern Relevance</h1>
      <p className="text-lg text-gray-700 text-center mb-8">Ayurveda, the ancient Indian science of healing, classifies skin based on inner energies (Doshas) and deeper physiological functions, providing a unique perspective on skincare.</p>
      
      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">🔹 Why is Ayurvedic Skin Classification Important?</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Understands skin beyond surface-level symptoms.</li>
            <li>Aligns skincare with individual constitutions (Doshas).</li>
            <li>Helps prevent skin disorders by addressing imbalances early.</li>
          </ul>
        </div>
        
        {/* Right Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">🌿 Two Major Systems of Ayurvedic Skin Classification</h2>
          <p className="text-gray-700">Ayurveda classifies skin using two models:</p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li><strong>Charaka’s Two-Layer Model</strong>: Hydration (Udakdhara) and Blood Circulation (Asrukdhara).</li>
            <li><strong>Sushruta’s Seven-Layer Model</strong>: Describes seven layers with specific roles.</li>
          </ul>
        </div>
      </div>

      {/* Detailed Classification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">🌿 Charaka’s Two-Layer Model</h2>
          <p className="text-gray-700">Charaka categorized skin into two fundamental layers, emphasizing their role in maintaining skin health:</p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li><strong>Udakdhara (Hydration Layer)</strong>: This layer retains moisture, keeping the skin soft, supple, and smooth. It acts as a natural barrier against dryness and external pollutants, similar to the modern epidermis.</li>
            <li><strong>Asrukdhara (Blood Circulation Layer)</strong>: Responsible for supplying oxygen and essential nutrients to the skin, this layer supports wound healing, maintains an even skin tone, and prevents discoloration. It corresponds to the dermis in modern dermatology.</li>
          </ul>
          <p className="text-gray-700 mt-4">💡 <strong>Modern Relevance:</strong> Ayurveda’s focus on hydration and circulation aligns with today’s dermatological understanding of skin health, which emphasizes moisture retention and blood flow for a youthful appearance.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">🌿 Sushruta’s Seven-Layer Model</h2>
          <p className="text-gray-700">Sushruta expanded Charaka’s model by identifying seven distinct skin layers:</p>
          <table className="w-full border-collapse border border-gray-300 text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Layer Name</th>
                <th className="border border-gray-300 px-4 py-2">Function</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Avabhasini</td>
                <td className="border border-gray-300 px-4 py-2">Controls skin glow and complexion.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Lohita</td>
                <td className="border border-gray-300 px-4 py-2">Regulates blood circulation and pigmentation.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Shweta</td>
                <td className="border border-gray-300 px-4 py-2">Involved in immunity and infection resistance.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Tamra</td>
                <td className="border border-gray-300 px-4 py-2">Regulates skin’s protective barrier.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Vedini</td>
                <td className="border border-gray-300 px-4 py-2">Contains nerve endings for sensation.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Rohini</td>
                <td className="border border-gray-300 px-4 py-2">Supports skin healing and repair.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Mansadhara</td>
                <td className="border border-gray-300 px-4 py-2">Provides elasticity and firmness.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      



      <div className="bg-purple-100 min-h-screen p-6">
  <div className="max-w-6xl mx-auto text-center">
    <h1 className="text-4xl font-bold text-purple-700 mb-6">
      Ayurvedic Skin Care Guide
    </h1>
  </div>

  {/* Grid Layout */}
  <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

    {/* Section 1 */}
<div className="bg-white p-6 shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-purple-700">
    1. Core Ayurvedic Skin Care Principles
  </h2>
  <p className="mt-2 text-gray-600">Understanding skin types based on Doshas.</p>
  
  {/* Skin Type List */}
  <ul className="list-disc ml-6 mt-4 text-gray-700">
    <li>
      <strong>Vata Skin:</strong> Dry, thin, delicate
      <ul className="list-disc ml-6 mt-2 text-gray-600">
        <li>Prone to fine lines and signs of aging</li>
        <li>Prone to dryness, flakiness, and rough texture, especially in colder climates</li>
      </ul>
      <h3 className="text-lg font-semibold text-purple-600 mt-2">Care Tips:</h3>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Use rich oils, creams, and masks to keep the skin moisturized</li>
        <li>Avoid harsh or astringent products that strip natural oils</li>
        <li>Incorporate gentle oil massages with sesame or coconut oil</li>
        <li>Drink warm herbal teas like ginger or chamomile to maintain balance</li>
      </ul>
    </li>

    <li>
      <strong>Pitta Skin:</strong> Sensitive, prone to acne, redness
      <ul className="list-disc ml-6 mt-2 text-gray-600">
        <li>Oily texture, especially in the T-zone</li>
        <li>May flare up with stress, hot weather, or irritants</li>
      </ul>
      <h3 className="text-lg font-semibold text-purple-600 mt-2">Care Tips:</h3>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Use cooling products like aloe vera and rose water</li>
        <li>Avoid excessive scrubbing or harsh treatments that can aggravate the skin</li>
        <li>Hydrate with cooling drinks like mint or coconut water</li>
      </ul>
    </li>

    <li>
      <strong>Kapha Skin:</strong> Oily, thick, prone to clogged pores
      <ul className="list-disc ml-6 mt-2 text-gray-600">
        <li>Prone to acne, blackheads, and enlarged pores, especially in the T-zone</li>
        <li>Robust, smooth texture but may be prone to congestion and dullness</li>
      </ul>
      <h3 className="text-lg font-semibold text-purple-600 mt-2">Care Tips:</h3>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Use non-comedogenic products to control excess oil</li>
        <li>Exfoliate regularly to prevent clogged pores and breakouts</li>
        <li>Use tea tree oil and antimicrobial ingredients for acne</li>
        <li>Incorporate detoxifying ingredients like neem or turmeric</li>
      </ul>
    </li>
  </ul>
  <br></br>
  {/* Video Section */}
  <iframe
    className="w-full h-40 md:h-48 lg:h-56 rounded-lg shadow-md"
    src="https://www.youtube.com/embed/12uXyWcmX2g"
    title="Ayurvedic Skin Care Guide"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</div>


   {/* Video Section */}
<div className="flex flex-col justify-center items-center bg-purple-200 p-4 rounded-lg">
  {/* Image Section */}
  <div className="w-full mb-4"> 
    <img
      src="/images/reme.jpg" 
      alt="Buddhism and Mental Health"
      className="rounded-lg shadow-md w-full object-cover" 
    />
  </div>
  
  
</div>



{/* Section 2 */}
<div className="bg-white p-6 shadow-md rounded-lg">
<h2 className="text-2xl font-semibold text-purple-700 mb-4">
    2. Dinacharya (Daily Skin Care Rituals)
</h2>
<p className="text-gray-600 mb-4">
    Dinacharya refers to the daily routines that are essential for maintaining balance and good skin health according to Ayurveda. These rituals help in nurturing your body, mind, and spirit, creating harmony within. Here are some important practices:
</p>
<ul className="list-disc ml-6 mt-4 text-gray-700 space-y-2">
<li><strong>Cleansing:</strong> Use natural herbs & oils to cleanse the skin while preserving moisture and preventing dryness.</li>
<li><strong>Abhyanga:</strong> Medicated oils like sesame or almond oil nourish the skin, promote relaxation, and improve circulation.</li>
<li><strong>Natural Exfoliation:</strong> Ubtan (chickpea flour, turmeric, sandalwood, milk) removes dead skin cells and promotes a radiant complexion.</li>
<li><strong>Hydration:</strong> After cleansing, hydrate with aloe vera, coconut oil, or ghee to lock in moisture and keep the skin soft.</li>
<li><strong>Mindful Rest:</strong> Proper sleep helps the body regenerate and repair skin.</li>
<li><strong>Pranayama (Breathing Exercises):</strong> Deep breathing reduces stress, improves circulation, and supports skin health.</li>
</ul>
</div>


    {/* Exercises Video Section */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-pink-600 mb-4">
        Exercises for Period Pain Relief
      </h3>
      <iframe
        className="w-full h-40 md:h-48 lg:h-56 rounded-lg shadow-md"
        src="https://www.youtube.com/embed/YwxabXeE-hY"
        title="Exercise 1 for Period Pain Relief"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <h3 className="text-lg font-semibold text-pink-600 mb-4">
      Yoga & You
      </h3>
      <iframe
        className="w-full h-40 md:h-48 lg:h-56 rounded-lg shadow-md"
        src="https://www.youtube.com/embed/qSqI-TVKSf0"
        title="Exercise 1 for Period Pain Relief"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>

    {/* Section 3 */}
<div className="bg-white p-6 shadow-md rounded-lg md:col-span-2">
  <div className="flex space-x-8">
    {/* Left Section: Text */}
    <div className="w-1/2">
      <h2 className="text-2xl font-semibold text-purple-700">
        3. Ayurvedic Ingredients for Skin Health
      </h2>
      <p className="text-gray-600 text-sm mb-4">Best herbs and extracts for glowing skin.</p>
      <ul className="list-disc ml-6 mt-4 text-gray-700">
        <li><strong>Neem:</strong> Anti-bacterial, acne care</li>
        <li><strong>Turmeric:</strong> Anti-inflammatory, glowing skin</li>
        <li><strong>Sandalwood:</strong> Cooling, soothing</li>
        <li><strong>Aloe Vera:</strong> Hydration, healing</li>
      </ul>

      {/* Detailed Descriptions */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-purple-600">Neem:</h3>
        <p className="text-gray-600 text-sm mb-4"><strong>Benefits:</strong> Neem is known for its powerful antibacterial properties, making it excellent for treating acne, skin infections, and blemishes.</p>
        <p className="text-gray-600 text-sm mb-4"><strong>How it helps:</strong> Neem purifies the blood and reduces inflammation, preventing the formation of pimples and other skin irritations.</p>
        <p className="text-gray-600 text-sm mb-4"><strong>Usage:</strong> Neem leaves can be made into a paste for direct application on the skin, or neem oil can be used in a diluted form to target problem areas.</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-purple-600">Turmeric:</h3>
        <p className="text-gray-600 text-sm mb-4"><strong>Benefits:</strong> Turmeric is a powerful anti-inflammatory and antioxidant. It helps lighten skin, reduces acne scars, and imparts a natural glow to the complexion.</p>
        <p className="text-gray-600 text-sm mb-4"><strong>How it helps:</strong> Curcumin, the active compound in turmeric, fights oxidative stress and promotes healthy skin by reducing redness and irritation.</p>
        <p className="text-gray-600 text-sm mb-4"><strong>Usage:</strong> Turmeric can be mixed with milk or honey to create a face mask, or it can be consumed internally as well for its detoxifying effects.</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-purple-600">Sandalwood:</h3>
        <p className="text-gray-600 text-sm mb-4"><strong>Benefits:</strong> Sandalwood has a cooling effect, soothing the skin and reducing inflammation. It is also known for its ability to brighten skin and treat blemishes.</p>
        <p className="text-gray-600 text-sm mb-4"><strong>How it helps:</strong> Sandalwood contains anti-inflammatory and antibacterial properties, making it ideal for calming irritated skin and providing a smooth, even tone.</p>
        <p className="text-gray-600 text-sm mb-4"><strong>Usage:</strong> Sandalwood powder can be mixed with rose water or milk to form a paste that can be applied as a face mask.</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-purple-600">Aloe Vera:</h3>
        <p className="text-gray-600 text-sm mb-4"><strong>Benefits:</strong> Aloe vera is renowned for its hydrating and healing properties. It helps soothe sunburns, moisturize dry skin, and promote the healing of wounds and scars.</p>
        <p className="text-gray-600 text-sm mb-4"><strong>How it helps:</strong> Aloe vera contains vitamins, enzymes, and amino acids that nourish the skin, while its cooling properties help to calm inflammation and redness.</p>
        <p className="text-gray-600 text-sm mb-4"><strong>Usage:</strong> Fresh aloe vera gel can be applied directly to the skin or mixed into lotions and creams for daily use.</p>
      </div>

      <div className="mt-6">
        <p className="text-gray-600 text-sm mb-4">
          These ingredients, when used in Ayurvedic skincare routines, can help maintain healthy, glowing skin by treating common issues like acne, inflammation, dryness, and dullness. They also promote overall skin health with their natural and therapeutic qualities.
        </p>
      </div>
    </div>

    {/* Right Section: Image or additional content */}
    <div className="w-1/2">
      <img
        src="/images/na1.jpg" // Replace with your actual image path
        alt="Ayurvedic Ingredients"
        className="rounded-lg shadow-md w-full object-cover"
      />
    </div>
  </div>
</div>

    {/* Section 4 */}
<div className="bg-white p-6 shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-purple-700">
    4. Holistic Skin Health in Ayurveda
  </h2>
  <p className="text-gray-600 text-sm mb-4">
    In Ayurveda, skin health is not viewed in isolation. It is believed that the balance of the body, mind, and spirit directly impacts the skin’s appearance and health. Ayurvedic skincare focuses on understanding the root causes of skin conditions, which are often linked to internal imbalances. Ayurveda emphasizes the importance of maintaining harmony through a combination of diet, lifestyle, mental well-being, and herbal treatments.
  </p>

  <h3 className="text-xl font-semibold text-purple-600 mt-6">
    1. Digestion & Skin (Agni): Gut Health for Clear Skin
  </h3>
  <p className="text-gray-600 text-sm mb-4">
    Agni (digestive fire) plays a crucial role in Ayurvedic medicine. It is believed that the condition of the gut directly influences the health of the skin. When digestion is strong and efficient, the body is able to properly absorb nutrients and eliminate toxins (known as ama) from the body, which prevents them from manifesting as skin issues such as acne, eczema, or dryness.
  </p>
  <p className="text-gray-600 text-sm mb-4">
    Imbalances in Agni lead to a build-up of toxins in the body, which are reflected in the skin. For instance, poor digestion can cause pitta dosha imbalances, leading to acne, pimples, or redness.
  </p>
  <p className="text-gray-600 text-sm mb-4">
    Ayurvedic Tips:
  </p>
  <ul className="text-gray-600 text-sm mb-4">
    <li>Eat seasonal and fresh foods: Including easily digestible food and avoiding heavy, greasy meals helps in promoting good digestion.</li>
    <li>Herbs for digestion: Triphala and Ajwain (carom seeds) are commonly used to balance Agni.</li>
    <li>Digestive Spices: Incorporating spices such as ginger, cumin, and turmeric in meals supports healthy digestion.</li>
  </ul>

  <h3 className="text-xl font-semibold text-purple-600 mt-6">
    2. Detoxification: Panchakarma & Herbal Remedies
  </h3>
  <p className="text-gray-600 text-sm mb-4">
    Panchakarma is an Ayurvedic detoxification process that involves five main treatments aimed at removing toxins from the body and rejuvenating tissues.
  </p>
  <ul className="text-gray-600 text-sm mb-4">
    <li><strong>Vamana (Emesis):</strong> Induced vomiting to remove toxins from the stomach and lungs.</li>
    <li><strong>Virechana (Purgation):</strong> Detoxification through the bowels to eliminate excess Pitta (heat) and toxins.</li>
    <li><strong>Basti (Enema):</strong> Cleansing through the rectum, especially beneficial for balancing Vata dosha.</li>
    <li><strong>Raktamokshana (Bloodletting):</strong> Purification of blood, which can be beneficial for treating skin disorders like acne.</li>
    <li><strong>Nasya (Nasal Administration):</strong> Nasal cleansing using oils or herbal powders to remove toxins from the head and sinuses.</li>
  </ul>
  <p className="text-gray-600 text-sm mb-4">
    Herbal Remedies: Ayurvedic herbs like Neem, Tulsi (Holy Basil), Turmeric, and Aloe Vera are known for their detoxifying and antimicrobial properties. They are widely used in both internal and external treatments to cleanse the skin and remove toxins.
  </p>

  <h3 className="text-xl font-semibold text-purple-600 mt-6">
    3. Stress Management: Meditation, Yoga, Pranayama
  </h3>
  <p className="text-gray-600 text-sm mb-4">
    Stress is a significant contributor to many skin conditions. High levels of stress can lead to imbalances in the doshas, particularly Pitta (leading to inflammation and acne) and Vata (leading to dryness and premature aging).
  </p>
  <ul className="text-gray-600 text-sm mb-4">
    <li><strong>Yoga:</strong> Regular practice of Asanas (physical postures) promotes blood circulation, reduces tension, and balances the mind and body. Poses like Child’s Pose (Balasana), Downward Dog (Adho Mukha Svanasana), and Camel Pose (Ustrasana) are especially beneficial for releasing tension and promoting relaxation.</li>
    <li><strong>Meditation:</strong> Helps calm the mind, reduce stress, and balance emotions. Ayurvedic practitioners recommend regular meditation practices, such as mindfulness meditation or Mantra chanting (such as the chanting of OM), to reduce stress and improve mental clarity.</li>
    <li><strong>Pranayama (Breath Control):</strong> Pranayama techniques such as Nadi Shodhana (alternate nostril breathing) and Ujjayi breath help reduce stress, calm the nervous system, and bring mental clarity, leading to better skin health. Pranayama also increases oxygen supply to the skin, improving its radiance.</li>
  </ul>

  <h3 className="text-xl font-semibold text-purple-600 mt-6">
    4. Sleep & Skin Impact
  </h3>
  <p className="text-gray-600 text-sm mb-4">
    Sleep is vital for maintaining healthy skin. In Ayurveda, sleep is essential for the rejuvenation of tissues, including the skin. It is believed that inadequate or disturbed sleep leads to Vata dosha imbalance, which can manifest as dry, dull skin, and Pitta dosha imbalance, leading to inflammation and acne.
  </p>
  <p className="text-gray-600 text-sm mb-4">
    Ayurvedic Tips for Better Sleep:
  </p>
  <ul className="text-gray-600 text-sm mb-4">
    <li><strong>Vata-pacifying foods:</strong> Foods like warm milk, almonds, and honey can help calm the nervous system before sleep.</li>
    <li><strong>Herbal teas:</strong> Ashwagandha, Chamomile, and Lavender tea are commonly used to promote relaxation and improve sleep quality.</li>
    <li><strong>Oil Massage:</strong> A warm oil massage, especially with Sesame Oil or Vata oils (e.g., Brahmi oil), before bed helps relax the body, soothe the mind, and improve sleep.</li>
    <li><strong>Sleep Hygiene:</strong> Following a regular sleep routine, avoiding caffeine or electronics before bed, and creating a calming environment are essential for promoting restful sleep.</li>
  </ul>
  <p className="text-gray-600 text-sm mb-4">
    Impact on Skin: During deep sleep, the body heals and regenerates skin cells. If sleep is disturbed, this regeneration process is hindered, leading to premature aging and dull skin.
  </p>
</div>


   {/* Section 5 */}
<div className="bg-white p-6 shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-purple-700">
    5. Common Ayurvedic Skin Concerns & Remedies
  </h2>
  
  {/* Acne Section */}
  <h3 className="text-xl font-semibold text-purple-600 mt-6">
    1. Acne: Cooling and Balancing the Pitta Dosha
  </h3>
  <p className="text-gray-600 text-sm mb-4">
    Acne is often caused by imbalances in the Pitta dosha, leading to inflammation, excess oil production, and clogged pores. Ayurvedic remedies for acne focus on cooling, cleansing, and balancing the Pitta.
  </p>
  <p className="text-gray-600 text-sm mb-4">
    <strong>Remedies:</strong>
  </p>
  <ul className="text-gray-600 text-sm mb-4">
    <li><strong>Neem:</strong> Known for its antibacterial, antifungal, and anti-inflammatory properties, neem leaf paste can be applied to acne-prone areas to reduce inflammation and infection.</li>
    <li><strong>Turmeric:</strong> Turmeric contains curcumin, which has potent anti-inflammatory and antimicrobial properties. It helps in reducing acne, preventing scarring, and calming irritated skin.</li>
    <li><strong>Multani Mitti + Rosewater Face Pack:</strong> Multani Mitti (Fuller’s Earth) absorbs excess oil, tightens pores, and removes impurities. Rosewater soothes the skin and balances moisture.</li>
  </ul>

  {/* Dry Skin Section */}
  <h3 className="text-xl font-semibold text-purple-600 mt-6">
    2. Dry Skin: Nourishing and Hydrating Vata Dosha
  </h3>
  <p className="text-gray-600 text-sm mb-4">
    Dry skin is typically associated with imbalances in the Vata dosha, leading to rough, flaky, and itchy skin. Ayurvedic treatments focus on nourishing, hydrating, and moisturizing the skin.
  </p>
  <p className="text-gray-600 text-sm mb-4">
    <strong>Remedies:</strong>
  </p>
  <ul className="text-gray-600 text-sm mb-4">
    <li><strong>Almond Oil:</strong> Rich in Vitamin E and fatty acids, almond oil deeply moisturizes the skin, reducing dryness and promoting a soft, supple complexion.</li>
    <li><strong>Aloe Vera + Honey Mask:</strong> Aloe Vera soothes and hydrates, while honey acts as a natural humectant, drawing moisture into the skin.</li>
  </ul>

  {/* Hyperpigmentation Section */}
  <h3 className="text-xl font-semibold text-purple-600 mt-6">
    3. Hyperpigmentation: Brightening the Skin
  </h3>
  <p className="text-gray-600 text-sm mb-4">
    Hyperpigmentation occurs when there is an overproduction of melanin, leading to dark spots or uneven skin tone. Ayurvedic remedies focus on brightening and lightening the skin without causing irritation.
  </p>
  <p className="text-gray-600 text-sm mb-4">
    <strong>Remedies:</strong>
  </p>
  <ul className="text-gray-600 text-sm mb-4">
    <li><strong>Sandalwood:</strong> Known for its brightening properties, sandalwood helps lighten dark spots and reduce inflammation.</li>
    <li><strong>Turmeric:</strong> Turmeric's active compound, curcumin, is a powerful agent for skin-brightening and reducing pigmentation.</li>
    <li><strong>Milk Pack:</strong> Milk contains lactic acid, which helps exfoliate and lighten hyperpigmented areas while promoting skin regeneration.</li>
  </ul>

  {/* Oily Skin Section */}
  <h3 className="text-xl font-semibold text-purple-600 mt-6">
    4. Oily Skin: Balancing the Kapha and Pitta Doshas
  </h3>
  <p className="text-gray-600 text-sm mb-4">
    Oily skin is often caused by imbalances in the Kapha and Pitta doshas, leading to excess oil production. Ayurvedic remedies for oily skin focus on absorbing excess oil, balancing sebum production, and preventing clogged pores.
  </p>
  <p className="text-gray-600 text-sm mb-4">
    <strong>Remedies:</strong>
  </p>
  <ul className="text-gray-600 text-sm mb-4">
    <li><strong>Clay Mask with Sandalwood & Rosewater:</strong> Clay absorbs excess oil and detoxifies the skin. Sandalwood soothes, and Rosewater balances the skin’s pH.</li>
  </ul>

  {/* Ayurvedic Tips */}
  <h3 className="text-xl font-semibold text-purple-600 mt-6">
    5. Ayurvedic Tips for Healthy Skin
  </h3>
  <p className="text-gray-600 text-sm mb-4">
    For Acne: Regularly cleanse with mild herbal cleansers like neem soap or turmeric-infused face washes.
  </p>
  <p className="text-gray-600 text-sm mb-4">
    For Dry Skin: Avoid harsh soaps and use creamy, nourishing cleansers. Moisturize with oils like sesame or coconut oil.
  </p>
  <p className="text-gray-600 text-sm mb-4">
    For Hyperpigmentation: Consistency is key. Use treatments like sandalwood or turmeric packs 2-3 times a week.
  </p>
  <p className="text-gray-600 text-sm mb-4">
    For Oily Skin: Follow a routine of gentle cleansing, followed by toning with natural astringents like rosewater.
  </p>
  <br></br>
  <br></br>
  <div className="space-y-4">
      <h3 className="text-lg font-semibold text-pink-600 mb-4">
      DIY for beautiful and healthy skin
      </h3>
      <iframe
        className="w-full h-40 md:h-48 lg:h-56 rounded-lg shadow-md"
        src="https://www.youtube.com/embed/ON3qy28d1bw"
        title="Exercise 1 for Period Pain Relief"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      </div>
</div>


<div className="w-full flex justify-center">
  <div className="bg-white p-6 shadow-md rounded-lg max-w-screen-xl w-full">
    <h2 className="text-2xl font-semibold text-purple-700 mb-6 text-center">
      6. Trending Ayurvedic Skin Treatments
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {/* Treatment 1 */}
      <div className="border-2 border-purple-200 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-purple-600">
          Kansa Wand Face Massage: Detoxifies, Balances Skin pH
        </h3>
        <p className="text-gray-600 text-sm mt-4">
          The Kansa Wand is a traditional Ayurvedic tool made of bronze that is used for facial massages. It is believed to have powerful healing properties that help detoxify the skin, balance the skin’s pH levels, and promote relaxation. The wand’s metal helps to draw out toxins from the skin while stimulating blood circulation. Regular use of the Kansa Wand massage can lead to improved skin texture, reduced puffiness, and a radiant complexion.
        </p>
      </div>

      {/* Treatment 2 */}
      <div className="border-2 border-purple-200 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-purple-600">
          Mukha Abhyanga: Ayurvedic Facial Massage
        </h3>
        <p className="text-gray-600 text-sm mt-4">
          Mukha Abhyanga is an Ayurvedic facial massage designed to rejuvenate and refresh the face. It involves the use of herbal oils and gentle strokes that target pressure points on the face. This treatment helps in improving circulation, detoxifying the skin, reducing stress, and enhancing the elasticity of the skin. Mukha Abhyanga is also known for its ability to slow down the signs of aging, reduce fine lines, and provide a natural glow to the skin.
        </p>
      </div>

      {/* Treatment 3 */}
      <div className="border-2 border-purple-200 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-purple-600">
          Ubtan Ritual: Herbal Face & Body Packs
        </h3>
        <p className="text-gray-600 text-sm mt-4">
          Ubtan is a traditional Ayurvedic paste made from a mixture of natural ingredients such as turmeric, chickpea flour, rosewater, and herbs. This paste is applied to the face and body as a scrub or mask to cleanse, exfoliate, and brighten the skin. Ubtan helps to remove dead skin cells, unclog pores, and promote a smooth, glowing complexion. It is often used in Ayurvedic skincare rituals for its ability to purify and nourish the skin deeply.
        </p>
      </div>

      {/* Treatment 4 */}
      <div className="border-2 border-purple-200 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-purple-600">
          Panchakarma: Detox Therapy for Skin Rejuvenation
        </h3>
        <p className="text-gray-600 text-sm mt-4">
          Panchakarma is a comprehensive Ayurvedic detoxification process that helps to cleanse the body of toxins (ama) and rejuvenate the skin. It involves a series of therapeutic treatments such as oil massages, steam therapies, and cleansing procedures. Panchakarma is aimed at balancing the doshas and restoring harmony in the body. For the skin, it helps in removing impurities, improving circulation, and promoting a youthful and healthy appearance.
        </p>
      </div>
    </div>
  </div>
  
</div>
<div className="flex flex-col justify-center items-center bg-purple-200 p-4 rounded-lg">
  {/* Image Section */}
  <div className="w-full mb-4"> 
    <img
      src="/images/tree.jpg" 
      alt="Buddhism and Mental Health"
      className="rounded-lg shadow-md w-full object-cover" 
    />
  </div>
  
  
</div>



  

</div>

</div>
</div>






    
  );
};

export default Skincare;
