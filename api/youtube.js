// Create a api for the above code snippet. Take ref from the chat.js file above.
export default async function handler(req, res) {
	// Set CORS headers
	const allowedOrigins = ['http://localhost:4321', 'https://yashkukreja.com'];
	const origin = req.headers.origin;

	if (allowedOrigins.includes(origin)) {
		res.setHeader('Access-Control-Allow-Origin', origin);
	}

	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Only GET, OPTIONS allowed' });
	}

	const channelId = process.env.YOUTUTBE_CHANNEL_ID;
	const apiKey = process.env.YOUTUBE_API_KEY;
	const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5`;

	try {
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		const video = data.items[0];
		const videoId = video.id.videoId;
		const title = video.snippet.title;
		const thumbnail = video.snippet.thumbnails.high.url;

		res.status(200).json({ videoId, title, thumbnail });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
