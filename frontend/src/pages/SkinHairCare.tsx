import React from 'react';
import { Link } from 'react-router-dom';

const PeriodHealth = () => {
  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{
        backgroundImage: 'url("/images/home-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <h1 className="text-3xl font-bold text-purple-800 mb-8">
        Ayurvedic Glow: Skin & Hair Wellness
      </h1>

      {/* Navigation Section */}
      <section className="mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/skin-care" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                Ayurvedic Skin Therapy
              </h3>
              <p className="text-gray-800 text-sm mb-4">
                Ancient herbal remedies for glowing, healthy skin.
              </p>
            </div>
          </Link>
          <Link to="/hair-care" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                Ayurvedic Hair Therapy
              </h3>
              <p className="text-gray-800 text-sm mb-4">
                Natural nourishment for strong, shiny, healthy hair.
              </p>
            </div>
          </Link>
        </div>
      </section>







      <div className="bg-white p-8 md:p-12 w-full max-w-6xl rounded-lg">
        {/* Text Content */}
        <h2 className="text-4xl font-bold text-purple-600 text-center">
          The Impact of Modern Lifestyles on Hair and Skin Health
        </h2>
        <div className="max-w-5xl mx-auto mt-6 text-gray-700">
          <p className="text-gray-600 text-sm mb-4">
            Modern lifestyles significantly impact hair and skin health due to environmental pollution, 
            poor dietary habits, stress, and excessive use of chemical-based products. Constant exposure 
            to pollutants and UV radiation leads to dull skin, premature aging, and weakened hair follicles.
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Unhealthy diets rich in processed foods and lacking essential nutrients such as vitamins A, C, 
            and E contribute to hair thinning, breakouts, and skin dryness. Chronic stress and poor sleep 
            disrupt hormonal balance, causing acne, dark circles, and hair loss.
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Additionally, excessive use of heat styling tools, harsh skincare products, and skipping sunscreen 
            accelerate skin damage and hair breakage. Lifestyle choices like smoking, alcohol consumption, and 
            prolonged screen exposure further deplete skin moisture and weaken hair structure.
          </p>
          <p className="text-lg leading-relaxed font-medium text-purple-600 mt-4">
            To maintain healthy skin and hair, adopting a balanced diet, staying hydrated, managing stress, 
            and following a proper skincare and haircare routine are essential. By making mindful choices, 
            individuals can prevent damage and enhance their natural beauty.
          </p>
        </div>
      </div>

<br></br>


<div className="bg-white p-8 md:p-12 w-full max-w-6xl rounded-lg">
  {/* Title */}
  <h2 className="text-3xl font-bold text-purple-600 text-center">
    Why Avoid Chemical-Based Products?
  </h2>
  <h3 className="text-xl font-semibold text-purple-500 text-center mt-2">
    Their Effects on Health & The Power of Natural Alternatives
  </h3>

  {/* Introduction */}
  <br></br>
  <p className="text-gray-600 text-sm mb-4">
    Many skincare and haircare products contain harmful chemicals that may provide short-term benefits
    but cause <strong>long-term damage</strong> to both appearance and overall health. Synthetic ingredients like 
    <span className="font-medium text-purple-700"> parabens, sulfates, silicones, phthalates,</span>
    and artificial fragrances can disrupt the body’s natural balance, leading to <strong>skin irritation, hair
    damage, and even serious health concerns</strong>. Switching to <strong>natural alternatives</strong> helps maintain a 
    healthier body and a sustainable environment.
  </p>

  {/* Grid Sections */}
  <div className="grid md:grid-cols-2 gap-6 mt-10">

    {/* Section 1: Skin and Hair Damage */}
    <div className="bg-purple-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-purple-600">
        1. Skin and Hair Damage
      </h3>
      <ul className="list-disc list-inside mt-3 space-y-2 text-base text-gray-700">
        <li><strong className="text-purple-700">Skin Irritation & Allergies:</strong> Parabens and artificial fragrances can cause redness, rashes, and sensitivity.</li>
        <li><strong className="text-purple-700">Acne & Breakouts:</strong> Silicone-based products clog pores, leading to breakouts.</li>
        <li><strong className="text-purple-700">Premature Aging:</strong> Harsh chemicals strip skin moisture, causing <strong>fine lines, wrinkles, and dullness</strong>.</li>
        <li><strong className="text-purple-700">Hair Weakening & Hair Loss:</strong> Sulfates remove natural oils, making hair <strong>dry, brittle, and prone to breakage</strong>.</li>
        <li><strong className="text-purple-700">Scalp Issues:</strong> Frequent exposure to <strong>synthetic ingredients</strong> can lead to <strong>dandruff, itchiness, and inflammation</strong>.</li>
      </ul>
    </div>

    {/* Section 2: Hormonal Disruptions */}
    <div className="bg-purple-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-purple-600">
        2. Hormonal Disruptions
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        Chemicals like <span className="font-medium text-purple-700">phthalates and parabens</span> mimic estrogen, disrupting the endocrine system and affecting overall <strong>hormonal balance</strong>. 
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 space-y-2">
        <li><strong className="text-purple-700">Irregular Menstrual Cycles:</strong> Hormone-mimicking chemicals interfere with <strong>normal reproductive functions</strong>.</li>
        <li><strong className="text-purple-700">Thyroid Disorders:</strong> Endocrine disruptors can alter <strong>thyroid hormone levels</strong>, leading to fatigue, mood swings, and weight gain.</li>
        <li><strong className="text-purple-700">Fertility Issues:</strong> Exposure to synthetic chemicals reduces <strong>egg quality and sperm count</strong>.</li>
        <li><strong className="text-purple-700">Increased Cancer Risk:</strong> Some parabens and phthalates are linked to <strong>breast and ovarian cancer</strong>.</li>
      </ul>
    </div>

    {/* Section 3: Serious Health Risks */}
    <div className="bg-purple-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-purple-600">
        3. Increased Risk of Serious Health Conditions
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        Long-term exposure to chemicals in beauty products can lead to <strong>chronic diseases</strong>.
      </p>
      <ul className="list-disc list-inside mt-3 space-y-2 text-base text-gray-700">
        <li><strong className="text-purple-700">Parabens & Phthalates:</strong> Linked to <strong>hormone-related cancers</strong> like <strong>breast and prostate cancer</strong>.</li>
        <li><strong className="text-purple-700">Formaldehyde:</strong> Found in some hair treatments; a <strong>known carcinogen</strong> that can cause respiratory issues.</li>
        <li><strong className="text-purple-700">Heavy Metals:</strong> Lead and mercury in cosmetics can <strong>damage the nervous system</strong> and cause <strong>long-term toxicity</strong>.</li>
        <li><strong className="text-purple-700">Fragrance Chemicals:</strong> Artificial scents contain allergens that can cause <strong>asthma, migraines, and skin sensitivity</strong>.</li>
      </ul>
    </div>

    {/* Section 4: Environmental Impact */}
    <div className="bg-purple-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-purple-600">
        4. Environmental Impact
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        Chemical-heavy beauty products not only harm human health but also <strong>pollute the environment</strong>.
      </p>
      <ul className="list-disc list-inside mt-3 space-y-2 text-base text-gray-700">
        <li><strong className="text-purple-700">Water Pollution:</strong> Harmful chemicals <strong>wash off into water bodies</strong>, affecting marine life.</li>
        <li><strong className="text-purple-700">Microplastics in Products:</strong> Synthetic ingredients contribute to <strong>plastic pollution</strong> in oceans.</li>
        <li><strong className="text-purple-700">Non-Biodegradable Waste:</strong> Packaging from chemical-based products adds to <strong>landfill waste and pollution</strong>.</li>
        <li><strong className="text-purple-700">Harm to Wildlife:</strong> Chemical residues <strong>contaminate soil, air, and water</strong>, harming ecosystems.</li>
      </ul>
    </div>

  </div>

  {/* Conclusion */}
  <div className="text-center mt-10">
    <h3 className="text-xl font-semibold text-purple-600">Switch to Natural & Safe Alternatives 🌿</h3>
    <p className="text-gray-600 text-xs mt-2 max-w-3xl mx-auto">
      By choosing <strong>organic, plant-based, and toxin-free</strong> products, you can <strong>protect your health and the environment</strong>.
      Opt for <strong>herbal hair oils, organic face cleansers, and eco-friendly beauty solutions</strong> for <strong>a safer, healthier lifestyle</strong>.  
    </p>
  </div>
</div>

    </div>
    
    
    
  );
};

export default PeriodHealth;
