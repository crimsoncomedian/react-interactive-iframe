import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

const CorrelationExplorer = () => {
  const [correlation, setCorrelation] = useState(0.5);
  const [inputValue, setInputValue] = useState("0.5");
  const [data, setData] = useState([]);
  const [regressionLine, setRegressionLine] = useState([]);

  const generateData = (correlation, n = 50) => {
    const result = [];
    for (let i = 0; i < n; i++) {
      const x = Math.random();
      const yMean = correlation * x + (1 - Math.abs(correlation)) * 0.5;
      const yStd = Math.sqrt(1 - correlation * correlation);
      const y = yMean + yStd * (Math.random() + Math.random() + Math.random() - 1.5) / 2.1;
      result.push({ x: x * 100, y: y * 100 });
    }
    return result;
  };

  const calculateRegressionLine = (data) => {
    const n = data.length;
    const sumX = data.reduce((sum, point) => sum + point.x, 0);
    const sumY = data.reduce((sum, point) => sum + point.y, 0);
    const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return [
      { x: 0, y: intercept },
      { x: 100, y: slope * 100 + intercept }
    ];
  };

  useEffect(() => {
    const newData = generateData(correlation);
    setData(newData);
    setRegressionLine(calculateRegressionLine(newData));
  }, [correlation]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      let value = parseFloat(inputValue);
      if (isNaN(value)) {
        value = 0;
      } else {
        if (value < -1) {
          value = -1;
        } else if (value > 1) {
          value = 1;
        }
      }
      value = Math.round(value * 100) / 100; // Round to 2 decimal places
      setCorrelation(value);
      setInputValue(value.toString());
    }
  };

  const getCorrelationDescription = (corr) => {
    if (corr === 0) return "No correlation";
    if (corr > 0.7) return "Strong positive correlation";
    if (corr > 0.3) return "Moderate positive correlation";
    if (corr > 0) return "Weak positive correlation";
    if (corr < -0.7) return "Strong negative correlation";
    if (corr < -0.3) return "Moderate negative correlation";
    return "Weak negative correlation";
  };

  return (
    <div className="p-8 bg-transparent rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-800">Correlation Coefficient Explorer</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">What is Correlation Coefficient?</h2>
        <p className="text-gray-700 mb-4">
          The correlation coefficient measures the strength and direction of the relationship between two variables. 
          It ranges from -1 to 1, where:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>1 indicates a perfect positive correlation</li>
          <li>0 indicates no correlation</li>
          <li>-1 indicates a perfect negative correlation</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-xl font-medium text-indigo-700" htmlFor="correlation-input">
            Set Correlation Coefficient:
          </label>
          <div className="flex items-center">
            <input
              id="correlation-input"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-20 px-2 py-1 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500 text-center text-lg"
            />
            <span className="ml-4 text-lg font-semibold text-indigo-600">
              {getCorrelationDescription(correlation)}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Enter a value between -1 and 1, then press Enter to update the chart.
        </p>
        <div className="mb-8">
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#a0aec0" />
              <XAxis type="number" dataKey="x" name="Variable X" unit="%" stroke="#4a5568" />
              <YAxis type="number" dataKey="y" name="Variable Y" unit="%" stroke="#4a5568" />
              <ZAxis type="number" range={[20]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter 
                name="Data Points" 
                data={data} 
                fill="#7C3AED"
                cursor="pointer"
              />
              <Line 
                type="linear" 
                dataKey="y" 
                data={regressionLine} 
                stroke="#EF4444" 
                strokeWidth={2} 
                dot={false}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Interpreting the Chart</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Each blue dot represents a data point.</li>
          <li>The red line is the best-fit line (regression line) for the data.</li>
          <li>A steeper line indicates a stronger correlation.</li>
          <li>Dots clustered closely around the line suggest a stronger correlation.</li>
        </ul>
      </div>

      <style jsx global>{`
        .recharts-scatter-symbol {
          transition: fill 0.3s ease;
        }
        .recharts-scatter-symbol:hover {
          fill: #5B21B6;
          filter: brightness(1.2);
        }
      `}</style>
    </div>
  );
};

export default CorrelationExplorer;
