import React from 'react';
import { Link } from 'react-router-dom';


const MentalWellness = () => {
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
     
     <h1 className="text-3xl font-bold text-purple-800 mb-8">Mental Wellness</h1>
       {/* Navigation Section */}
<section className="mb-12">
  <div className="grid md:grid-cols-3 gap-4">
    <Link to="/aryurvedic-mental-health" className="block">
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-purple-700 mb-1">Ayurveda’s View on Mental Health</h3>
        <p className="text-gray-800 text-sm mb-4">Discover natural ways to manage period symptoms</p>
      </div>
    </Link>
  </div>
</section>

<div className="w-full bg-cover bg-center p-8 rounded-lg shadow-lg" style={{ backgroundImage: "url('/images/wh.jpg')" }}>
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 bg-white bg-opacity-90 p-6 rounded-lg">
        {/* Left Side - Why Mental Health Matters */}
        <div className="md:w-1/2 text-left space-y-4">
          <h2 className="text-3xl font-bold text-purple-700">Why Women’s Mental Health Matters</h2>
          <p className="text-gray-600 text-sm mb-4">
            Women handle multiple responsibilities, often neglecting their own well-being. Mental health is crucial due to unique challenges like hormonal shifts, societal expectations, and stress.
          </p>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-3">
            <li><strong>Higher Risk of Mental Health Issues:</strong> Women are more prone to anxiety, depression, and postpartum stress, often avoiding help due to stigma.</li>
            <li><strong>Mind-Body Connection:</strong> Poor mental health increases the risk of chronic illnesses, making self-care essential.</li>
            <li><strong>Challenges in Adolescence:</strong> Young girls face body image issues, academic stress, and online harassment, highlighting the need for early support.</li>
            <li><strong>The Power of Support:</strong> Therapy, self-care, and community spaces foster resilience and healing.</li>
          </ul>
          <p className="text-purple-700 font-semibold">💜 Prioritizing mental health empowers women to lead happier, healthier lives!</p>
        </div>
      
        {/* Right Side - Why Mental Wellness is Declining */}
        <div className="md:w-1/2 text-left space-y-4">
          <h2 className="text-3xl font-bold text-purple-700">Why Women’s Mental Wellness Is Declining</h2>
          <p className="text-gray-600 text-sm mb-4">
            Women juggle multiple responsibilities, often at the cost of their own well-being. Mental health is crucial due to challenges like hormonal shifts, societal expectations, and stress.
          </p>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-3">
            <li><strong>Societal Pressure:</strong> Juggling multiple roles leads to burnout.</li>
            <li><strong>Hormonal Changes:</strong> Menstrual cycles, pregnancy, and menopause impact mental health.</li>
            <li><strong>Higher Mental Health Risks:</strong> Women face more anxiety, depression, and postpartum stress.</li>
            <li><strong>Workplace & Financial Stress:</strong> Gender discrimination and pay gaps add pressure.</li>
            <li><strong>Trauma & Abuse:</strong> Higher rates of violence and harassment affect well-being.</li>
            <li><strong>Social Media Impact:</strong> Unrealistic beauty standards harm self-esteem.</li>
            <li><strong>Lack of Support:</strong> Stigma prevents many from seeking help.</li>
          </ul>
          <p className="text-purple-700 font-semibold mt-4">💜 Prioritizing self-care, therapy, and community support can empower women to lead healthier lives.</p>
        </div>
      </div>
    </div>

<br></br>

      <div className="bg-purple-50 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        {/* Left Side - Image */}
        <div className="md:w-1/3">
          <img
            src="/images/buddhism.jpg" // Replace with your actual image path
            alt="Buddhism and Mental Health"
            className="rounded-lg shadow-md w-full object-cover"
          />
        </div>

        {/* Right Side - Description */}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">Buddhism and Mental Health</h2>
          <p className="text-gray-600 text-sm mb-4">
            Buddhism was founded between the 5th and 6th centuries by Siddhartha Gautam, known as Lord Buddha.
            It is the world's fourth-largest religion, with around 520 million followers. Buddhism promotes peace,
            moral values, truthfulness, and meditation, helping people become kind and enlightened.
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Often called the "science of the mind," Buddhism focuses on inner peace and mental well-being.
            It teaches control over greed, anger, and desires, leading to a calm and peaceful life.
            Lord Buddha's sermons explained the causes of suffering and ways to overcome them.
            He emphasized the importance of right thoughts, actions, and mindfulness.
          </p>
          <p className="text-gray-600 text-sm mb-4">
            The Karma theory in Buddhism states that good actions bring good results, while bad actions lead to
            negative consequences, both in this life and future ones. Buddhism is not just a religion—it is a way
            to find happiness. Practicing its teachings improves mental health and brings joy to life.
          </p>

          {/* How Buddhism Benefits Mental Health */}
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">How Buddhism Benefits Mental Health</h2>
          <ul className="list-disc list-inside text-gray-600 text-sm  space-y-3">
            <li>
              <strong>Finding Inner Peace:</strong> Meditation helps reduce stress, anxiety, and depression. 
              Practices like deep breathing, yoga, and chanting train the mind to let go of negative thoughts. 
              Achieving nirvana means reaching a state of deep peace and happiness.
            </li>
            <li>
              <strong>Building Connections:</strong> Buddhism teaches kindness, compassion, and equality. 
              It fosters a sense of belonging—like being a wave in the ocean rather than an isolated individual.
            </li>
            <li>
              <strong>Taking Control of Life:</strong> Karma is about personal responsibility, not just cause and effect. 
              People can change their circumstances and shape their future through their actions. 
              Hope is a choice in Buddhism.
            </li>
          </ul>
        </div>
      </div><br></br>
       {/* Two Halves Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side - Two Boxes */}
        <div className="space-y-6">
          {/* Box 1 - Common Questions */}
          <div className="bg-purple-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">Common Questions About Buddhism</h2>
            <ul className="list-disc list-inside text-gray-800 text-sm mb-4 space-y-2">
              <li>What is the main goal of Buddhism?</li>
              <li>Does Buddhism believe in God?</li>
              <li>How does karma work in daily life?</li>
              <li>Is Buddhism a religion or a philosophy?</li>
              <li>What are the Four Noble Truths?</li>
            </ul>
            <p className="text-gray-800 text-sm mb-4">
              To explore the answers, check out our detailed blog:
              <a
                href="https://medium.com/@a_furst/10-questions-buddhists-get-bc5154a21ce9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 font-semibold hover:underline ml-2"
              >
                Read the Blog
              </a>
            </p>
          </div>

          {/* Box 2 - YouTube Videos */}
          <div className="bg-purple-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">Listen Here</h2>
            <div className="space-y-4">
              <iframe
                className="w-full rounded-lg"
                height="200"
                src="https://www.youtube.com/embed/_-_ldmJJ6zk"
                title="Buddhism Video 1"
                allowFullScreen
              ></iframe>
              <iframe
                className="w-full rounded-lg"
                height="200"
                src="https://www.youtube.com/embed/wOGqlVqyvCM"
                title="Buddhism Video 2"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* Right Side - Benefits of Buddhism */}
        <div
          className="p-8 rounded-lg shadow-lg text-white flex items-center"
          style={{
            backgroundImage: 'url("/images/buddism.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
              backgroundColor: 'rgba(255, 255, 255, 0.6)'
          }}
        >
          <div className="bg-black bg-opacity-50 p-6 rounded-lg w-full">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">Why Buddhism ?</h2>
            <ul className="list-disc list-inside text-lg space-y-4">
              <li>
                <span className="font-semibold">Positive Thinking & Hope:</span> Buddhism encourages a hopeful mindset,
                reducing negativity and attracting positive energy. It teaches that change is natural, and everything is
                temporary.
              </li>
              <li>
                <span className="font-semibold">Meditation for Mental Peace:</span> Regular meditation helps reduce
                stress, anxiety, and negativity. It nurtures inner peace and spiritual well-being.
              </li>
              <li>
                <span className="font-semibold">Compassion & Kindness:</span> Helping others brings happiness and inner
                strength. Practicing compassion and sharing keeps the mind calm and satisfied.
              </li>
              <li>
                <span className="font-semibold">Self-Reliance & Detachment:</span> True happiness comes from within, not
                external factors. Accepting life’s changes—loss, death, and impermanence—builds mental resilience.
              </li>
              <li>
                <span className="font-semibold">Inner Peace & Emotional Control:</span> Buddhism fosters patience,
                reduces ego and anger, and brings clarity. Living in the present leads to long-term happiness and
                well-being.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>





      <h1 className="text-3xl font-bold text-purple-800 mb-8 text-center">Stress & Anxiety Management</h1>

     <div className="flex flex-col items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Left Section - Text Content */}
        <div className="bg-purple-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">10 Stress Busters</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Be Active:</strong> Exercise reduces stress and clears your thoughts.</li>
            <li><strong>Take Control:</strong> Identify problems and take small steps toward solutions.</li>
            <li><strong>Connect with People:</strong> Build a support network of friends, family, or colleagues.</li>
            <li><strong>Have "Me Time":</strong> Dedicate time for activities you enjoy.</li>
            <li><strong>Challenge Yourself:</strong> Set small, achievable goals.</li>
            <li><strong>Avoid Unhealthy Habits:</strong> Reduce reliance on caffeine, alcohol, and smoking.</li>
            <li><strong>Help Others:</strong> Volunteering and acts of kindness increase happiness.</li>
            <li><strong>Work Smarter, Not Harder:</strong> Prioritize tasks and avoid overloading yourself.</li>
            <li><strong>Try to Be Positive:</strong> Practice gratitude by writing down three things daily.</li>
            <li><strong>Practice Relaxation Techniques:</strong> Try deep breathing, meditation, or progressive muscle relaxation.</li>
          </ul>
        </div>

        {/* Right Section - Image & Videos */}
        <div className="p-4 flex flex-col items-center">
          <img
            src="/images/sm.jpg" 
            alt="Stress & Anxiety Management"
            className="w-full rounded-lg shadow-lg"
          />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <iframe
              className="w-full h-48 rounded-lg"
              src="https://www.youtube.com/embed/YoSuVws4OTQ"
              title="Stress Management Video 1"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <iframe
              className="w-full h-48 rounded-lg"
              src="https://www.youtube.com/embed/lHVYgnlukTw"
              title="Stress Management Video 2"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>


    

    <section className="relative flex flex-col md:flex-row items-center justify-between p-6 bg-purple-100 rounded-lg shadow-lg mt-12">
  {/* Heading Outside the Box */}
  <h2 className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 text-3xl font-bold text-purple-900 bg-purple-200 px-6 py-2 rounded-lg shadow-md">
    Importance of Sleep in Mental Health
  </h2>
  

  {/* Left Half - Text Content */}
  <div className="md:w-1/2 p-4">
  
    <p className="text-black-800 mb-4">
      Sleep plays a crucial role in maintaining good mental health. Poor
      sleep can lead to increased stress, anxiety, and even depression. It
      affects mood, decision-making, and cognitive function.
    </p>

    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-purple-900 mb-2">
        Why People Struggle to Sleep
      </h3>
      <ul className="list-disc list-inside text-black-800 mb-4">
        <li>Excessive Screen Time – Affects melatonin levels.</li>
        <li>Stress & Anxiety – Keeps the brain alert.</li>
        <li>Irregular Sleep Schedules – Confuses the body’s clock.</li>
        <li>Caffeine & Heavy Meals – Disrupts natural sleep patterns.</li>
        <li>Lack of Physical Activity – Leads to restlessness.</li>
        <li>Uncomfortable Sleep Environment – Noise and temperature issues.</li>
        <li>Overthinking – Worrying excessively delays sleep.</li>
        <li>Poor Diet – Lack of essential nutrients can cause sleep disturbances.</li>
        <li>Excessive Napping – Long daytime naps can interfere with nighttime sleep.</li>
        <li>Medical Conditions – Issues like insomnia, sleep apnea, or chronic pain.</li>
      </ul>

      <h3 className="text-xl font-semibold text-purple-900 mb-2">
        Tips for Better Sleep
      </h3>
      <ul className="list-disc list-inside text-black-800">
        <li>Follow a consistent sleep routine.</li>
        <li>Limit screen time before bed.</li>
        <li>Practice relaxation techniques.</li>
        <li>Create a sleep-friendly environment.</li>
        <li>Avoid stimulants at night.</li>
        <li>Stay physically active.</li>
        <li>Use the bed for sleep only.</li>
        <li>Reduce long naps during the day.</li>
        <li>Try deep breathing or meditation before bed.</li>
        <li>Keep a sleep journal to track habits and patterns.</li>
        <li>Use aromatherapy with lavender or chamomile scents.</li>
        <li>Maintain a comfortable mattress and pillow.</li>
        <li>Set a relaxing bedtime routine, like reading or listening to calm music.</li>
        <li>Avoid looking at the clock to reduce sleep anxiety.</li>
        <li>Expose yourself to natural sunlight in the morning to regulate your circadian rhythm.</li>
        <li>Limit liquid intake before bed to avoid waking up frequently.</li>
        <li>Use white noise machines or calming sounds to block distractions.</li>
      </ul>
    </div>
  </div>

  {/* Right Half - Image, Chart & Videos */}
  <div className="md:w-1/2 p-4 flex flex-col items-center">
    <img
      src="/images/sleep.jpg"
      alt="Sleep and Mental Health"
      className="rounded-lg mb-4"
    />

    {/* Embedded Videos */}
    <div className="w-full">
      <iframe
        className="w-full h-48 mb-4 rounded-lg"
        src="https://www.youtube.com/embed/qYsq8AGnW3Y"
        title="Video on Sleep & Mental Health"
        allowFullScreen
      ></iframe>
      <iframe
        className="w-full h-48 rounded-lg"
        src="https://www.youtube.com/embed/bsBNlnX6ugw"
        title="Tips for Better Sleep"
        allowFullScreen
      ></iframe>
    </div>
  </div>
</section>

<br></br>

            {/* Recommended YouTube Channels */}
            <section className="bg-purple-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Recommended YouTube Channels</h2>

        {/* Buddhism in English */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h3 className="text-2xl font-semibold text-purple-700 mb-4">
            Buddhism in English
          </h3>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Text Content */}
            <div className="w-full md:w-1/2">
              <a 
                href="https://youtube.com/@buddhisminenglish?si=Ll-gX6W6vnN6n6NJ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-lg font-semibold"
              >
                🔗 Watch on YouTube
              </a>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
                <li><strong>Buddhist Teachings:</strong> Deep insights into Buddhism.</li>
                <li><strong>Meditation Techniques:</strong> Learn mindfulness and meditation.</li>
                <li><strong>Spiritual Growth:</strong> Understanding Buddhist philosophy.</li>
                <li><strong>Karma & Dharma:</strong> Teachings on moral and ethical living.</li>
                <li><strong>Guided Talks:</strong> Discussions on Buddhist principles.</li>
              </ul>
            </div>

            {/* Image Section */}
            <div className="w-full md:w-1/4 order-1 md:order-2">
              <img 
                src="/images/monk.jpg" 
                alt="Buddhism in English" 
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
               <p className="mt-2 text-gray-700 font-medium text-sm">Ven. Pothuhera Mahindasiri Thero</p>            
              <p className="mt-1 text-gray-500 text-xs">Sri Lankan monk from the Mahamevnawa Monastery</p>

            </div>
          </div>
        </div>


        

        {/* Sadhguru Official */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h3 className="text-2xl font-semibold text-purple-700 mb-4">
            Sadhguru Official
          </h3>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Text Content (Left Side) */}
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <a 
                href="https://youtube.com/@sadhguru?si=eOxn0R6X0OYvyV8k" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-lg font-semibold"
              >
                🔗 Watch on YouTube
              </a>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
                <li><strong>Spiritual Wisdom:</strong> Teachings on life, happiness, and inner engineering.</li>
                <li><strong>Meditation & Yoga:</strong> Guided practices for well-being.</li>
                <li><strong>Self-Realization:</strong> Understanding consciousness and awareness.</li>
                <li><strong>Health & Lifestyle:</strong> Diet, detox, and mental clarity tips.</li>
                <li><strong>Mindfulness:</strong> Techniques for reducing stress and improving focus.</li>
              </ul>
            </div>

            {/* Image (Right Side) */}
            <div className="w-full md:w-1/4 order-1 md:order-2">
              <img 
                src="/images/sadguru.jpg" 
                alt="Sadhguru Official" 
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
              
              <p className="mt-2 text-gray-700 font-medium text-sm">Jagadish Vasudev</p>            
              <p className="mt-1 text-gray-500 text-xs">Founder of the Isha Foundation</p>

            </div>
          </div>
        </div>
      </section>

      {/* How These Channels Help */}
      <section className="bg-purple-200 p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">How These Channels Help with Mental Wellness?</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>🧘 <strong>Buddhism in English:</strong> Teachings on inner peace, mindfulness, and self-awareness.</li>
          <li>🌿 <strong>Sadhguru Official:</strong> Yoga, meditation, and wisdom for mental clarity and stress relief.</li>
        </ul>
      </section>

    </div>
  );
};

export default MentalWellness;
