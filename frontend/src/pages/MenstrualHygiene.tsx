import React from 'react';

const MenstrualHygiene = () => {
  return (
    <div className="container mx-auto px-4 py-8"
      style={{
        backgroundImage: 'url("/images/home-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Menstrual Hygiene Tips</h1>

      {/* Essential Period Care Tips Section */}
      <section className="mb-12">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-purple-700 mb-6">10 Essential Period Care Tips</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Choose the Right Menstrual Product",
              content: [
                "Pads – Easy to use, ideal for beginners, but can feel bulky.",
                "Tampons – Great for active people, but need regular changing to avoid infections.",
                "Menstrual Cups – Eco-friendly, cost-effective, and long-lasting with proper care.",
                "Period Panties – Comfortable and leak-proof, but best for light to moderate flows."
              ]
            },
            {
              title: "Change Regularly",
              content: [
                "Pads – Every 4-6 hours.",
                "Tampons – Every 4-8 hours (never over 8 hours).",
                "Menstrual Cups – Empty every 12 hours.",
                "Period Panties – Change when damp (usually every 8-12 hours)."
              ]
            },
            {
              title: "Maintain Good Hygiene",
              content: [
                "Wash gently – Use mild, fragrance-free cleansers.",
                "Wipe correctly – Always front to back.",
                "Use a clean towel – Keep your intimate area dry and bacteria-free."
              ]
            },
            {
              title: "Dispose Properly",
              content: [
                "Pads/Tampons – Wrap in toilet paper before discarding.",
                "Menstrual Cups – Rinse and sterilize as per guidelines.",
                "Period Panties – Rinse in cold water before washing."
              ]
            },
            { title: "Wear Comfortable Clothes", content: ["Opt for breathable cotton underwear and avoid tight clothing to reduce irritation."] },
            {
              title: "Stay Hydrated",
              content: [
                "Reducing cramps.",
                "Flushing out excess sodium.",
                "Preventing headaches."
              ]
            },
            { title: "Track Your Cycle", content: ["Knowing your period schedule helps you prepare and manage symptoms better."] },
            { title: "Exercise Regularly", content: ["Light activities release endorphins, boosting mood and reducing cramps."] },
            {
              title: "Eat a Balanced Diet",
              content: [
                "Iron-rich foods – Spinach, lentils (to replace lost iron).",
                "Omega-3 sources – Salmon, flaxseeds (to reduce cramps)."
              ]
            },
            {
              title: "Relieve Cramps Naturally",
              content: [
                "Use a heating pad on your abdomen.",
                "Drink warm herbal teas for relaxation.",
                "Massage gently to ease tension."
              ]
            }
          ].map((tip, index) => (
            <div key={index} className="bg-purple-50 p-4 rounded">
              <strong>{tip.title}</strong>
              <ul className="list-disc list-inside ml-4">
                {tip.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        </div>
      </section>
{/* Menstrual Product Care Section */}
<section className="mb-16"> {/* Increased margin */}
  <h2 className="text-2xl font-semibold text-purple-700 mb-4">Menstrual Product Care</h2>
  <div className="bg-white p-4 rounded-lg shadow-md"> {/* Reduced padding */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Increased gap */}
      
      {[        
        {
          title: "Disposable Products",
          content: [
            "Store in a clean, dry place.",
            "Check expiration dates.",
            "Never flush pads or tampons.",
            "Wrap used products properly before disposal."
          ],
          image: "/images/sanitary-pads.jpg"
        },
        {
          title: "Reusable Products",
          content: [
            "Boil menstrual cups between cycles.",
            "Wash reusable pads with hot water.",
            "Dry completely before storing.",
            "Replace as per manufacturer’s instructions."
          ],
          image: "/images/reuse.jpg"
        }
      ].map((care, index) => (
        <div key={index} className="rounded-lg shadow-md overflow-hidden bg-white">
          {/* Image Section */}
          <div 
            className="h-40 bg-cover bg-center"  /* Increased height */
            style={{ backgroundImage: `url(${care.image})` }}
          ></div>

          {/* Text Content */}
          <div className="p-6"> {/* Increased padding */}
            <h3 className="text-lg font-semibold mb-3">{care.title}</h3> {/* Adjusted heading spacing */}
            <ul className="list-disc list-inside text-gray-600 space-y-2"> {/* Increased space between items */}
              {care.content.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

    </div>
  </div>
</section>



<section className="mb-12">
  <h2 className="text-2xl font-semibold text-purple-700 mb-6">Menstrual Hygiene: Do’s & Don'ts</h2>
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Don'ts Section */}
      <div className="bg-purple-50 p-4 rounded">
        <h3 className="font-medium mb-2 text-red-600">Don't:</h3>
        <ul className="list-disc list-inside text-gray-600">
          {[
            "Using scented products – Can cause irritation.",
            "Delaying pain relief – Worsens cramps.",
            "Not tracking your cycle – Misses health signs.",
            "Using harsh soaps – Disrupts pH balance.",            
            "Overwashing intimate areas – Increases infection risk. ",
            "Leaving tampons too long – Risk of toxic shock syndrome. ",
            "Unhealthy cravings – Causes bloating and mood swings.  "
          ].map((mistake, index) => (
            <li key={index}>{mistake}</li>
          ))}
        </ul>
      </div>

      {/* Do's Section */}
      <div className="bg-green-50 p-4 rounded">
        <h3 className="font-medium mb-2 text-green-600">Do:</h3>
        <ul className="list-disc list-inside text-gray-600">
          {[
            "Maintain proper hygiene and change products regularly.",
            "Stay hydrated to reduce bloating and cramps.",
            "Eat iron-rich foods like spinach, nuts, and fruits.",
            "Engage in light exercise like yoga or walking.",
            "Use a heating pad to relieve cramps.",
            "Get enough rest to manage fatigue and mood swings.",
            "Track your menstrual cycle for health insights."
          ].map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>

  {/* Image Section */}
  <div className="mt-7 flex justify-center">
    <img 
      src="/images/mistakes.png" 
      alt="Menstrual Hygiene Awareness" 
      className="w-2/3 md:w-1/2 lg:w-1/2 h-auto rounded-lg shadow-md object-cover"
    />
  </div>
</section>


    </div>
  );
};

export default MenstrualHygiene;