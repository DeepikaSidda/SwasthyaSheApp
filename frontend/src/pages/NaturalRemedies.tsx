
import React from "react";
const NaturalRemedies = () => {

 
  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{
        backgroundImage: 'url("/images/home-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
      
           
    >
      {/* Top Image */}
      <div className="flex justify-center mb-6">
        <img
          src="/images/food.png"
          alt="Natural Remedies"
          className="w-full max-w-3xl rounded-lg shadow-md object-cover"
        />
      </div>

      
      
      <h1 className="text-3xl font-bold text-purple-800 text-center mb-8">
      Natural Remedies for Period Cramps
      </h1>
      <section className="bg-pink-50 p-6 rounded-lg shadow-md w-full">
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Remedies Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm relative bg-cover bg-center" >
          <div className="bg-white bg-opacity-90 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-pink-600 mb-2">Period Cramps Relief</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li><strong>Warm Ginger Tea:</strong> Boil fresh ginger slices in water and drink to reduce inflammation and ease cramps.</li>
<li><strong>Cinnamon Milk:</strong> Add a pinch of cinnamon powder to warm milk for natural pain relief and improved blood circulation.</li>
<li><strong>Coconut Water:</strong> Helps reduce bloating and replenishes lost electrolytes.</li>
<li><strong>Banana & Yogurt:</strong> Rich in potassium and calcium, these help relax muscles and prevent cramping.</li>
<li><strong>Clove Tea:</strong> Boil 2-3 cloves in water and sip warm to ease pain and reduce period flow.</li>
<li><strong>Rice Sock Heating Pad:</strong> Fill a sock with rice, microwave for 1-2 minutes, and place it on your lower abdomen to relax muscles.</li>
<li><strong>Apple Cider Vinegar & Honey:</strong> Mix 1 tsp of apple cider vinegar with warm water and honey to balance hormones and reduce bloating.</li>
<li><strong>Papaya Smoothie:</strong> Papaya contains an enzyme called papain, which helps regulate menstrual flow and reduces cramps.</li>
<li><strong>Tulsi (Basil) Tea:</strong> Basil leaves have anti-inflammatory properties that help reduce period pain.</li>
<li><strong>Aloe Vera & Honey Drink:</strong> Soothes the stomach and relieves discomfort during periods.</li>
<li><strong>Blackstrap Molasses:</strong> A natural source of iron and magnesium that helps relax uterine muscles. Add to warm water or milk.</li>
<li><strong>Mustard Foot Soak:</strong> Add mustard powder to warm water and soak your feet for 15 minutes to improve blood circulation and ease cramps.</li>
<li><strong>Fennel Seed Water:</strong> Soak fennel seeds overnight, strain, and drink the water to reduce bloating and relax muscles.</li>
<li><strong>Asafoetida (Hing) & Warm Water:</strong> Mix a pinch of hing in warm water to improve digestion and reduce cramps.</li>
<li><strong>Ajwain (Carom Seeds) Tea:</strong> Boil ajwain seeds in water and sip warm for relief from cramps and indigestion.</li>


            </ul>
          </div>
        </div>

        {/* Full-Width YouTube Video Section */}
        <div className="w-full">
          <h3 className="text-lg font-semibold text-pink-600 mb-4">Watch These for Quick Relief</h3>
          <div className="space-y-4">
            <iframe
              className="w-full h-40 md:h-48 lg:h-56 rounded-lg shadow-md"
              src="https://www.youtube.com/embed/LIsYbDCMfDc"
              title="Top 3 Ways to Get Immediate Relief from Period Cramps"
              allowFullScreen
            ></iframe>

            <iframe
              className="w-full h-40 md:h-48 lg:h-56 rounded-lg shadow-md"
              src="https://www.youtube.com/embed/l74eDdx2r1w"
              title="Immediate and Quickest Ways to Relieve Menstrual Pain"
              allowFullScreen
            ></iframe>

            <iframe
              className="w-full h-40 md:h-48 lg:h-56 rounded-lg shadow-md"
              src="https://www.youtube.com/embed/erTYsPyNIcdQ"
              title="Natural Drinks for Period Pain"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
<br></br>
      <section 
        className="bg-white py-8 px-4 rounded-2xl shadow-md mb-6 relative bg-cover bg-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Video Section on the Left */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-600 mb-4">Exercises for Period Pain Relief</h3>
            <iframe
              className="w-full h-40 md:h-48 lg:h-56 rounded-lg shadow-md"
              src="https://www.youtube.com/embed/HL8j0Z1kIxY"
              title="Exercise 1 for Period Pain Relief"
              allowFullScreen
            ></iframe>
            <iframe
              className="w-full h-40 md:h-48 lg:h-56 rounded-lg shadow-md"
              src="https://www.youtube.com/embed/0bq9f5A62C8"
              title="Exercise 2 for Period Pain Relief"
              allowFullScreen
            ></iframe>
            <iframe
              className="w-full h-40 md:h-48 lg:h-56 rounded-lg shadow-md"
              src="https://www.youtube.com/embed/VaVIvmQx_Xw"
              title="Exercise 3 for Period Pain Relief"
              allowFullScreen
            ></iframe>
          </div>
          <div className="flex justify-center">
            <img 
              src="/images/exercise.jpeg" 
              alt="Exercise for Period Relief" 
              className="w-80 md:w-96 rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>
    </section>


            {/* Diet Tips Section */}
            <section className="container mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Best & Worst Foods for Periods</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Best Foods & Drinks */}
        <div className="bg-green-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-green-700 mb-4">✅ Best Foods & Drinks</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li><b>Water & Hydrating Fruits</b> (watermelon, cucumber) – Prevent bloating & headaches.</li>
            <li><b>Leafy Greens</b> (spinach, kale) – Boost iron levels & reduce fatigue.</li>
            <li><b>Ginger & Turmeric</b> – Help with cramps, nausea & inflammation.</li>
            <li><b>Protein-Rich Foods</b> (chicken, fish, lentils, beans, tofu) – Keep you strong & energized.</li>
            <li><b>Dark Chocolate & Nuts</b> – Reduce mood swings & cravings.</li>
            <li><b>Yogurt & Kombucha</b> – Support gut health & prevent infections.</li>
            <li><b>Peppermint Tea</b> – Relieves cramps & digestion issues.</li>
            <li><b>Chia Seeds & Flaxseeds</b> – Reduce inflammation & bloating.</li>
<li><b>Bananas & Oranges</b> – Help with cramps & mood swings.</li>
<li><b>Pumpkin Seeds & Sunflower Seeds</b> – Relax muscles & ease PMS symptoms.</li>
          </ul>
        </div>

        {/* Foods to Avoid */}
        <div className="bg-red-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-red-700 mb-4">❌ Foods to Avoid</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li><b>Salty & Sugary Foods</b> – Cause bloating & mood swings.</li>
            <li><b>Caffeine</b> (Coffee, Tea, Soda) – Triggers headaches & dehydration.</li>
            <li><b>Alcohol</b> – Worsens cramps & digestion issues.</li>
            <li><b>Spicy Foods</b> – May cause stomach pain & nausea.</li>
            <li><b>Red Meat</b> – Can increase cramps.</li>
          </ul>
          
          <iframe
  className="w-full h-48 md:h-56 lg:h-64 rounded-lg shadow-md"
  src="https://www.youtube.com/embed/E-8gvJlkY8c"
  title="YouTube Video"
  allowFullScreen
></iframe>

        </div>
      </div>
     
    </section>



      {/* Recommended YouTube Channels */}
      <section className="bg-purple-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Recommended YouTube Channels</h2>

        {/* Dr. Manthena Satyanarayana Raju Official */}
<div className="bg-white p-6 rounded-lg shadow-sm mb-4">
  <h3 className="text-2xl font-semibold text-purple-700 mb-4">
    Dr. Manthena Satyanarayana Raju Official
  </h3>

  <div className="flex flex-col md:flex-row items-center gap-6">
    {/* Text Content */}
    <div className="w-full md:w-1/2">
      <a 
        href="https://youtube.com/@dr.manthenaofficial3931" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-lg font-semibold"
      >
        🔗 Watch on YouTube
      </a>
      <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
        <li><strong>Natural Diet Plans:</strong> Raw foods, fasting, and plant-based diets.</li>
        <li><strong>Detoxification Methods:</strong> Natural cleansing techniques.</li>
        <li><strong>Weight Loss & Fitness:</strong> Naturopathic approaches.</li>
        <li><strong>Disease Prevention:</strong> Solutions for diabetes, hypertension, digestion.</li>
        <li><strong>Ayurvedic Healing:</strong> Drug-free, chemical-free natural healing.</li>
      </ul>
    </div>

    {/* Image Section */}
    <div className="w-full md:w-1/4 order-1 md:order-2">
      <img 
        src="/images/Manthena.jpeg" 
        alt="Dr. Manthena Satyanarayana Raju" 
        className="w-full h-auto rounded-lg shadow-md object-cover"
      />
       <p className="mt-2 text-gray-700 font-medium text-sm">Dr. Manthena Satyanarayana Raju</p>            
              <p className="mt-1 text-gray-500 text-xs">Prominent Naturopathy Advocate & Nature Cure Hospital Founder</p>

    </div>
  </div>
</div>


        {/* The Yoga Institute */}
<div className="bg-white p-6 rounded-lg shadow-sm mb-4">
  <h3 className="text-2xl font-semibold text-purple-700 mb-4">
    The Yoga Institute
  </h3>

  <div className="flex flex-col md:flex-row items-center gap-6">
    {/* Text Content (Left Side) */}
    <div className="w-full md:w-1/2 order-2 md:order-1">
      <a 
        href="https://youtube.com/@theyogainstituteofficial" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-lg font-semibold"
      >
        🔗 Watch on YouTube
      </a>
      <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
        <li><strong>Traditional Yoga:</strong> Beginner to advanced yoga techniques.</li>
        <li><strong>Yoga for Health:</strong> Special yoga routines for stress, PCOS, back pain, etc.</li>
        <li><strong>Pranayama & Meditation:</strong> Breathing techniques for relaxation.</li>
        <li><strong>Holistic Wellness:</strong> Diet, self-care, and emotional well-being.</li>
        <li><strong>Yoga Philosophy:</strong> Understanding yoga beyond just physical exercise.</li>
      </ul>
    </div>

    {/* Image (Right Side) */}
    <div className="w-full md:w-1/4 order-1 md:order-2">
      <img 
        src="/images/dr.jpg" 
        alt="The Yoga Institute" 
        className="w-full h-auto rounded-lg shadow-md object-cover"
      />
       <p className="mt-2 text-gray-700 font-medium text-sm">Dr. Hansaji J. Yogendra</p>            
              <p className="mt-1 text-gray-500 text-xs">Director of The Yoga Institute</p>
    </div>
  </div>
</div>

      </section>

      {/* How These Channels Help */}
      <section className="bg-purple-200 p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">How These Channels Help with Period Pain Relief?</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>🔥 <strong>Dr. Manthena’s Channel:</strong> Natural diet tips, herbal remedies, and detox techniques to reduce cramps.</li>
          <li>🧘 <strong>The Yoga Institute:</strong> Yoga asanas and breathing exercises for back pain, cramps, and stress relief.</li>
        </ul>
      </section>
    </div>
  );
};
    
export default NaturalRemedies;

