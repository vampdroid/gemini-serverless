
export default async function handler(req, res) {
	// Set CORS headers
	const allowedOrigins = ['http://localhost:4321', 'https://yashkukreja.com'];
	const origin = req.headers.origin;

	if (allowedOrigins.includes(origin)) {
		res.setHeader('Access-Control-Allow-Origin', origin);
	}

	res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Only POST, OPTIONS allowed' });
	}

	const { prompt } = req.body || "Default prompt";
	const apiKey = process.env.GEMINI_API_KEY;
	const systemInstruction = process.env.GEMINI_SYSTEM_INSTRUCTION;

	const geminiRes = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(
				{
					contents: [
						{ parts: 
							[{ text: prompt }] 
						}
					],
					systemInstruction: {
						parts: [
							{
							text: systemInstruction,
							}
						]
					},
				}
			),
		}
	);

	const data = await geminiRes.json();
	res.status(geminiRes.ok ? 200 : 500).json(data);
}
