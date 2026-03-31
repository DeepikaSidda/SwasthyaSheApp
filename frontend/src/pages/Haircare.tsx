import React from 'react';

const Haircare = () => {
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
        style={{ backgroundImage: 'url("/images/hair.jpg")' }}
      ></div>
      <h1 className="text-3xl font-bold text-purple-600 text-center mb-6">🌿 Ayurvedic Classification of Hair & Its Modern Relevance</h1>
<p className="text-lg text-gray-700 text-center mb-8">Ayurveda, the ancient Indian science of healing, classifies hair based on inner energies (Doshas) and deeper physiological functions, providing a unique perspective on hair care.</p>
{/* Grid Section */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
  <h2 className="text-xl font-semibold text-purple-600 mb-4">🔹 Why is Ayurvedic Hair Classification Important?</h2>
  <ul className="list-disc list-inside text-gray-700">
    <li>Understands hair beyond surface-level issues.</li>
    <li>Aligns hair care with individual constitutions (Doshas).</li>
    <li>Prevents hair disorders by addressing imbalances early.</li>
    <li>Balances the scalp's natural oil production.</li>
    <li>Promotes holistic hair health through diet and lifestyle.</li>
    <li>Connects hair health to mental & emotional well-being.</li>
  </ul>
</div>
        
        {/* Right Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-purple-600 mb-4">
        🌿 Two Major Systems of Ayurvedic Hair Classification
      </h2>
      <p className="text-gray-700">Ayurveda classifies hair based on Doshas and nourishment principles:</p>
      <ul className="list-disc list-inside text-gray-700 mt-2">
        <li>
          <strong>Three-Dosha Model</strong>: Classifies hair into <strong>Vata (Dry & Frizzy)</strong>, <strong>Pitta (Thin & Prone to Hair Fall)</strong>, and <strong>Kapha (Oily & Dandruff-Prone)</strong> types.
        </li>
        <li>
          <strong>Keshya Dravyas (Hair-Nourishing Substances)</strong>: Ayurvedic herbs and oils that enhance hair strength, growth, and scalp health.
        </li>
        <li>
          <strong>Raktashuddhi (Blood Purification)</strong>: Good blood circulation ensures healthy hair follicles and reduces hair fall.
        </li>
        <li>
          <strong>Ojas & Tejas (Vital Energies)</strong>: Represent the shine, strength, and vitality of hair.
        </li>
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
          <h2 className="text-xl font-semibold text-purple-600 mb-4">🌿 Sushruta’s Seven-Layer Model for Hair</h2>
          <p className="text-gray-700">Sushruta expanded Ayurvedic hair science by identifying seven essential layers that contribute to hair health:</p>
          <table className="w-full border-collapse border border-gray-300 text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Layer Name</th>
                <th className="border border-gray-300 px-4 py-2">Function</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Kesha Madhu</td>
                <td className="border border-gray-300 px-4 py-2">Governs hair shine, softness, and luster.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Rakta Srotas</td>
                <td className="border border-gray-300 px-4 py-2">Supports blood circulation to hair follicles, preventing hair fall.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Shweta Kesh</td>
                <td className="border border-gray-300 px-4 py-2">Influences melanin production, affecting hair color and premature greying.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Tamra Kesh</td>
                <td className="border border-gray-300 px-4 py-2">Strengthens the scalp’s protective barrier against infections.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Vedini Kesh</td>
                <td className="border border-gray-300 px-4 py-2">Contains sensory receptors, contributing to scalp sensitivity and health.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Rohini Kesh</td>
                <td className="border border-gray-300 px-4 py-2">Aids in hair follicle regeneration and healing from damage.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Mamsadhara</td>
                <td className="border border-gray-300 px-4 py-2">Provides structural strength and thickness to hair strands.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      
<br></br>



  
    

    {/* Grid Layout */}
  <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

{/* Section 1 */}
<div className="bg-white p-6 shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-purple-700">
    1. Core Ayurvedic Hair Care Principles
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
</div>

{/* Embedded Videos */}
<div className="bg-white p-6 shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-purple-700">Hair Care Tips & Remedies</h2>
  <div className="mt-4 space-y-4">
    <iframe width="100%" height="315" src="https://www.youtube.com/embed/BrMaizgAcq4" title="4 Best Natural Home Remedies to Prevent from Your Hair Loss Permanently | Hair Loss Treatment" ></iframe>
    <iframe width="100%" height="315" src="https://www.youtube.com/embed/MeOWcbfbGa0" title="4 Natural Secrets for Rapid Hair Growth in 7 Days | Causes & Hair Growth Solutions| Hair Growth Tips" ></iframe>
    <iframe width="100%" height="315" src="https://www.youtube.com/embed/7XlLFgXLM1s" title="Home Treatments for Dandruff | How to Treat Dandruff at Home | Hair Care Tips | Home Remedies" ></iframe>
    <iframe width="100%" height="315" src="https://www.youtube.com/embed/3j-YNI36sDM" title="3 Natural Methods to Increase Thickness and Volume of Your Hair I Hair Growth tips"  ></iframe>
  </div>
</div>

</div>


<div className="max-w-6xl mx-auto p-6">
      {/* Grid Layout for Images */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <img
          src="/images/Hair1.jpg"
          alt="Skin Care 1"
          className="w-full h-auto rounded-lg shadow-md"
        />
        <img
          src="/mages/Hair2.jpg"
          alt="Skin Care 2"
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>

</div>



</div>


  );
};

export default Haircare;
