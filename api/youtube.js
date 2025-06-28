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

	const maxResults = parseInt(req.query.maxResults) || 4;

	const channelId = process.env.YOUTUBE_CHANNEL_ID;
	const apiKey = process.env.YOUTUBE_API_KEY;
	const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;

	try {
		const response = await fetch(apiUrl);

	    console.log("API Key: ", apiKey ? "Loaded" : "Missing");
		console.log("Channel ID: ", channelId);
		if (!response.ok) {
			throw new Error(reponse);
		}
		const data = await response.json();
		const videos = data.items;

		res.status(200).json( 
			videos.map(video => ({
				id: video.id.videoId,
				title: video.snippet.title,
				description: video.snippet.description,
				thumbnail: video.snippet.thumbnails.default.url,
				publishedAt: video.snippet.publishedAt
			}))
		);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
