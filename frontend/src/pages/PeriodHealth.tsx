import React from 'react';
import InfoBox from '../components/InfoBox';
import { Link } from 'react-router-dom';



const PeriodHealth = () => {
  return (
    
    
    <div className="container mx-auto px-4 py-8"
    style={{
      backgroundImage: 'url("/images/home-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Period Health</h1>
      
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeLeft { from { opacity: 0; transform: translateX(-25px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeRight { from { opacity: 0; transform: translateX(25px); } to { opacity: 1; transform: translateX(0); } }
        .anim-fade-up { animation: fadeUp 0.6s ease-out both; }
        .anim-fade-left { animation: fadeLeft 0.6s ease-out both; }
        .anim-fade-right { animation: fadeRight 0.6s ease-out both; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(147,51,234,0.15); }
        .brand-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .brand-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(147,51,234,0.18); }
        .brand-card:hover img { transform: scale(1.05); }
        .brand-card img { transition: transform 0.4s ease; }
      `}</style>

      {/* Navigation Section */}
      <section className="mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/natural-remedies" className="block anim-fade-up" style={{ animationDelay: '0s' }}>
            <div className="bg-white p-6 rounded-lg shadow-md card-hover border-l-4 border-purple-400">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">Natural Remedies</h3>
              <p className="text-gray-800 text-sm mb-4">Discover natural ways to manage period symptoms</p>
            </div>
          </Link>
          <Link to="/blood-color-guide" className="block anim-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white p-6 rounded-lg shadow-md card-hover border-l-4 border-pink-400">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">Blood Color Guide</h3>
              <p className="text-gray-800 text-sm mb-4">Understand what different colors mean</p>
            </div>
          </Link>
          <Link to="/menstrual-hygiene" className="block anim-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white p-6 rounded-lg shadow-md card-hover border-l-4 border-red-400">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">Hygiene Tips</h3>
              <p className="text-gray-800 text-sm mb-4">Essential menstrual hygiene practices</p>
            </div>
          </Link>
        </div>
      </section>

      
{/* First Period Stories Section */}
<section className="mb-12">
        <h2 className="text-xl font-semibold text-purple-700 mb-6">My First Period Story</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Box - Personal Experience */}
          <div
            className="bg-white p-6 rounded-lg shadow-md bg-cover bg-center card-hover anim-fade-left"
            style={{
              backgroundImage: 'url("/images/firstpreiod.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
              backgroundColor: 'rgba(255, 255, 255, 0.7)' // This creates a white overlay
            }}
          >
            <h3 className="text-lg font-semibold mb-4">My First Period Experience</h3>
            <p className="text-gray-800 text-sm mb-4">
              <strong>It was during the month of Navaratri, just after the Diwali celebrations had ended. One fine day, I noticed something unusual on my clothes. Confused and scared, I didn’t know what was happening. Afraid of how my mom might react, I quietly hid the stained clothes under the old washing cloths and went to school, trying to pretend like everything was normal.</strong>
            </p>
            <p className="text-gray-800 text-sm mb-4">
              <strong>But moms always know. She noticed the hidden clothes and, understanding what had happened, rushed to my school. She brought me back home, her face filled with concern and care. I remember her explaining things to me, though at that time, I was too young to fully grasp it all. Being in just the 5th grade, I followed her instructions like a robot, doing as she said without really understanding why.</strong>
            </p>
            <p className="text-gray-800 text-sm mb-4">
              <strong>It was only years later that I truly understood what had happened that day—on 11th November 2014—and the significance of it. What felt like confusion and fear back then, I now recognize as a natural and beautiful phase of growing up.</strong>
            </p>
            <strong><p className="text-gray-800 text-sm mb-4">I started with Stayfree, a well-known brand in India. During my BTech, I switched to Bella pads for their soft cotton comfort. Now, I use Saathi’s bamboo + banana fiber pads, and I highly recommend them! They are biodegradable, eco-friendly, and the best product I’ve used for both health and sustainability.</p></strong>
          </div>

          {/* Right Box - Period Journey */}
          <div
            className="bg-white p-6 rounded-lg shadow-md bg-cover bg-center card-hover anim-fade-right"
            style={{
              backgroundImage: 'url("/images/periodhealth.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
              backgroundColor: 'rgba(255, 255, 255, 0.7)' 
            }}
          >
            <h3 className="text-lg font-semibold mb-4">My Period Journey: Embracing Strength and Resilience</h3>
            <p className="text-gray-800 text-sm mb-4">
             <strong> As of today, I’ve completed 124 months of my period journey, with just one cycle missed along the way. Each month brought its own set of challenges, especially with the terrible stomach and back pain I often experienced. Yet, I never let it stop me. No matter how intense the discomfort, I pushed through my daily tasks, proving to myself time and again that resilience is a part of who I am.</strong>
            </p>
            <p className="text-gray-800 text-sm mb-4">
              <strong>My mom has always been my greatest support. She introduced me to simple yet effective home remedies that became my saviors during those tough days—like boiled coriander seeds (dhaniyalu) and a comforting mix of jaggery with ghee. These not only helped ease my pain but also made me feel cared for in the most nurturing way. I also found that staying hydrated and consuming more liquids rather than solid foods made a big difference in how I felt.</strong>
            </p>
            <p className="text-gray-800 text-sm mb-4">
            <strong>  My period typically lasts for three days with a moderate flow, during which I lose around 30-60 milliliters of blood—roughly 2-4 spoons. In the early days, the sight of blood made me nervous, but over time, it became a symbol of my strength. Each cycle reminded me that women are incredibly powerful—we nurture, we endure, and we build communities with compassion and strength.</strong>
            </p>
            <p className="text-gray-800 text-sm">
              <strong>This journey has taught me that embracing every part of our experiences, even the painful ones, makes us stronger. It’s a reminder that being a woman means carrying a strength that is both silent and profound.</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 px-4 rounded-2xl shadow-md mb-6 card-hover anim-fade-up">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Why can’t women enter temples during their periods? 🤔
      </h2>
      <p className="text-gray-600 text-sm mb-4">
        Is this a tradition or a misconception? If you're caught in a dilemma, it's time to uncover the truth! Dive into my blog and clear your doubts.
      </p>
      <a
        href="https://medium.com/@siddadeepika/exploring-menstrual-taboos-and-the-worship-of-periods-in-the-kamakhya-temple-9cf5569b98b7"
        className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Read More
      </a>
    </section>


      <section className="mb-12">
      <h2 className="text-2xl font-semibold text-purple-700 mb-6">
        Delhi Student's Innovation
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-md grid md:grid-cols-2 gap-6">
        
        
{/* Text Content */}
<div>
  <h3 className="text-xl font-semibold mb-4">
    Eco-Friendly Sanitary Pads from Banana Fiber
  </h3>
  <p className="text-gray-600 text-sm mb-4">
    A group of innovative students from Delhi developed eco-friendly sanitary pads made from banana fiber, offering a sustainable and biodegradable solution for menstrual hygiene. This initiative not only promotes environmental awareness but also contributes to accessible and affordable menstrual health products.
  </p>
  <p className="text-gray-600 text-sm mb-4">
    Their innovation has inspired local communities to embrace sustainable practices in menstrual health, encouraging a shift towards eco-conscious living.
  </p>
  <a
    href="https://www.facebook.com/watch/?v=2363594007293905"
    target="_blank"
    rel="noopener noreferrer"
    className="text-purple-700 underline text-sm"
  >
    Learn more about their product
  </a>

  {/* Key Points Paragraph */}
  <div className="bg-purple-50 p-4 rounded-lg shadow-md mt-4">
    <p className="text-gray-600 text-sm">
    Only 18% of women in India have access to proper menstrual hygiene, with many still using traditional materials like ash, coconut husk, sand, cow dung, or cotton cloth. To promote healthier and eco-friendly choices, women are encouraged to switch to reusable or biodegradable sanitary napkins. Banana fiber pads are a great option, offering excellent absorption, hygiene, easy washing, and quick drying.
</p>
  </div>
</div>

        {/* Image */}
        <div className="mt-7">
          <img 
            src="/images/delhi.png" 
            alt="Delhi Students' Eco-Friendly Pads" 
            className="w-full h-auto rounded-lg shadow-md object-cover"
          />
        </div>

      </div>
    </section>
      


      {/* Organic Pads Section */}
      <section className="mb-12">
      <h2 className="text-2xl font-semibold text-purple-700 mb-6">Organic Pads & Production</h2>
<div className="grid md:grid-cols-2 gap-6">
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4">Arunachalam Muruganantham: India's Menstrual Man</h3>
    <p className="text-gray-600 text-sm mb-4">
      Arunachalam Muruganantham revolutionized menstrual hygiene in India by inventing low-cost sanitary pad-making machines. Motivated by his concern for his wife's health, he faced societal stigma and personal challenges but persevered. His innovation empowered women by enabling them to produce affordable, hygienic pads, significantly improving menstrual health awareness and accessibility in rural India.
    </p>
    <p className="text-gray-600 text-sm mb-4">
      Muruganantham's work not only transformed the lives of millions but also sparked conversations about menstrual health, breaking long-held taboos and inspiring innovation in the field of women's health and hygiene.
    </p>
    <a href="https://interactive.aljazeera.com/aje/shorts/india-menstruation-man/" target="_blank" rel="noopener noreferrer" className="text-purple-700 underline text-sm">
      Learn more about his journey
    </a>
    {/* Image */}
    <div className="mt-7">
          <img 
            src="/images/arunachalam.jpg" 
            alt="Delhi Students' Eco-Friendly Pads" 
            className="w-full h-auto rounded-lg shadow-md object-cover"
          />
        </div>
        
       
        {/* Menstrual Man Section */}
      <section className="mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-purple-600 mb-2">Menstrual Health & Accessibility</h3>
          <p className="text-gray-600 text-sm mb-6">
          Comfort, Care, and Confidence – Period
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
  <InfoBox 
    imageSrc="/images/pad.jpg"
    title="Sanitary Pads "
    content="Disposable protection: Change every 4-6 hours"
  />
  <InfoBox 
    imageSrc="/images/cup.jpg"
    title="Menstrual Cup"
    content="Reusable collector: Change every 8-12 hours"
  />
  <InfoBox 
    imageSrc="/images/tampons.jpg"
    title="Tampons"
    content="Absorbent insert: Change every 4 hours"
  />
  <InfoBox 
    imageSrc="/images/panties.jpg"
    title="Period Underwear"
    content="Washable wear: Change every 4-6 hours"
  />
</div>


        </div>
        <br></br><br></br>
      </section>
  </div>
  
  
  <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Choosing the Best Period Product: A Simple Guide for Every Lifestyle</h3>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-medium mb-2">Best for Beginners</h4>
                <ul className="list-disc list-inside text-gray-800">
                  <li><b>Pads</b> – Easy to use, no insertion required, and ideal for getting started.</li>                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-medium mb-2">Best for Active Lifestyles (like swimming or sports)</h4>
                <ul className="list-disc list-inside text-gray-800">
                  <li><b>Tampon</b>– Comfortable, discreet, and stay in place during movement.</li>
                  <li><b>Menstrual Cups</b> – Long-lasting and leak-proof for up to 12 hours.</li>
                  
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-medium mb-2">Best for Heavy Flow</h4>
                <ul className="list-disc list-inside text-gray-800">
                  <li><b>Menstrual Cups</b> – Hold more than tampons or pads and last longer.</li>
                  
                                  </ul>
              </div>
<div className="bg-purple-50 p-4 rounded">
                <h4 className="font-medium mb-2"> Best for Eco-Friendly and Budget-Friendly</h4>
                <ul className="list-disc list-inside text-gray-800">
                  <li><b>Menstrual Cups</b> – Reusable for up to 10 years.</li>
                  <li><b>Reusable Pads</b> – Washable and long-lasting.</li>
                  <li><b>Reusable Period Underwear </b>– Sustainable and comfortable.</li>
                </ul>
              </div>

<div className="bg-purple-50 p-4 rounded">
                <h4 className="font-medium mb-2">Best for Overnight Protection</h4>
                <ul className="list-disc list-inside text-gray-800">
                  <li><b>Overnight Pads</b> – Extra length and absorbency.</li>
                  <li><b>Period Underwear</b> – Comfortable and leak-proof for all-night wear.</li>
                  <li><b>Menstrual Cups</b> – Can stay in place safely for 12 hours.</li>
                </ul>
              </div>
<div className="bg-purple-50 p-4 rounded">
                <h4 className="font-medium mb-2">Best for Mess-Free Intimacy</h4>
                <ul className="list-disc list-inside text-gray-800">
                  <li><b>Menstrual Discs</b> – Can be worn during sex without mess.</li>
                  
                </ul>
              </div>


            </div>
          </div>
        </div>
        </section>

{/* Image Section */}
<div className="mt-7 flex justify-center">
          <img 
            src="/images/period chart.jpg" 
            alt="Delhi Students' Eco-Friendly Pads" 

            
            className="w-full max-w-4xl h-auto rounded-lg shadow-md object-cover"
          />
        </div>



<br></br><br></br>



      <section className="container mx-auto px-6 py-10">
  <h2 className="text-2xl font-semibold text-purple-700 mb-6 text-center">Top Organic & Sustainable Period Care Brands</h2>
  
  <div className="bg-white shadow-lg rounded-lg p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {[
        {
          name: "Saathi",
          origin: "India",
          description: "Biodegradable, made from banana fiber, and supports eco-friendly and sustainable menstrual care.",
          productLink: "https://saathipads.com/?srsltid=AfmBOoq-i8K9q7d3ppCBpzL0SUlA9dGeQdaWP75H6uiBsTt5DaV9ff0k",
          image: "/images/Saathi.jpg", // Replace with actual image link
        },
        {
          name: "Azah",
          origin: "India",
          description: "Organic, ultra-thin, and made with 100% certified cotton for a rash-free and comfortable experience.",
          productLink: "https://azah.in/collections/sanitary-pads?gad_source=1&gclid=Cj0KCQjw-e6-BhDmARIsAOxxlxXfiaqF15PtOt2hU45tv02OXKaPxHebbtKD28yR0h6h08OgDY_gH1saApLfEALw_wcB",
          image: "/images/azah.jpg", // Replace with actual image link
        },
        {
          name: "Nuva",
          origin: "India",
          description: "Eco-friendly, made from biodegradable materials, ensuring a safe and sustainable period experience.",
          productLink: "https://nuawoman.com/sanitary-pads?srsltid=AfmBOopoYja_5ASbQLUDWuN20wct1djDSuDHAhaayMMTl_DqnEwaersf",
          image: "/images/nuva.jpg", // Replace with actual image link
        },
        {
          name: "Vivanion",
          origin: "India",
          description: "Uses anion chip technology for better hygiene, odor control, and superior comfort with breathable materials.",
          productLink: "https://www.amazon.in/Plastron-Vivanion-Natural-Organic-Sanitary/dp/B00OCSD9E0",
          image: "/images/Vivanion.jpg", // Replace with actual image link
        },
        
        {
          name: "Bella",
          origin: "Poland",
          description: "Breathable, made with soft cotton, and offers an affordable yet comfortable menstrual care solution.",
          productLink: "https://bella-global.com/en_GLO",
          image: "/images/bella.jpg", // Replace with actual image link
        }
      
        
      ].map((brand, index) => (
        <div key={index} className="p-4 text-center shadow-lg border rounded-lg brand-card anim-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
          <img src={brand.image} alt={brand.name} className="w-full h-40 object-cover rounded-lg mb-4" />
          <div className="p-4">
            <h3 className="text-xl font-semibold">{brand.name}</h3>
            <p className="text-gray-600 text-sm">🌍 {brand.origin}</p>
            <p className="text-gray-700 mt-2">{brand.description}</p>
            <a href={brand.productLink} target="_blank" rel="noopener noreferrer">
              <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                View Product
              </button>
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
  </section>







      <section className="mb-12">
  <h2 className="text-2xl font-semibold text-purple-700 mb-6 text-center">
  
    Menstrual Clots: What's Normal and When to See a Doctor
  </h2>
  


        
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Column - Explanation */}
      <div className="flex-1 space-y-4">
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-2">What Are Menstrual Clots?</h3>
          <p className="text-gray-600">
            Menstrual clots are thick clumps of blood, tissue, and mucus that are expelled during periods. 
            They are usually red and can vary in size.
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-2">What Causes Menstrual Clots?</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li><strong>Heavy bleeding:</strong> When blood flow is too fast for the body to break it down</li>
            <li><strong>Uterine obstructions:</strong> Conditions like fibroids, endometriosis, or adenomyosis</li>
            <li><strong>Hormonal imbalance:</strong> Irregular estrogen and progesterone levels</li>
            <li><strong>Miscarriage:</strong> Early pregnancy loss may cause clotting</li>
            <li><strong>Von Willebrand Disease (VWD):</strong> A rare bleeding disorder</li>
          </ul>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-2">Possible Complications</h3>
          <p className="text-gray-600">
            <strong>Anemia:</strong> Fatigue, weakness, pale skin, and dizziness due to iron deficiency
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-2"> When to See a Doctor</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>If clots are frequent or larger than a quarter</li>
            <li>If bleeding is too heavy (soaking a pad/tampon every hour)</li>
            <li>If you suspect pregnancy and experience clotting</li>
          </ul>
        </div>
      </div>

      {/* Right Column - Normal vs Abnormal & Treatment */}
      <div className="flex-1 space-y-4">
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-2">Normal vs. Abnormal Clots</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-green-100 p-4 rounded flex-1">
              <h4 className="font-semibold text-green-700">✅ Normal Clots:</h4>
              <ul className="list-disc list-inside text-gray-600">
                <li>Smaller than a quarter</li>
                <li>Occur occasionally, mostly at the start of your period</li>
                <li>Bright or dark red</li>
              </ul>
            </div>
            <div className="bg-red-100 p-4 rounded flex-1">
              <h4 className="font-semibold text-red-700">🚨 Abnormal Clots:</h4>
              <ul className="list-disc list-inside text-gray-600">
                <li>Larger than a quarter</li>
                <li>Happen frequently</li>
                <li>Accompanied by heavy bleeding (changing pads/tampons every 2 hours or less)</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-7 flex justify-center">
  <img 
    src="/images/cc.jpg" 
    alt="Delhi Students' Eco-Friendly Pads" 
    className="w-full max-w-4xl h-[200px] rounded-lg shadow-md object-contain"
  />
</div>


        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-2">Treatment Options</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li><strong>Medications:</strong> Hormonal birth control or tranexamic acid to reduce bleeding</li>
            <li><strong>Surgery:</strong> D&C, fibroid removal, or hysterectomy in severe cases</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-2">Managing Heavy Periods</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Take NSAIDs like ibuprofen for cramps and reduced bleeding</li>
            <li>Use high-absorbency pads/tampons or wear both together</li>
            <li>Stay hydrated and eat iron-rich foods like leafy greens and quinoa</li>
            <li>Track your symptoms and consult a doctor if needed</li>
          </ul>
        </div>

       
      </div>
    </div>

    {/* Bottom Line */}
    <div className="mt-6 p-4 bg-purple-100 rounded text-center">
      
      <p className="text-gray-600">
        Menstrual clots are common, but large or frequent clots may signal an underlying condition. 
        Seeking medical advice can help manage heavy bleeding effectively.
      </p>
    </div>
  </div>
</section>

      
  
      

      
    </div>
  );
};

export default PeriodHealth;