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

  const [prediction, setPrediction] = useState(null); // store predicted MPG
  const [error, setError] = useState(null); // store errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-3xl space-y-6"
      >
        <h2 className="text-2xl font-semibold text-red-700 text-center">
          Fuel Efficiency Predictor
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Cylinders", name: "cylinders" },
            { label: "Displacement", name: "displacement" },
            { label: "Horsepower", name: "horsepower" },
            { label: "Weight", name: "weight" },
            { label: "Acceleration", name: "acceleration" },
            { label: "Model Year", name: "model_year" },
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
          className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Predict MPG
        </button>
      </form>

      {/* Display Prediction */}
      {prediction && (
        <div className="mt-6 text-center text-xl font-semibold text-red-800">
          Predicted MPG: {prediction.toFixed(2)}
        </div>
      )}

      {/* Display Error */}
      {error && (
        <div className="mt-6 text-center text-red-700 font-medium">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default Home;
