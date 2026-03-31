import React from 'react';

const AyurvedaMentalHealth = () => {
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
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-purple-700 mb-6">Ayurveda and Mental Health: A Holistic Approach</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-100 p-6 rounded-lg flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-4"> Overview of Ayurveda as a Holistic System</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Ayurveda, often considered the "science of life," is an ancient holistic healing system that originated in India thousands of years ago. It emphasizes the balance of mind, body, and spirit to achieve overall health and well-being.
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Ayurvedic psychology recognizes the interdependence of mental and physical health, acknowledging that imbalances in one aspect can affect the other. The system recognizes the role of diet, lifestyle, stress management, and spiritual practices in maintaining mental equilibrium.
                </p>
              </div>
              <img 
                src="/images/clock1.jpg" 
                alt="Ayurveda Holistic Healing" 
                className="mt-4 rounded-lg shadow-md"
              />
            </div>
            <div className="bg-purple-100 p-6 rounded-lg flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-4">Concept of Mind-Body Connection in Ayurveda and Mental Health</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Ayurveda perceives the mind and body as interconnected entities, where the state of one profoundly influences the other. The mind, according to Ayurvedic psychology, is not confined to the brain but extends throughout the entire body, with thoughts and emotions intricately connected to our physical being.
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  The mind-body connection is emphasized through practices such as meditation, yoga, and pranayama (breath control), which aim to synchronize the mind and body.
                </p>
              </div>
              <img 
                src="/images/chakra.jpg" 
                alt="Mind-Body Connection" 
                className="mt-4 rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-purple-700 mb-6 text-center">Ayurveda and Mental Health: A Deeper Dive</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          
          {/* Three Doshas and Mental Health */}
         {/* Three Doshas and Mental Health */}
<div className="bg-purple-100 p-6 rounded-lg mb-6">
  <h3 className="text-xl font-semibold mb-4">1. Three Doshas and Mental Health</h3>
  <p className="list-disc list-inside mt-2 text-gray-700">
    Ayurveda categorizes individuals based on three biological energies or "Doshas":
  </p>
  <ul className="list-disc list-inside mt-2 text-gray-700">
    <li>
      <strong>Vata (Air & Space)</strong> – Vata is associated with movement and is responsible for bodily functions involving motion, such as breathing, circulation, and communication. An imbalance in Vata can lead to anxiety, restlessness, and difficulty focusing.
    </li>
    <li>
      <strong>Pitta (Fire & Water)</strong> – Pitta governs transformation and is linked to digestion, metabolism, and mental sharpness. Imbalances in Pitta may manifest as irritability, anger, and competitiveness.
    </li>
    <li>
      <strong>Kapha (Earth & Water)</strong> – Kapha is associated with stability and structure, influencing aspects like strength, immunity, and emotional well-being. An excess of Kapha may lead to lethargy, depression, and a sense of heaviness.
    </li>
  </ul>
  <p className="list-disc list-inside mt-2 text-gray-700">
    A balanced mind and body occur when these Doshas are in harmony, while imbalances can lead to various mental health issues.
  </p>

  {/* Image and Video (Iframe) Side by Side */}
<div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
  {/* Image on the Left */}
  <img 
    src="/images/doshas.jpg" 
    alt="Three Doshas" 
    className="rounded-lg shadow-md w-full md:w-1/2"
  />

  {/* Video Section */}
  <div className="flex flex-col w-full md:w-1/2">
    {/* Video Title */}
    <h3 className="text-lg font-semibold text-gray-700 mb-2">
      Know your Body Type - According to Ayurveda
    </h3>

    {/* Video Embed */}
    <iframe 
      className="rounded-lg shadow-md w-full h-56 md:h-64"
      src="https://www.youtube.com/embed/WfN1ZLNzP4A" 
      title="Doshas Explained"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
</div>
</div>


          {/* Ayurvedic Therapies for Mental Well-Being */}
<div className="bg-purple-100 p-6 rounded-lg mb-6">
  <h3 className="text-xl font-semibold mb-4">2. Ayurvedic Therapies for Mental Well-Being</h3>
  <p className="text-gray-700">
    Ayurveda uses natural therapies to restore balance and mental peace:
  </p>
  <ul className="list-disc list-inside mt-2 text-gray-700">
    <li>
      <strong>Herbal Remedies:</strong> Herbs like Brahmi (for cognitive function), Ashwagandha (stress relief), and Shankhpushpi (calmness) support mental health.
    </li>
    <li>
      <strong>Dietary Adjustments:</strong> A personalized diet based on one’s Dosha helps maintain emotional balance. Foods rich in Satva (pure, calming qualities) such as fresh fruits, nuts, and dairy are recommended.
    </li>
    <li>
      <strong>Abhyanga (Oil Massage):</strong> Regular full-body massages with herbal oils help relieve stress and anxiety.
    </li>
    <li>
      <strong>Panchakarma Detox:</strong> A deep cleansing therapy that removes toxins, rejuvenates the nervous system, and balances mental health.
    </li>
  </ul>

  {/* Responsive Video and Image Section */}
  <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
    {/* Left - Two Videos Stacked */}
    <div className="w-full md:w-1/2 flex flex-col gap-4">
      <iframe 
        className="rounded-lg shadow-md w-full h-56 md:h-64"
        src="https://www.youtube.com/embed/_sZkqnW71Jg" 
        title="Ayurvedic Therapy Video 1"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <iframe 
        className="rounded-lg shadow-md w-full h-56 md:h-64"
        src="https://www.youtube.com/embed/8RTJCFTwuYc" 
        title="Ayurvedic Therapy Video 2"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>

    {/* Right - Image */}
    <div className="w-full md:w-1/2 flex justify-center">
      <img 
        src="/images/10.jpg" 
        alt="Ayurvedic Therapies" 
        className="rounded-lg shadow-md w-full md:w-4/5"
      />
    </div>
  </div>
</div>


         {/* Meditation, Yoga, and Pranayama */}
<div className="bg-purple-100 p-6 rounded-lg mb-6">
  <h3 className="text-xl font-semibold mb-4">3. The Role of Meditation, Yoga, and Pranayama</h3>
  <p className="text-gray-700">
    These practices play a crucial role in Ayurveda for mental well-being:
  </p>
  <ul className="list-disc list-inside mt-2 text-gray-700">
    <li>
      <strong>Meditation:</strong> Calms the mind, improves focus, and reduces anxiety.
    </li>
    <li>
      <strong>Yoga:</strong> Asanas (postures) such as Balasana (Child’s Pose) and Shavasana (Corpse Pose) help relieve stress.
    </li>
    <li>
      <strong>Pranayama (Breathing Techniques):</strong> Techniques like Anulom Vilom (Alternate Nostril Breathing) and Bhramari (Bee Breath) are powerful tools to calm the nervous system and improve emotional stability.
    </li>
  </ul>

  {/* Responsive Image and Video Section */}
  <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
    {/* Left - Image */}
    <div className="w-full md:w-1/2 flex justify-center">
      <img 
        src="/images/asana.jpg" 
        alt="Yoga and Meditation" 
        className="rounded-lg shadow-md w-full md:w-4/5"
      />
    </div>

    {/* Right - Two Videos Stacked */}
    <div className="w-full md:w-1/2 flex flex-col gap-4">
      <iframe 
        className="rounded-lg shadow-md w-full h-56 md:h-64"
        src="https://www.youtube.com/embed/blbv5UTBCGg" 
        title="Yoga and Meditation Video 1"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <iframe 
        className="rounded-lg shadow-md w-full h-56 md:h-64"
        src="https://www.youtube.com/embed/YFLGvOl479Y" 
        title="Yoga and Meditation Video 2"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <iframe 
        className="rounded-lg shadow-md w-full h-56 md:h-64"
        src="https://www.youtube.com/embed/0P6aK6cRFO0" 
        title="Yoga and Meditation Video 2"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  </div>
</div>

{/* Sleep & Stress Management */}
<div className="bg-purple-100 p-6 rounded-lg flex flex-col md:flex-row items-center gap-6">
  {/* Video on the Left */}
  <div className="md:w-1/2">
    <iframe 
      className="rounded-lg shadow-md w-full h-56 md:h-64"
      src="https://www.youtube.com/embed/5KZcE94tOyE" 
      title="Ayurvedic Sleep Practices"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>

  {/* Text Content on the Right */}
  <div className="md:w-1/2">
    <h3 className="text-xl font-semibold mb-4">4. Ayurvedic Approach to Sleep & Stress Management</h3>
    <p className="text-gray-700">Following Ayurveda’s natural guidelines can improve sleep and stress levels:</p>
    <ul className="list-disc list-inside mt-2 text-gray-700">
      <li><strong>Following Dinacharya (Daily Routine):</strong> Ayurveda emphasizes waking up early, eating meals at consistent times, and sleeping before 10 PM for optimal mental health.</li>
      <li><strong>Herbs for Sleep:</strong> Jatamansi and Brahmi tea help in overcoming insomnia and improving sleep quality.</li>
      <li><strong>Aromatherapy:</strong> Essential oils like sandalwood and lavender can promote relaxation.</li>
    </ul>
  </div>
</div>
 




        </div>
      </section>
      {/* Recommended YouTube Channels */}
 <section className="bg-purple-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Recommended YouTube Channel</h2>

        {/* Satvic Yoga */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h3 className="text-2xl font-semibold text-purple-700 mb-4">
          Satvic Yoga

          </h3>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Text Content */}
            <div className="w-full md:w-1/2">
              <a 
                href="https://www.youtube.com/@satvicyoga" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-lg font-semibold"
              >
                🔗 Watch on YouTube
              </a>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
                <li><strong>21-Day Yoga Camp:</strong> Beginner-friendly yoga practices.</li>
                <li><strong>Physical Health:</strong> Asanas for weight loss, strength, and energy.</li>
                <li><strong>Mental Wellness:</strong> Yoga for anxiety, depression, and stress.</li>
                <li><strong>Guided Kriyas:</strong> 15-minute sessions for clarity and joy.</li>
                <li><strong>Holistic Well-being:</strong> A blend of physical, mental, and spiritual health.</li>
              </ul>
            </div>

            {/* Image Section */}
            <div className="w-full md:w-1/4 order-1 md:order-2">
              <img 
                src="/images/satvikyoga.jpg" 
                alt="Satvic Yoga" 
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
               <p className="mt-2 text-gray-700 font-medium text-sm">Satvic Movement</p>            
              <p className="mt-1 text-gray-500 text-xs">Founded by Subah & Harshvardhan Saraf</p>
            </div>
          </div>
        </div>
</section>

    </div>
  );
};

export default AyurvedaMentalHealth;
