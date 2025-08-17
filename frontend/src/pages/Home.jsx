import { useState } from "react";

const Home = () => {
  const [formData, setFormData] = useState({
    cylinders: "",
    displacement: "",
    horsepower: "",
    weight: "",
    acceleration: "",
    model_year: "",
    origin: "1",
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    const boundedData = {
      cylinders: Math.min(12, Math.max(3, Number(formData.cylinders))),
      displacement: Math.min(500, Math.max(50, Number(formData.displacement))),
      horsepower: Math.min(500, Math.max(50, Number(formData.horsepower))),
      weight: Math.min(6000, Math.max(1500, Number(formData.weight))),
      acceleration: Math.min(30, Math.max(5, Number(formData.acceleration))),
      model_year: Math.min(new Date().getFullYear(), Math.max(1970, Number(formData.model_year))),
      origin: Number(formData.origin),
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(boundedData),
      });
      const data = await response.json();

      if (data.predicted_mpg !== undefined) {
        setPrediction(data.predicted_mpg);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to get prediction. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-red-700 text-white py-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">Fuel Efficiency Predictor</h1>
        <p className="text-center mt-2 text-sm sm:text-base">
          Estimate your car's MPG by entering key specifications.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl space-y-6"
        >
          <h2 className="text-2xl font-semibold text-red-700 text-center">
            Enter Car Specifications
          </h2>
          <p className="text-center text-gray-500 text-sm">
            All fields are required. Please use realistic values.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Cylinders", name: "cylinders", min: 3, max: 12 },
              { label: "Displacement (cu.in.)", name: "displacement", min: 50, max: 500 },
              { label: "Horsepower", name: "horsepower", min: 50, max: 500 },
              { label: "Weight (lbs)", name: "weight", min: 1500, max: 6000 },
              { label: "Acceleration (0-60 mph sec)", name: "acceleration", min: 5, max: 30 },
              { label: "Model Year", name: "model_year", min: 1970, max: new Date().getFullYear() },
            ].map((field) => (
              <div className="flex flex-col" key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-1 font-medium text-red-700"
                >
                  {field.label}
                </label>
                <input
                  type="number"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  min={field.min}
                  max={field.max}
                  className="border border-red-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
            ))}

            {/* Origin */}
            <div className="flex flex-col">
              <label htmlFor="origin" className="mb-1 font-medium text-red-700">
                Origin
              </label>
              <select
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
                className="border border-red-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="1">USA</option>
                <option value="2">Europe</option>
                <option value="3">Japan</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Predict MPG
          </button>
        </form>

        {/* Prediction / Error */}
        {prediction && (
          <div className="mt-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg w-full max-w-3xl text-center">
            <p className="text-lg text-green-800 font-semibold">
              Predicted MPG: {prediction.toFixed(2)}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg w-full max-w-3xl text-center">
            <p className="text-lg text-red-700 font-medium">Error: {error}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-red-700 text-white py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Fuel Efficiency Predictor. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
