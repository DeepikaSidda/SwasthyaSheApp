import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";




Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DietPlan = () => {
  const data = {
    labels: ["Underweight", "Normal weight", "Overweight", "Obese"],
    datasets: [
      {
        label: "Recommended Weight Gain (kg)",
        data: [15, 13.75, 9.25, 7],
        backgroundColor: ["#8e44ad", "#9b59b6", "#d2b4de", "#e8daef"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8"
    style={{
      backgroundImage: 'url("/images/home-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
    >
      {/* Cover Image */}
      <div className="w-full h-64 bg-cover bg-center rounded-xl shadow-lg mb-6" 
        style={{ backgroundImage: 'url("/images/food.jpg")' }}
      ></div>
      
      <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">Healthy Diet During Pregnancy</h1>
      
      <div className="container mx-auto grid md:grid-cols-2 gap-6">
        {/* Healthy Diet Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-4">During pregnancy, focus on consuming essential nutrients rather than increasing calorie intake. Key nutrients like iron and folate are crucial. Maintaining good food hygiene helps prevent infections like listeriosis and salmonella. Always consult a healthcare professional before taking supplements.</p>
        </div>
        
        {/* Importance Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-purple-700 mb-2">Importance of Healthy Weight Gain</h2>
          <ul className="list-disc list-inside">
            <li>Supports baby’s growth and development.</li>
            <li>Essential for maternal health and postpartum recovery.</li>
          </ul>
        </div>

        {/* Risks Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-purple-700 mb-2">Risks of Excess Weight Gain</h2>
          <ul className="list-disc list-inside">
            <li>Increases chances of gestational diabetes and high blood pressure.</li>
            <li>Can make it harder to lose weight after pregnancy.</li>
          </ul>
        </div>

        {/* Recommended Weight Gain */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-purple-700 mb-2">Recommended Weight Gain (Based on BMI)</h2>
          <ul className="list-disc list-inside">
            <li><b>Underweight (BMI &lt; 18.5)</b> → 12.5 - 18 kg</li>
            <li><b>Normal weight (BMI 18.5 - 24.9)</b> → 11.5 - 16 kg</li>
            <li><b>Overweight (BMI 25 - 29.9)</b> → 7 - 11.5 kg</li>
            <li><b>Obese (BMI ≥ 30)</b> → 5 - 9 kg</li>
          </ul>
        </div>
      </div>

      {/* Chart Section */}
      <div className="container mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-purple-700 mb-4 text-center">Weight Gain Chart</h3>
        <div className="w-full h-64">
          <Bar data={data} options={options} />
        </div>
      </div>

       {/* Healthy Eating for Pregnant Women */}
<div className="bg-white p-6 rounded-lg shadow-md mt-6">
  <h2 className="text-xl font-semibold text-purple-700">Healthy Eating for Pregnant Women</h2>
  
  <div className="text-gray-600 text-sm mb-4">
    <p className="text-gray-600 text-sm mb-4" >
      What you eat during pregnancy affects not only your own health and well-being but also the development of your baby. 
      There is substantial evidence that it can have a lasting impact on the health and well-being of your child later in life.
    </p>

    <p className="text-gray-600 text-sm mb-4">
      Choose a wide variety of healthy foods from the five food groups to meet both your and your baby’s nutritional needs 
      for optimal health and growth. While you may need to eat more of some foods to obtain key nutrients, there is no need to “eat for two.”
    </p>
    
    <h3 className="text-lg font-semibold text-purple-700 mt-4">What to Include in Your Pregnancy Diet:</h3>
    <ul className="list-disc list-inside">
      <li>A variety of fruits and vegetables of different types and colors—ideally 2 servings of fruit and 5 servings of vegetables per day.</li>
      <li>Increased intake of grain and cereal foods—about 8½ servings per day. Choose mostly wholegrain and high-fiber options.</li>
      <li>Iron-rich foods such as lean red meat or tofu—3½ servings of meat or meat alternatives are recommended.</li>
      <li>Calcium-enriched foods like milk, hard cheese, and yogurt—preferably reduced-fat varieties, with 2½ servings per day.</li>
      <li>Plenty of water to stay hydrated.</li>
      <li>Limited intake of foods and drinks high in saturated fat, added sugar, and salt.</li>
    </ul>
  </div>
</div>


      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-purple-700 text-white">
              <th className="border border-gray-300 p-2">Food Group</th>
              <th className="border border-gray-300 p-2">Serves per Day</th>
              <th className="border border-gray-300 p-2">Example Serving Size</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Vegetables and legumes/beans</td>
              <td className="border border-gray-300 p-2">5</td>
              <td className="border border-gray-300 p-2">½ cup cooked vegetables, 1 cup salad, ½ medium potato</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Fruits</td>
              <td className="border border-gray-300 p-2">2</td>
              <td className="border border-gray-300 p-2">1 medium fruit, 1 cup diced fruit</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Grain foods (wholegrain/high-fibre)</td>
              <td className="border border-gray-300 p-2">8½</td>
              <td className="border border-gray-300 p-2">1 slice bread, ½ cup cooked rice/pasta, 3 crispbreads</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Lean meats, poultry, fish, eggs, tofu, nuts, beans</td>
              <td className="border border-gray-300 p-2">3½</td>
              <td className="border border-gray-300 p-2">65g cooked lean meat, 2 eggs, 1 cup beans</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Milk, yoghurt, cheese (reduced fat)</td>
              <td className="border border-gray-300 p-2">2½</td>
              <td className="border border-gray-300 p-2">1 cup milk, 2 slices cheese, ¾ cup yoghurt</td>
            </tr>
          </tbody>
        </table>
      </div>
      <br></br>
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-purple-700 text-2xl font-bold text-center mb-6">
          Pregnancy Nutrition Guide
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Folic Acid Section */}
          <div className="bg-white p-3 rounded-lg shadow">
            <h2 className="text-purple-700 text-lg font-semibold mb-2">Folic Acid & Pregnancy</h2>
            <p className="text-sm">Folic acid (folate) is essential for preventing neural tube defects.</p>
            <p className="text-sm">Pregnant women should take 500 mcg daily and eat folate-rich foods.</p>
            <h3 className="text-purple-700 font-medium mt-2 text-sm">Excellent Sources:</h3>
            <ul className="list-disc pl-4 text-sm">
              <li>Asparagus</li>
              <li>Bran flakes</li>
              <li>Broccoli</li>
              <li>Brussels sprouts</li>
              <li>Chickpeas</li>
              <li>Dried beans</li>
              <li>Lentils</li>
              <li>Spinach</li>
            </ul>
          </div>

          {/* Iron Section */}
          <div className="bg-white p-3 rounded-lg shadow">
            <h2 className="text-purple-700 text-lg font-semibold mb-2">Iron & Pregnancy</h2>
            <p className="text-sm">Iron is vital for the baby's development and prevents anemia.</p>
            <p className="text-sm">Pregnant women need 27 mg of iron daily.</p>
            <h3 className="text-purple-700 font-medium mt-2 text-sm">Good Sources:</h3>
            <ul className="list-disc pl-4 text-sm">
              <li>Meat</li>
              <li>Chicken</li>
              <li>Seafood</li>
              <li>Dried beans & lentils</li>
              <li>Leafy greens</li>
            </ul>
          </div>

          {/* Iodine Section */}
          <div className="bg-white p-3 rounded-lg shadow">
            <h2 className="text-purple-700 text-lg font-semibold mb-2">Iodine & Pregnancy</h2>
            <p className="text-sm">Iodine is crucial for brain development.</p>
            <p className="text-sm">Pregnant women should take 150 mcg daily.</p>
            <h3 className="text-purple-700 font-medium mt-2 text-sm">Sources:</h3>
            <ul className="list-disc pl-4 text-sm">
              <li>Seafood</li>
              <li>Seaweed</li>
              <li>Eggs</li>
              <li>Meat</li>
              <li>Dairy</li>
            </ul>
          </div>

          {/* Vitamin D Section */}
          <div className="bg-white p-3 rounded-lg shadow">
            <h2 className="text-purple-700 text-lg font-semibold mb-2">Vitamin D & Pregnancy</h2>
            <p className="text-sm">Vitamin D is important for bone health.</p>
            <p className="text-sm">The sun is the best source, but foods like eggs, oily fish, and fortified milk help.</p>
          </div>

          {/* Other Sections */}
          <div className="bg-white p-3 rounded-lg shadow">
            <h2 className="text-purple-700 text-lg font-semibold mb-2">Multivitamins & Calcium</h2>
            <p className="text-sm">Multivitamins are helpful for some pregnant women, like vegans or teenagers.</p>
            <p className="text-sm">Extra calcium isn't needed, but dairy and fortified soy milk are good sources.</p>
          </div>

          <div className="bg-white p-3 rounded-lg shadow">
            <h2 className="text-purple-700 text-lg font-semibold mb-2">Dieting & Pregnancy</h2>
            <p className="text-sm">Crash dieting is harmful. Proper nutrition is crucial for both mother and baby.</p>
          </div>

          <div className="bg-white p-3 rounded-lg shadow">
            <h2 className="text-purple-700 text-lg font-semibold mb-2">Common Pregnancy Issues</h2>
            <h3 className="text-purple-700 font-medium text-sm">Constipation:</h3>
            <p className="text-sm">Eat fiber-rich foods and drink plenty of water.</p>
            <h3 className="text-purple-700 font-medium mt-2 text-sm">Nausea:</h3>
            <p className="text-sm">Try dry biscuits in the morning and avoid greasy foods.</p>
            <h3 className="text-purple-700 font-medium mt-2 text-sm">Heartburn:</h3>
            <p className="text-sm">Eat small meals and avoid late-night eating.</p>
          </div>
          {/* Video Section */}
          <div className="mt-4 w-full">
  <iframe
    className="w-full h-64 rounded-lg"
    src="https://www.youtube.com/embed/YoSuVws4OTQ"
    title="Stress Management Video 1"
    frameBorder="0"
    allowFullScreen
  ></iframe>
</div>


        </div>
        

        
      </div>
      <br></br>
      <section className="mb-12 flex flex-col lg:flex-row items-start gap-8">
      {/* Text Content */}
      <div className="lg:w-2/3">
        <h2 className="text-2xl font-semibold text-purple-700 mb-6">
          Ayurvedic Pregnancy Care – Principles, Diet, Lifestyle & Remedies
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* Principles of Ayurveda for Pregnancy */}
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-medium mb-2">Ayurvedic Principles for a Healthy Pregnancy</h3>
            <p className="text-gray-600">
              Pregnancy affects Vata, Pitta, and Kapha energies. Ayurveda restores balance through diet,
              lifestyle, and self-care to ensure a healthy pregnancy and fetal development.
            </p>
          </div>
          
          
          {/* Ayurvedic Diet for Pregnancy */}
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-medium mb-2">Ayurvedic Diet for Pregnancy</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Eat warm, cooked foods like rice, ghee, milk, and turmeric.</li>
              <li>Avoid raw foods, caffeine, and processed sugars as they disrupt doshas.</li>
              <li>Drink 8-10 glasses of water daily for hydration.</li>
            </ul>
          </div>

          {/* Lifestyle Recommendations */}
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-medium mb-2">Lifestyle Recommendations</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Take short breaks and naps for extra rest.</li>
              <li>Engage in light exercise like walking, prenatal yoga, or swimming.</li>
              <li>Reduce stress through meditation, prayer, and breathwork.</li>
              <li>Practice Abhyanga (self-massage) with warm sesame oil for circulation and relaxation.</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-medium mb-2">Things to Avoid</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Smoking, alcohol, carbonated drinks.</li>
              <li>Heavy, acidic, or processed foods.</li>
              <li>Strenuous activities and lifting heavy objects.</li>
            </ul>
          </div>
          
          
        </div>
        
      </div>
      

      {/* Image Section */}
      <div className="lg:w-1/3">
        <img 
          src="/images/preherb.jpg" 
          alt="Ayurvedic Pregnancy Care" 
          className="w-full h-auto rounded-lg shadow-md" 
        />
        
        {/* Additional Content Below Image */}
        <div className="mt-6 bg-purple-50 p-4 rounded shadow-md">
          <h3 className="font-medium mb-2">Best Time to Conceive (According to Ayurveda)</h3>
          <p className="text-gray-600">
            The best time for conception is during ovulation (around day 14 of the menstrual cycle, but varies per person).
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li>Cervical mucus becomes clear and stretchy.</li>
            <li>Basal body temperature increases slightly.</li>
            <li>Mild cramps or twinges (Mittelschmerz).</li>
            <li>Positive ovulation test (LH surge).</li>
          </ul>
        </div>
      </div>
    </section>
      
    </div>
      
      
      
    

      
    
  );
};


export default DietPlan;