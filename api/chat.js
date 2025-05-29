
export default async function handler(req, res) {
	// Set CORS headers
	res.setHeader('Access-Control-Allow-Origin', 'https://yashkukreja.com');
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4321');
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Only POST allowed' });
	}

	const { prompt } = req.body || "Default prompt";
	const apiKey = process.env.GEMINI_API_KEY;

	const geminiRes = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
		}
	);

	const data = await geminiRes.json();
	res.status(geminiRes.ok ? 200 : 500).json(data);
}
