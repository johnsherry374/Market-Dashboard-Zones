
import React, { useEffect, useState } from 'react';

const calculateZoneStatus = (price, high, low) => {
  const range = high - low;
  const topZone = high - 0.1 * range;
  const bottomZone = low + 0.1 * range;
  if (price >= topZone) return 'Sell Zone';
  if (price <= bottomZone) return 'Buy Zone';
  return 'Neutral';
};

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/prices');
        const json = await res.json();
        const results = json.map((item) => {
          const status = calculateZoneStatus(item.current, item.high, item.low);
          return { ...item, status };
        });
        setData(results);
      } catch (err) {
        console.error('Failed to fetch prices', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ textAlign: 'center' }}>Market Zone Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {data.map(({ symbol, high, low, current, status }) => (
          <div key={symbol} style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h2>{symbol}</h2>
            <p>High: {high.toFixed(2)}</p>
            <p>Low: {low.toFixed(2)}</p>
            <p>Current: {current.toFixed(2)}</p>
            <p>
              Status: <strong style={{ color: status === 'Buy Zone' ? 'green' : status === 'Sell Zone' ? 'red' : 'gray' }}>
                {status}
              </strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
