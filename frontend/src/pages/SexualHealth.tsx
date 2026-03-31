import React from 'react';


const SexualHealth = () => {
  return (
    <div className="container mx-auto px-4 py-8"
      style={{
        backgroundImage: 'url("/images/home-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {/* Cover Image */}
      <div className="w-full h-64 bg-cover bg-center rounded-xl shadow-lg mb-6" 
        style={{ backgroundImage: 'url("/images/women.jpg")' }}
      ></div>
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Sexual & Reproductive Health</h1>

      {/* First Section: Importance of Sex for Women */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">
          The Importance of Sex for Women
        </h2>
        <p className="text-gray-700 mb-4">
          Sex plays a vital role in a loving relationship, yet its importance
          for women is often overlooked. For most women, intimacy is more than
          just a physical act—it strengthens emotional bonds and enhances
          overall well-being.
        </p>
        <p className="text-gray-700 mb-4">
          Sex also triggers the release of{' '}
          <strong className="text-purple-700">“feel-good” hormones</strong> like
          Oxytocin, which help women feel vibrant, energetic, and happy.
        </p>
        <h3 className="text-xl font-semibold text-purple-600 mb-4">
          Why Sexual Health Matters in Relationships
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>Strengthens Emotional Connection</strong> – Deepens
            intimacy with your partner.
          </li>
          <li>
            <strong>Enhances Well-Being</strong> – Reduces stress, improves
            sleep, and boosts mood.
          </li>
          <li>
            <strong>Supports Vaginal & Reproductive Health</strong> – Improves
            blood flow and hormonal balance.
          </li>
          <li>
            <strong>Promotes Self-Confidence</strong> – A fulfilling sex life
            can improve self-esteem.
          </li>
        </ul>
        <p className="text-gray-700 mt-4">
          It's important to pay attention to the{' '}
          <strong className="text-purple-700">"sexual temperature"</strong> of a
          relationship. If intimacy is strong, it's a good indication that the
          relationship is in a healthy place. If sexual activity has
          significantly decreased, it may signal deeper emotional or physical
          concerns.
        </p>
        <p className="text-gray-700 mt-4">
          If you’re experiencing a lack of intimacy,{' '}
          <strong className="text-purple-700">open communication</strong> with
          your partner is key. Discuss your feelings, explore new ways to
          connect, and seek professional advice if necessary.
        </p>
      </section>
      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="content" style={{ flex: 1, marginRight: '20px' }}>
        <h1  className="text-3xl font-bold text-purple-800 mb-8">The Vital Role of Sex in Women's Emotional and Physical Well-Being</h1>
        <p className="text-gray-600 text-sm mb-4">
          Sex plays a crucial role in a woman’s emotional, mental, and physical well-being, particularly within a loving relationship.
          It helps create emotional intimacy, strengthens the bond between partners, and promotes the release of "feel-good" hormones like oxytocin.
          Great sex indicates a healthy relationship, while a lack of it can signal issues that may need addressing, such as stress, lack of communication, or emotional disconnect.
        </p>
        <p className="text-gray-600 text-sm mb-4">
          Sex offers numerous benefits, including stress relief, better sleep, improved pelvic health, and boosted confidence.
          For women, emotional connection is key to sexual satisfaction, with many valuing emotional intimacy alongside physical connection.
          Communication with partners about sexual needs, desires, and boundaries is essential for a fulfilling sexual experience.
        </p>
        <p className="text-gray-600 text-sm mb-4">
          Over time, emotional intimacy and the buildup to sex, including foreplay and seduction, become vital to maintaining a vibrant sex life,
          especially in long-term relationships. Factors like stress, health issues, and age can impact libido, but it's important to communicate openly with a partner and seek professional help if needed.
        </p>
        <p className="text-gray-600 text-sm mb-4">
          Despite busy lives, it's essential to prioritize intimacy and sex, as it enhances overall well-being and strengthens the relationship.
        </p>
      </div>
      <img 
        src="/images/sex.jpg" 
        alt="Sexual Well-being" 
        style={{ width: '300px', height: 'auto' }} 
      />
    </div>
    </section>
    <br></br>


      <h1 className="text-4xl font-bold text-purple-800 mb-8 text-center">Fertility & Pregnancy Planning</h1>

      <div className="flex justify-between gap-8">
  {/* Fertility Box */}
  <div className="w-1/2 bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
    <section>
      <div
        className="bg-white p-6 rounded-lg shadow-md bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/repoback.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(255, 255, 255, 0.7)' // This creates a white overlay
        }}
      >
        <h2 className="text-2xl font-semibold text-purple-800 mb-4">Understanding Fertility</h2>
        <p className="text-gray-600 text-sm mb-4">
          Fertility refers to your ability to conceive and carry a pregnancy to term. Understanding your fertility can help you optimize your chances of becoming pregnant.
        </p>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Track Your Menstrual Cycle</h3>
        <p className="text-gray-600 text-sm mb-4">
          Understanding the regularity of your menstrual cycle is crucial for pinpointing your fertile window. Typically, a woman's cycle lasts between 21 and 35 days. Keeping track of when you start and end your period each month can help you determine your average cycle length, which can inform when ovulation is likely to occur.
        </p>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Monitor Ovulation Signs</h3>
        <p className="text-gray-600 text-sm mb-4">
          Ovulation is when an egg is released from the ovary, making it available for fertilization. This occurs roughly midway through your menstrual cycle. Signs that ovulation is approaching include:
        </p>
        <ul className="list-disc pl-5 text-gray-600 text-sm">
          <li><strong>Change in cervical mucus:</strong> Your cervical mucus becomes clearer, stretchier, and more slippery, resembling raw egg whites.</li>
          <li><strong>Increase in libido:</strong> Many women notice a natural increase in sexual desire around ovulation.</li>
          <li><strong>Mild abdominal cramping:</strong> Some women feel light cramps or twinges during ovulation.</li>
        </ul>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Maintain a Healthy Lifestyle</h3>
        <p className="text-gray-600 text-sm mb-4">A healthy lifestyle plays a significant role in fertility. Consider these aspects:</p>
        <ul className="list-disc pl-5 text-gray-600 text-sm">
          <li><strong>Balanced diet:</strong> Eating nutrient-rich foods can support your reproductive health. Include a variety of fruits, vegetables, whole grains, and lean proteins.</li>
          <li><strong>Regular exercise:</strong> Moderate exercise improves circulation and overall well-being, but excessive exercise can negatively affect ovulation.</li>
          <li><strong>Adequate sleep:</strong> Consistent, quality sleep is essential for hormone regulation.</li>
          <li><strong>Stress management:</strong> Chronic stress can interfere with ovulation and hormone balance, so try methods like yoga, meditation, or deep breathing exercises.</li>
        </ul>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Consider Preconception Vitamins</h3>
        <p className="text-gray-600 text-sm mb-4">
          Before trying to conceive, it's important to ensure you're getting the necessary nutrients. A prenatal vitamin, especially one that contains folic acid, is essential. Folic acid reduces the risk of neural tube defects, and other important nutrients like iodine, calcium, and vitamin D support both fertility and a healthy pregnancy.
        </p>
      </div>
    </section>
  </div>

  {/* Pregnancy Box */}
  <div className="w-1/2 bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
    <section>
      <div
        className="bg-white p-6 rounded-lg shadow-md bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/repoback.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(255, 255, 255, 0.7)' // This creates a white overlay
        }}
      >
        <h2 className="text-2xl font-semibold text-purple-800 mb-4">Best Time to Conceive</h2>
        <p className="text-gray-600 text-sm mb-4">
          The key to increasing the chances of conception is timing. Understanding your fertile window and how to monitor it can significantly enhance your chances, helping you plan intercourse more effectively for the best possible outcome.
        </p>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Identify Your Fertile Window</h3>
        <p className="text-gray-600 text-sm mb-4">
          The fertile window is the span of time when conception is most likely to occur. It usually includes the five days leading up to ovulation and the day of ovulation itself. Sperm can live inside the female reproductive tract for up to 5 days, so having sex during this time increases the likelihood of sperm being present when the egg is released.
        </p>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Track Basal Body Temperature</h3>
        <p className="text-gray-600 text-sm mb-4">
          Your basal body temperature (BBT) is your body temperature when you first wake up in the morning. After ovulation, your BBT rises slightly (by about 0.5°F or 0.3°C) due to increased progesterone. By charting your BBT daily, you can pinpoint ovulation, although this method works best when used over a few months.
        </p>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Monitor Cervical Mucus Changes</h3>
        <p className="text-gray-600 text-sm mb-4">
          The consistency of cervical mucus changes throughout your menstrual cycle. In the days leading up to ovulation, it becomes more abundant and resembles raw egg whites, signaling peak fertility. By observing these changes, you can determine when you're most likely to ovulate.
        </p>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Monitor Cervical Position</h3>
        <p className="text-gray-600 text-sm mb-4">
          Throughout the menstrual cycle, the cervix changes position and texture. During ovulation, the cervix becomes softer, higher, and more open to facilitate sperm entry. By regularly checking these changes, you can better predict your most fertile days. This method works best when combined with other tracking techniques like basal body temperature and cervical mucus monitoring.
        </p>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Use Ovulation Prediction Kits</h3>
        <p className="text-gray-600 text-sm mb-4">
          Ovulation predictor kits (OPKs) test your urine for an increase in luteinizing hormone (LH), which surges just before ovulation. These kits can help you predict when you're about to ovulate, allowing you to time intercourse more effectively. OPKs are especially useful for women with irregular cycles, as they provide a more accurate prediction than tracking BBT or cervical mucus alone.
        </p>
      </div>
    </section>
  </div>
</div>


    <br></br>
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-purple-700 text-center">Summary of Birth Control Methods</h1>
      
      {/* Intro Section */}
      <div className="mb-6 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">What is Birth Control?</h2>
        <p className="text-gray-700">
          Birth control refers to methods used to prevent pregnancy, including devices, medications, surgical procedures, and sexual practices.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* IUDs */}
        <div className="p-6 bg-white rounded-lg shadow-md border border-purple-300">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Intrauterine Devices (IUDs)</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li><strong>Copper IUD:</strong> Acts as a spermicide, lasts up to 10 years.</li>
            <li><strong>Hormonal IUD:</strong> Releases progestin, lasts 3–8 years.</li>
          </ul>
          <p className="mt-2 font-semibold">Effectiveness: Over 99%.</p>
        </div>

        {/* Hormonal Methods */}
        <div className="p-6 bg-white rounded-lg shadow-md border border-purple-300">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Hormonal Methods</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Contraceptive Injection (94% effective)</li>
            <li>Implant (99% effective)</li>
            <li>Birth Control Pills (91–99% effective)</li>
            <li>Contraceptive Patch (91–99% effective)</li>
            <li>Vaginal Ring (91–99% effective)</li>
          </ul>
        </div>

        {/* Emergency Contraception */}
        <div className="p-6 bg-white rounded-lg shadow-md border border-purple-300">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Emergency Contraception</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Ella (Up to 5 days, 85% effective)</li>
            <li>Plan B (Best within 3 days, 75–89% effective)</li>
          </ul>
        </div>
      
        {/* Barrier Methods */}
        <div className="p-6 bg-white rounded-lg shadow-md border border-purple-300">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Barrier Methods</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Male Condoms (87% effective, protects against STIs)</li>
            <li>Female Condoms (79% effective)</li>
            <li>Diaphragm & Cervical Cap (71–88% effective)</li>
            <li>Sponge (76–86% effective)</li>
          </ul>
        </div>

        {/* Natural Methods */}
        <div className="p-6 bg-white rounded-lg shadow-md border border-purple-300">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Natural Methods</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Withdrawal (80% effective)</li>
            <li>Fertility Awareness (78–98% effective)</li>
            <li>Lactational Amenorrhea (98% effective for 6 months post-birth)</li>
          </ul>
        </div>

        {/* Permanent Methods */}
        <div className="p-6 bg-white rounded-lg shadow-md border border-purple-300">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Permanent Contraception</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Tubal Ligation (99% effective)</li>
            <li>Vasectomy (99% effective)</li>
          </ul>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">Key Takeaways</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>No method is 100% effective except abstinence.</li>
          <li>Combining methods (e.g., condoms + pills) increases protection.</li>
          <li>Only condoms protect against STIs.</li>
          <li>Some hormonal methods may stop or reduce periods.</li>
        </ul>
      </div>
    </div>
    <br></br>

    <div className="p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
  {/* Left Box - Precautions Content */}
  <div className="bg-white shadow-md rounded-xl p-6 w-full md:w-1/2">
    <h2 className="text-2xl font-bold mb-4 text-purple-600">Precautions Before and After Sex</h2>

    <h3 className="text-xl font-semibold mt-4 text-purple-600">Before Sex:</h3>
    <ul className="list-disc ml-6 text-gray-700">
          <li>
            <strong>Ensure Consent & Comfort:</strong> Engage in open communication with your partner about boundaries, expectations, and protection.
          </li>
          <li>
            <strong>Use Protection:</strong> Condoms help prevent sexually transmitted infections (STIs) and unplanned pregnancies. Consider additional birth control methods if needed.
          </li>
          <li>
            <strong>Maintain Personal Hygiene:</strong> Wash your intimate areas with mild, unscented soap and water. Avoid harsh products that disrupt natural pH balance.
          </li>
          <li>
            <strong>Empty Your Bladder:</strong> This can help reduce the risk of urinary tract infections (UTIs).
          </li>
          <li>
            <strong>Lubrication Check:</strong> If needed, use a water-based or silicone-based lubricant to prevent vaginal dryness and discomfort.
          </li>
          <li>
            <strong>Be Mindful of Your Health:</strong> Avoid sex if you have symptoms of infection, irritation, or any discomfort.
          </li>
        </ul>

        {/* After Sex Section */}
        <h3 className="text-xl font-semibold mt-4 text-purple-600">After Sex:</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            <strong>Clean Up Properly:</strong> Gently wash the vaginal area with warm water and mild soap. Avoid douching, as it disrupts natural vaginal flora.
          </li>
          <li>
            <strong>Urinate Soon After Sex:</strong> Helps flush out bacteria and reduces the risk of UTIs.
          </li>
          <li>
            <strong>Stay Hydrated:</strong> Drinking water helps with overall bodily functions, including flushing out bacteria.
          </li>
          <li>
            <strong>Wear Breathable Underwear:</strong> Opt for cotton underwear to allow airflow and reduce the risk of infections. Avoid tight clothing.
          </li>
          <li>
            <strong>Check for Any Discomfort:</strong> If you experience itching, burning, unusual discharge, or pain, consult a doctor as soon as possible.
          </li>
          <li>
            <strong>Maintain Vaginal Health:</strong> If you’re prone to infections, consider taking probiotics or eating yogurt for good vaginal bacteria.
          </li>
          <li>
            <strong>Emergency Contraception (If Needed):</strong> If you had unprotected sex and are worried about pregnancy, take an emergency contraceptive pill within 72 hours.
          </li>
          <li>
            <strong>Schedule Regular Health Check-ups:</strong> Routine gynecological visits help in early detection of any potential health concerns.
          </li>
        </ul>
  </div>

  {/* Right Box - Image */}
  <div className=" rounded-xl overflow-hidden w-full md:w-1/2 flex justify-center items-center">
    <img 
      src="/images/coo.jpg" 
      alt="Health Representation" 
      className="w-full h-auto object-cover rounded-xl shadow-lg"
    />
  </div>
</div>


<div className="container mx-auto p-6">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: What Are STIs? */}
        <div className="p-6 bg-white border rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-purple-700 mb-3">What Are STIs?</h2>
          <p className="text-gray-700">
            <strong>Sexually Transmitted Infections (STIs)</strong> are infections caused by bacteria, viruses, or parasites
            that spread through sexual contact, including vaginal, anal, and oral sex.  
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            <li>STIs often do not show symptoms in the early stages.</li>
            <li>People can carry an STI unknowingly and spread it.</li>
            <li>Some infections may clear on their own, while others need treatment.</li>
          </ul>
          <p className="mt-2 text-gray-600">
            Think of STIs as the "infection stage"—before symptoms develop into a disease.
          </p>
        </div>

        {/* Box 2: What Are STDs? */}
        <div className="p-6 bg-white border rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-purple-700 mb-3">What Are STDs?</h2>
          <p className="text-gray-700">
            <strong>Sexually Transmitted Diseases (STDs)</strong> occur when an STI progresses and causes visible symptoms or
            long-term health complications.
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            <li>STDs result from untreated or advanced STIs.</li>
            <li>They can lead to chronic health issues (e.g., infertility, organ damage).</li>
            <li>Some STDs are manageable but not curable (e.g., HIV/AIDS).</li>
          </ul>
          <p className="mt-2 text-gray-600">
            STDs are the "disease stage"—when an STI causes noticeable health problems.
          </p>
        </div>

        {/* Box 3: Key Differences Between STIs & STDs */}
        <div className="p-6 bg-white border rounded-lg shadow-lg col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold text-purple-700 mb-3">STI vs. STD: What’s the Difference?</h2>
          <table className="w-full border-collapse border border-gray-300 text-gray-700">
            <thead>
              <tr className="bg-purple-100">
                <th className="border border-gray-300 p-2">Feature</th>
                <th className="border border-gray-300 p-2">STI (Infection Stage)</th>
                <th className="border border-gray-300 p-2">STD (Disease Stage)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Symptoms</td>
                <td className="border border-gray-300 p-2">Often no symptoms</td>
                <td className="border border-gray-300 p-2">Visible health complications</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Detection</td>
                <td className="border border-gray-300 p-2">Found through testing</td>
                <td className="border border-gray-300 p-2">Diagnosed after symptoms appear</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Examples</td>
                <td className="border border-gray-300 p-2">HPV, Chlamydia, Gonorrhea</td>
                <td className="border border-gray-300 p-2">HIV/AIDS, Syphilis</td>
              </tr>
            </tbody>
          </table>
        </div>
{/* Box 4: Prevention & Protection */}
        <div className="p-6 bg-white border rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-purple-700 mb-3">Prevention & Protection</h2>
          <ul className="list-decimal pl-5">
            <li><strong>Protection:</strong> Use condoms & dental dams.</li>
            <li><strong>Prevention:</strong> Get vaccinated (HPV, Hepatitis B).</li>
            <li><strong>Periodic Testing:</strong> Regular STI/STD check-ups.</li>
            <li><strong>Partner Awareness:</strong> Educate & communicate.</li>
          </ul>
        </div>

        {/* Box 5: What To Do If You Have an STI/STD? */}
        <div className="p-6 bg-white border rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-purple-700 mb-3">What To Do If You Have an STI/STD?</h2>
          <ul className="list-disc pl-5">
            <li><strong>Step 1:</strong> Don’t panic – many STIs are treatable!</li>
            <li><strong>Step 2:</strong> Get tested at a clinic.</li>
            <li><strong>Step 3:</strong> Follow the doctor’s treatment plan.</li>
            <li><strong>Step 4:</strong> Inform your partner(s) to prevent spread.</li>
          </ul>
        </div>


                </div>

      </div>
    



      

      <div className="container mx-auto p-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-purple-800 mb-8 text-center">
        Cervical Cancer & HPV Vaccine Awareness
      </h1>

      {/* Two-Column Layout */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Left Column - Text Content */}
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full md:w-3/5">
          {/* Understanding Cervical Cancer */}
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            Understanding Cervical Cancer
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Cervical cancer occurs in the <strong>cervix</strong>, the lower part of the uterus. It is primarily caused by 
            <strong> persistent HPV (Human Papillomavirus) infection</strong>. Regular screening and early detection significantly improve treatment outcomes.
          </p>

          {/* Development Stages */}
          <h3 className="text-lg font-bold text-purple-700 mt-4">
            Early Development Stages
          </h3>
          <ul className="text-gray-600 text-sm mb-4 list-disc pl-5">
            <li><strong>Stage 1:</strong> HPV infection begins in cervical cells.</li>
            <li><strong>Stage 2:</strong> Abnormal cell changes (precancerous stage).</li>
            <li><strong>Stage 3:</strong> Cancerous transformation over time.</li>
          </ul>

          {/* Symptoms */}
          <h3 className="text-lg font-bold text-purple-700 mt-4">
            Common Symptoms
          </h3>
          <ul className="text-gray-600 text-sm mb-4 list-disc pl-5">
            <li>Unusual vaginal bleeding (after sex, between periods).</li>
            <li>Persistent pelvic pain or lower back pain.</li>
            <li>Pain during urination.</li>
            <li>Foul-smelling or unusual vaginal discharge.</li>
          </ul>

          {/* HPV Vaccine Awareness */}
          <h2 className="text-2xl font-bold text-purple-700 mt-6 mb-4">
            Importance of the HPV Vaccine
          </h2>
          <ul className="text-gray-600 text-sm mb-4 list-disc pl-5">
            <li><strong>Prevents HPV Infection:</strong> Protects against HPV 16 & 18, reducing cancer risk by 70%.</li>
            <li><strong>Reduces Other HPV-Related Cancers:</strong> Also prevents vaginal, vulvar, anal, and throat cancers.</li>
            <li><strong>Best When Given Early:</strong> Recommended for girls and boys aged 9-14 but beneficial up to 26 years.</li>
            <li><strong>Long-Lasting Protection:</strong> Builds strong immunity and reduces the need for invasive treatments.</li>
            <li><strong>Safe & WHO-Approved:</strong> Clinically tested and widely recommended worldwide.</li>
          </ul>

          {/* Prevention */}
          <h3 className="text-lg font-bold text-purple-700 mt-4">
            Prevention & Risk Reduction
          </h3>
          <ul className="text-gray-600 text-sm mb-4 list-disc pl-5">
            <li>Get the <strong>HPV vaccination</strong> at an early age.</li>
            <li>Undergo <strong>regular Pap smear & HPV testing</strong> for early detection.</li>
            <li>Practice <strong>safe sexual health</strong> (use protection, limit multiple partners).</li>
            <li>Maintain a <strong>healthy lifestyle</strong> (quit smoking, eat nutrient-rich foods).</li>
          </ul>
        </div>

        {/* Right Column - Small Image */}
        <div className="w-full md:w-2/5 flex justify-center">
          <img 
            src="/images/cancer.jpg" 
            alt="Cervical Cancer Awareness" 
            className="rounded-lg w-2/3 md:w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Call to Action */}
      <p className="text-purple-800 font-semibold mt-8 text-center">
        💉 Get vaccinated today and take a proactive step towards cervical cancer prevention!
      </p>
    </div>



    
    </div>
  );
};

export default SexualHealth;