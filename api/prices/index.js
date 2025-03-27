import fetch from 'node-fetch';

const symbols = [
    { symbol: 'XAU/USD', code: 'XAU/USD' },
    { symbol: 'XAG/USD', code: 'XAG/USD' },
    // Add more symbols as needed
];

const apiKey = process.env.TWELVE_API_KEY;

export default async function handler(req, res) {
  try {
    const results = await Promise.all(
      symbols.map(async ({ symbol, code }) => {
        const response = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${code}&interval=1h&apikey=${apiKey}`
        );
        const json = await response.json();
        const values = json.values || [];
        const highs = values.map(v => parseFloat(v.high));
        const lows = values.map(v => parseFloat(v.low));
        const high = Math.max(...highs);
        const low = Math.min(...lows);
        const current = parseFloat(values[0].close);
        return { symbol, high, low, current };
      })
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data.' });
  }
}
