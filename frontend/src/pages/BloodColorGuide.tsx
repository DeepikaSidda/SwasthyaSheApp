import React from 'react';

const BloodColorGuide = () => {
  return (
    <div className="container mx-auto px-4 py-8"
    style={{
      backgroundImage: 'url("/images/home-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
    >
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Blood Color & Health Guide</h1>

      {/* Color Guide Section */}
      <section className="mb-12">
       
        <div className="mt-7 flex justify-center">
          <img 
            src="/images/bloodchart.jpg" 
            alt="Delhi Students' Eco-Friendly Pads" 

            
            className="w-full max-w-4xl h-auto rounded-lg shadow-md object-cover"
          />
        </div>
        <br></br>
        <h2 className="text-2xl font-semibold text-purple-700 mb-6">Understanding Period Blood Colors</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Normal Colors</h3>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded">
                <h4 className="font-medium mb-2">Bright Red</h4>
                <p className="text-gray-600">Fresh, normal menstrual blood. Typically seen at the beginning of your period. Indicates healthy blood flow.</p>
              </div>
              <div className="bg-red-900 text-white p-4">
                <h4 className="font-medium mb-2">Dark Red</h4>
                <p className="text-white-600">Normal color, especially during heavy flow days. Shows blood that has been in the uterus longer.</p>
              </div>
              <div className="bg-amber-900 text-white p-4">
                <h4 className="font-medium mb-2">Brown/Black</h4>
                <p className="text-white-600">Common at the end of your period. Old blood that took time to leave the uterus.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Colors to Monitor</h3>
            <div className="space-y-4">
              <div className="bg-pink-50 p-4 rounded">
                <h4 className="font-medium mb-2">Pink</h4>
                <p className="text-gray-600">Could indicate low estrogen levels or poor nutrition. If persistent, consult a doctor.</p>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <h4 className="font-medium mb-2">Orange</h4>
                <p className="text-gray-600">Might indicate infection. If accompanied by unusual odor, seek medical attention.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium mb-2">Gray</h4>
                <p className="text-gray-600">Could indicate infection or miscarriage. Consult healthcare provider immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12 flex flex-col lg:flex-row items-center gap-8">
  {/* Text Content */}
  <div className="lg:w-2/3">
    <h2 className="text-2xl font-semibold text-purple-700 mb-6">
      Period Blood Clots – Causes, Normalcy & When to Seek Help
    </h2>
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      {/* First Half */}
      <div className="space-y-4">
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-2">Are Period Blood Clots Normal?</h3>
          <p className="text-gray-600">
            Yes, passing small blood clots (pea-sized to quarter-sized) during menstruation, 
            especially in the first two days of heavy flow, is normal. Clots form as a natural 
            response to regulate bleeding.
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-2">Causes of Period Blood Clots</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Medical Conditions: Fibroids, endometriosis, adenomyosis, or uterine polyps.</li>
            <li>Hormonal Imbalances: Thyroid disorders can affect menstrual flow.</li>
            <li>Medications: NSAIDs and anticoagulants may influence clotting.</li>
            <li>Birth Control Methods: Non-hormonal IUDs can cause heavier bleeding.</li>
            <li>Blood Disorders: Conditions like Von Willebrand disease affect clotting.</li>
          </ul>
        </div>
      </div>
      {/* Second Half */}
      <div className="space-y-4">
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-2">When to Seek Medical Advice</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Clots larger than a quarter</li>
            <li>Frequent large clots or excessive bleeding (soaking through products hourly)</li>
            <li>Periods lasting longer than seven days</li>
            <li>Significant pain, bleeding between periods, or needing multiple pads at once</li>
            <li>Pregnancy-related bleeding requires immediate attention</li>
          </ul>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-2">Managing Heavy Periods at Home</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Use high-absorbency menstrual products</li>
            <li>Stay hydrated and eat iron-rich foods to prevent anaemia</li>
            <li>Monitor period patterns and discuss changes with a doctor</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  {/* Vertical Image */}
  <div className="lg:w-1/3">
    <img 
      src="/images/clotera.jpg" 
      alt="Menstrual Health Awareness" 
      className="w-full h-auto rounded-lg shadow-md"
    />
  </div>
</section>


<section className="mb-12">
  <h2 className="text-2xl font-semibold text-purple-700 mb-6">When to Call Your Healthcare Provider</h2>
  <div className="bg-white p-6 rounded-lg shadow-md">
  <div className="bg-purple-50 p-4 rounded">
    <p className="text-gray-600">Speak to your healthcare provider if you notice unusual period blood color or changes in your menstrual cycle. Potential concerns include:</p>
    <ul className="list-disc list-inside text-gray-600 mt-4">
      <li><strong>Missed periods</strong> (over three months without pregnancy).</li>
      <li><strong>Irregular periods</strong> (unusual cycle length, flow, or frequency).</li>
      <li><strong>Unexpected bleeding</strong> (spotting between periods).</li>
      <li><strong>Heavy bleeding</strong> (changing products more than once per hour).</li>
      <li><strong>Large clots</strong> (possible fibroids, polyps, hormonal issues, miscarriage, or ectopic pregnancy).</li>
      <li><strong>Severe period pain</strong> (beyond typical cramps).</li>
      <li><strong>Fever and illness after tampon use</strong> (could indicate toxic shock syndrome).</li>
    </ul>
  </div>
  </div>
</section>

<section className="mb-12">
  <h2 className="text-2xl font-semibold text-purple-700 mb-6">What is a Normal Period?</h2>
  <div className="bg-white p-6 rounded-lg shadow-md">
  <div className="bg-purple-50 p-4 rounded">
    <p className="text-gray-600">A normal period generally:</p>
    <ul className="list-disc list-inside text-gray-600 mt-4">
      <li>Occurs every <strong>21 to 35 days</strong>.</li>
      <li>Can vary up to <strong>20 days in a year</strong>.</li>
      <li>Lasts <strong>2 to 7 days</strong> (typically around 5 days).</li>
      <li>Involves <strong>20 ml to 90 ml of blood loss</strong>.</li>
    </ul>
    <p className="text-gray-600 mt-4">Monitor changes and seek medical advice if needed.</p>
  </div>
  </div>
</section>


    </div>
  );
};

export default BloodColorGuide;