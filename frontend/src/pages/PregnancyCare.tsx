import React from 'react';
import { Link } from 'react-router-dom';

const PregnancyCare = () => {
  return (
    <div 
      className="container mx-auto px-4 py-8"
      style={{ 
        backgroundImage: 'url("/images/home-bg.jpg")',
        backgroundBlendMode: 'multiply',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      

      <h1 className="text-3xl font-bold text-purple-800 mb-8">Pregnancy Care</h1>

      {/* Navigation Section */}
      <section className="mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/diet-plan" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">Healthy Diet During Pregnancy</h3>
              <p className="text-gray-800 text-sm mb-4">A healthy diet during pregnancy supports both mother and baby's well-being</p>
            </div>
          </Link>
          </div>
          </section>

      {/* Pregnancy Overview */}
      <div className="flex flex-col md:flex-row items-center justify-center p-6 gap-10">
        {/* Left Side - Text Content */}
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Pregnancy Overview</h2>
          <p className="text-gray-600 text-sm mb-4">Pregnancy lasts about 40 weeks, counted from the first day of the last period, even though conception happens around week 2. It is divided into three trimesters:</p>
          <ul className="text-gray-600 text-sm mb-4 list-disc pl-5">
            <li><strong>First Trimester (Weeks 1-12):</strong> Early development and high miscarriage risk</li>
            <li><strong>Second Trimester (Weeks 13-27):</strong> Baby grows stronger, morning sickness eases</li>
            <li><strong>Third Trimester (Weeks 28-40):</strong> Rapid growth, baby prepares for birth</li>
          </ul>

          <h3 className="text-lg font-bold text-purple-700 mt-4">First Trimester (Weeks 1-12)</h3>
          <p className="text-sm text-gray-600">Common Symptoms: Missed periods, nausea, tiredness, frequent urination</p>
          <ul className="text-gray-600 text-sm mb-4 list-disc pl-5">
            <li><strong>Week 1-2:</strong> Menstrual period and conception</li>
            <li><strong>Week 3-4:</strong> Fertilized egg implants in the uterus</li>
            <li><strong>Week 5-6:</strong> Baby’s heart starts beating</li>
            <li><strong>Week 7-8:</strong> Major organs begin forming</li>
            <li><strong>Week 9-12:</strong> Fetus starts moving, brain develops, fingers and toes form</li>
          </ul>

          <h3 className="text-lg font-bold text-purple-700 mt-4">Second Trimester (Weeks 13-27)</h3>
          <p className="text-sm text-gray-600">Changes: More energy, growing belly, baby movements felt</p>
          <ul className="text-gray-600 text-sm mb-4 list-disc pl-5">
            <li><strong>Week 13-16:</strong> Baby can move, cry silently, and suck thumb</li>
            <li><strong>Week 18-20:</strong> Ultrasound scan, hearing develops</li>
            <li><strong>Week 24:</strong> Eyes open, lungs start practicing breathing</li>
          </ul>

          <h3 className="text-lg font-bold text-purple-700 mt-4">Third Trimester (Weeks 28-40)</h3>
          <p className="text-sm text-gray-600">Changes: Fatigue, back pain, breathlessness, baby drops lower in the belly</p>
          <ul className="text-gray-600 text-sm mb-4 list-disc pl-5">
            <li><strong>Week 28:</strong> Baby weighs about 1 kg, body proportions even out</li>
            <li><strong>Week 32:</strong> Strong movements, baby mostly sleeps</li>
            <li><strong>Week 36:</strong> Baby moves into birth position</li>
            <li><strong>Week 40:</strong> Full term and ready for birth</li>
          </ul>
        </div>

        {/* Right Side - Image */}
        <div className="bg-purple-200 p-6 rounded-2xl shadow-lg w-full md:w-1/2 flex items-center justify-center">
          <img 
            src="/images/prechart1.jpg" 
            alt="Pregnancy Stages" 
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
      </div>

      <section className="bg-purple-100 p-6 rounded-2xl shadow-md">
  <h2 className="text-3xl font-bold text-purple-800 text-center mb-6">Prenatal Care & Doctor Visits</h2>
  <p className="text-gray-700 text-center text-sm mb-6">
    Prenatal care is essential for ensuring the health and well-being of both the mother and the baby throughout pregnancy. Regular checkups help monitor fetal development, detect potential complications early, and provide guidance on maintaining a healthy pregnancy.
  </p>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Importance of Regular Checkups */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-purple-700">Importance of Regular Checkups</h3>
      <p className="text-gray-600 text-sm mt-2">The frequency of prenatal visits varies depending on the stage of pregnancy:</p>
      <ul className="list-disc pl-6 text-gray-600 text-sm mt-2">
        <li><strong>First Trimester (Weeks 1–12):</strong> Every 4–6 weeks - Initial screenings and ultrasound.</li>
        <li><strong>Second Trimester (Weeks 13–27):</strong> Every 2–4 weeks - Growth monitoring and tests.</li>
        <li><strong>Third Trimester (Weeks 28–40):</strong> Every 1–2 weeks - Preparing for labor.</li>
      </ul>
      <p className="text-gray-600 text-sm mt-2">Regular checkups help in detecting potential health risks early, ensuring a smoother pregnancy journey.</p>
    </div>

    {/* Key Prenatal Tests */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-purple-700">Key Prenatal Tests</h3>
      <ul className="list-disc pl-6 text-gray-600 text-sm mt-2">
        <li><strong>Blood Tests:</strong> Check for infections, anemia, and genetic conditions.</li>
        <li><strong>Ultrasounds:</strong> Monitor fetal growth and detect abnormalities.</li>
        <li><strong>Glucose Screening:</strong> Detect gestational diabetes.</li>
        <li><strong>Non-Stress Test (NST):</strong> Monitors baby’s heart rate and movement.</li>
      </ul>
      <p className="text-gray-600 text-sm mt-2">These tests help in ensuring both mother and baby remain healthy throughout the pregnancy.</p>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
    {/* Common Pregnancy Complications */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-purple-700">Common Pregnancy Complications</h3>
      <ul className="list-disc pl-6 text-gray-600 text-sm mt-2">
        <li><strong>Gestational Diabetes:</strong> Blood sugar issues requiring diet control.</li>
        <li><strong>High Blood Pressure (Preeclampsia):</strong> Can lead to premature birth.</li>
        <li><strong>Anemia:</strong> Fatigue due to low red blood cell count.</li>
        <li><strong>Preterm Labor:</strong> Early contractions leading to premature birth.</li>
      </ul>
      <p className="text-gray-600 text-sm mt-2">Identifying and managing complications early improves pregnancy outcomes.</p>
    </div>

    {/* Choosing a Healthcare Provider */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-purple-700">Choosing a Healthcare Provider</h3>
      <ul className="list-disc pl-6 text-gray-600 text-sm mt-2">
        <li><strong>OB-GYN:</strong> Best for high-risk pregnancies and medical interventions.</li>
        <li><strong>Midwife:</strong> Ideal for natural birth and holistic care.</li>
        <li><strong>Family Doctor:</strong> Suitable for healthy pregnancies.</li>
        <li><strong>Doula:</strong> Provides emotional and physical support during pregnancy and birth.</li>
      </ul>
      <p className="text-gray-600 text-sm mt-2">Choosing the right provider ensures personalized and effective prenatal care.</p>
    </div>
  </div>
</section>
<br></br>
<section className="bg-purple-100 p-6 rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-purple-800 text-center mb-6">Pregnancy & Your Body: Animated Insights</h2>
      <p className="text-gray-700 text-center text-sm mb-6">
      Explore how pregnancy rearranges organs like the stomach, intestines, and lungs, creating space for the growing baby while supporting maternal health.
</p>

      {/* Videos Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Your Organs When You're Pregnant</h3>
          <iframe
            className="w-full rounded-md"
            height="200"
            src="https://www.youtube.com/embed/AvmA114ACXo"
            title="Your Organs When You're Pregnant"
            allowFullScreen
          ></iframe>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Your Organs During Pregnancy</h3>
          <iframe
            className="w-full rounded-md"
            height="200"
            src="https://www.youtube.com/embed/fDPHdTAaT4o"
            title="Your Organs During Pregnancy"
            allowFullScreen
          ></iframe>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Baby and Placenta</h3>
          <iframe
            className="w-full rounded-md"
            height="200"
            src="https://www.youtube.com/embed/bcGYgpmW7GQ"
            title="Baby and Placenta"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
    <br></br>
    <section className="mb-12 flex flex-col lg:flex-row items-start gap-10">
      {/* Left Section: Text Content */}
      <div className="lg:w-2/3">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">
          Exercises & Preparing for Delivery
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-8">
          
          {/* Exercises for Pregnancy */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Exercises for Pregnancy
            </h3>
            
            {/* Trimester-wise Exercises */}
            <div className="bg-purple-50 p-5 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Trimester-wise Exercises
              </h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>First Trimester:</strong> Walking, Cat-Cow Stretch, Deep Breathing</li>
                <li><strong>Second Trimester:</strong> Prenatal Yoga, Pelvic Tilts, Light Strength Training</li>
                <li><strong>Third Trimester:</strong> Squats, Butterfly Stretch, Pelvic Floor Exercises</li>
              </ul>
            </div>

            {/* Breathing Techniques */}
            <div className="bg-purple-50 p-5 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Breathing & Relaxation Techniques
              </h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Deep Breathing:</strong> Inhale deeply through the nose, exhale slowly</li>
                <li><strong>Alternate Nostril Breathing:</strong> Helps calm the nervous system</li>
                <li><strong>Labor Breathing:</strong> Short, controlled breaths to ease contractions</li>
              </ul>
            </div>
          </div>

          {/* Preparing for Delivery */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Preparing for Delivery
            </h3>

            {/* Diet & Nutrition */}
            <div className="bg-purple-50 p-5 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Diet & Nutrition
              </h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Increase ghee & omega-3 fatty acids for smooth labor</li>
                <li>Eat iron & calcium-rich foods to prevent deficiencies</li>
                <li>Drink herbal teas (Raspberry Leaf) to strengthen the uterus</li>
              </ul>
            </div>

            {/* Mental & Emotional Preparation */}
            <div className="bg-purple-50 p-5 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Mental & Emotional Preparation
              </h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Practice meditation to reduce anxiety</li>
                <li>Use affirmations & visualization for a smooth birth</li>
                <li>Learn pain management techniques like massage & hydrotherapy</li>
              </ul>
            </div>

            {/* Hospital Bag Essentials */}
            <div className="bg-purple-50 p-5 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Hospital Bag Essentials
              </h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Comfortable clothes, nursing bras, maternity pads</li>
                <li>Baby essentials (diapers, onesies, blankets)</li>
                <li>Important documents, ID, insurance</li>
              </ul>
            </div>

            {/* Understanding Labor Stages */}
            <div className="bg-purple-50 p-5 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Understanding Labor Stages
              </h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Early Labor:</strong> Mild contractions, slow dilation</li>
                <li><strong>Active Labor:</strong> Stronger contractions, faster dilation</li>
                <li><strong>Transition:</strong> Intense contractions before pushing</li>
                <li><strong>Delivery & Recovery:</strong> Baby arrives, placenta delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Images & Video */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        {/* Image 1: Pregnancy Exercises */}
        <img 
          src="/images/yoga.jpg" 
          alt="Pregnancy Exercises" 
          className="w-full h-auto rounded-lg shadow-lg transition-transform hover:scale-105"
        />
        
        {/* Image 2: Delivery Preparation */}
        <img 
          src="/images/Nyoga.jpg" 
          alt="Delivery Preparation" 
          className="w-full h-auto rounded-lg shadow-lg transition-transform hover:scale-105"
        />

        
      </div>
    </section>


    </div>
  );
};

export default PregnancyCare;
