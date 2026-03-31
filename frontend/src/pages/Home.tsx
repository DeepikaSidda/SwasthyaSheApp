import React from 'react';
import { Link } from 'react-router-dom';
import NewsletterSubscribe from '../components/NewsletterSubscribe';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8" 
      style={{
        backgroundImage: 'url("/images/home-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 10px 30px rgba(147,51,234,0.15); } 50% { box-shadow: 0 15px 40px rgba(147,51,234,0.25); } }
        .anim-up { animation: fadeInUp 0.8s ease-out both; }
        .anim-left { animation: slideInLeft 0.8s ease-out both; }
        .anim-right { animation: slideInRight 0.8s ease-out both; }
        .anim-glow { animation: glowPulse 3s ease-in-out infinite; }
        .anim-d2 { animation-delay: 0.15s; }
        .anim-d3 { animation-delay: 0.3s; }
        .card-anim { transition: all 0.3s ease; }
        .card-anim:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(147,51,234,0.2); }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 40% { transform: translateY(-12px); } 60% { transform: translateY(-6px); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes wiggle { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(3deg); } 75% { transform: rotate(-3deg); } }
        .anim-float { animation: float 3s ease-in-out infinite; }
        .anim-pulse { animation: pulse 2s ease-in-out infinite; }
        .anim-bounce { animation: bounce 2s ease-in-out infinite; }
        .anim-wiggle:hover { animation: wiggle 0.5s ease-in-out; }
        .shimmer-title { background: linear-gradient(90deg, #7c3aed 0%, #a855f7 25%, #c084fc 50%, #a855f7 75%, #7c3aed 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 3s linear infinite; }
        .icon-hover:hover .topic-icon { animation: bounce 0.6s ease-in-out; }
        .icon-hover:hover .topic-icon-wrap { transform: scale(1.15) rotate(5deg); transition: transform 0.3s ease; }
        .gradient-border { border-image: linear-gradient(135deg, #7c3aed, #ec4899) 1; }
        .card-shine { position: relative; overflow: hidden; }
        .card-shine::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%); transform: translateX(-100%); transition: transform 0.6s ease; }
        .card-shine:hover::after { transform: translateX(100%); }
      `}</style>
      <div className="text-center mb-12 anim-up">
        <h1 className="text-4xl font-bold mb-4 shimmer-title">Swasthyashe</h1>
        <p className="text-xl text-gray-600">
          Empowering Women's Health Through Traditional Wisdom and Modern Science
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md card-anim anim-left anim-glow"
         style={{
          backgroundImage: 'url("/images/ancientwisdom-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}
        >
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">Ancient Wisdom</h2>
          <p className="text-gray-600">
          <p className="text-gray-600">  
  <span className="text-xl font-bold text-black-700">🌿 Ancient Wisdom: Nurturing Women's Well-being</span>  
  <br /><br />  
  For generations, Indian traditions have embraced the power of nature and holistic living to support women's health and well-being. Rooted in the ancient sciences of <strong>Ayurveda, yoga, and natural remedies</strong>, these time-tested practices offer gentle, effective ways to navigate every stage of womanhood—from menstruation to motherhood and beyond.  
  <br /><br />  
  From soothing <strong>herbal remedies</strong> for period pain to mindful rituals that promote balance and inner strength, Indian traditions remind us that true wellness comes from honoring the <strong>body, mind, and soul</strong>. These practices not only nurture physical health but also foster <strong>resilience, confidence, and a deep connection to self</strong>.  
  <br /><br />  
  <em>Step into the world of ancient Indian wisdom and discover natural ways to embrace and celebrate your well-being.</em>  
</p>

          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md card-anim anim-up anim-glow anim-d2"
        style={{
          backgroundImage: 'url("/images/modernscience.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}
        >
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">Modern Science</h2>
          <p className="text-gray-600 font-sans">  
  <span className="text-xl font-bold text-black-700">🔬 Modern Science: Bridging Tradition and Innovation</span>  
  <br /><br />  
  While ancient Indian practices have nurtured women's health for generations, <strong>modern science</strong> is now validating and enhancing these time-tested traditions. Contemporary research reveals how <strong>natural remedies, mindful rituals, and holistic lifestyles</strong> contribute to optimal health outcomes—from hormonal balance to mental well-being.  
  <br /><br />  
  Scientific studies have confirmed the benefits of practices like <strong>yoga for stress relief</strong>, <strong>Ayurvedic herbs for hormonal health</strong>, and <strong>traditional diets for better digestion and immunity</strong>. By blending ancient wisdom with modern insights, women can embrace a <strong>holistic approach to well-being</strong> that's both rooted in tradition and backed by science.  
  <br /><br />  
  <em>Discover how modern science empowers and enriches traditional practices, helping women lead healthier, stronger, and more balanced lives.</em>  
</p>

        </div>
        <div className="bg-white p-6 rounded-lg shadow-md card-anim anim-right anim-glow anim-d3"
        style={{
          backgroundImage: 'url("/images/holistic.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}
        >
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">Holistic Approach</h2>
          <p className="text-gray-600 font-sans">  
  <span className="text-xl font-bold text-black-700">🌸 Holistic Approach: Balance for Body, Mind & Spirit</span>  
  <br /><br />  
  True well-being goes beyond just physical health—it's about creating harmony between the <strong>body, mind, and spirit</strong>. A holistic approach to women's health embraces this connection, combining <strong>nutrition, movement, mindfulness, and self-care</strong> to promote overall wellness.  
  <br /><br />  
  By integrating <strong>ancient traditions, modern science, and mindful living</strong>, women can cultivate a lifestyle that supports <strong>physical strength, emotional balance, and inner peace</strong>. Whether through <strong>nutritious foods, yoga, meditation, or self-care rituals</strong>, a holistic approach ensures that every aspect of health is nurtured.  
  <br /><br />  
  <em>Step into a world where wellness is not just about treatment but about <strong>preventive care, self-love, and long-term vitality</strong>.</em>  
</p>

        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {[
          { title: 'Period Health', description: 'Natural remedies and holistic approaches to menstrual wellness.', path: '/period-health', icon: '🩸', border: 'border-l-4 border-red-400', bg: 'hover:bg-red-50' },
          { title: 'Mental Wellness', description: 'Traditional practices for emotional balance and mental harmony.', path: '/mental-wellness', icon: '🧠', border: 'border-l-4 border-blue-400', bg: 'hover:bg-blue-50' },
          { title: 'Sexual & Reproductive Health', description: 'Essential information for reproductive well-being.', path: '/sexual-health', icon: '💗', border: 'border-l-4 border-pink-400', bg: 'hover:bg-pink-50' },
          { title: 'Skin & Hair Care', description: 'Natural beauty secrets from Ayurvedic traditions.', path: '/skin-hair-care', icon: '✨', border: 'border-l-4 border-amber-400', bg: 'hover:bg-amber-50' },
          { title: 'Pregnancy Care', description: 'Holistic support throughout your pregnancy journey.', path: '/pregnancy-care', icon: '🤰', border: 'border-l-4 border-purple-400', bg: 'hover:bg-purple-50' },
        ].map((topic, i) => (
          <Link
            key={topic.path}
            to={topic.path}
            className={`bg-white p-6 rounded-xl shadow-md card-anim anim-up card-shine icon-hover ${topic.border} ${topic.bg} transition-all duration-300`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start gap-4">
              <div className="topic-icon-wrap w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-300">
                {topic.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-purple-700 mb-2">{topic.title}</h2>
                <p className="text-gray-600 text-sm">{topic.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="max-w-xl mx-auto anim-up">
        <NewsletterSubscribe />
      </div>
    </div>
  );
};

export default Home;
