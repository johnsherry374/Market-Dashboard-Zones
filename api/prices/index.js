import fetch from 'node-fetch'; // Ensure you're importing correctly

export default async function handler(req, res) {
  const symbols = [
    { symbol: 'XAU/USD', code: 'XAU/USD' },
    { symbol: 'XAG/USD', code: 'XAG/USD' },
    { symbol: 'GBP/USD', code: 'GBP/USD' },
    { symbol: 'USD/CHF', code: 'USD/CHF' },
    { symbol: 'USD/JPY', code: 'USD/JPY' },
    { symbol: 'AUD/USD', code: 'AUD/USD' },
    { symbol: 'EUR/USD', code: 'EUR/USD' },
    { symbol: 'FTSE 100', code: 'UKX' },
    { symbol: 'S&P 500', code: 'SPX' },
  ];

  const apiKey = process.env.TWELVE_API_KEY;

  try {
    const results = await Promise.all(
      symbols.map(async ({ symbol, code }) => {
        const response = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${code}&interval=1h&apikey=${apiKey}`
        );

        const json = await response.json();
        const values = json.values || [];
        const highs = values.map((v) => parseFloat(v.high));
        const lows = values.map((v) => parseFloat(v.low));
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
