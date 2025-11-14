import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
  const { url } = req.body || {};

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid URL.' });
  }

  try {
    const targetUrl = url.split('?')[0] + '?__a=1&__d=dis';

    const metaResp = await axios.get(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const data = metaResp.data;
    let videoUrl = null;

    if (data?.items?.[0]?.video_versions?.[0]?.url) {
      videoUrl = data.items[0].video_versions[0].url;
    } else if (data?.graphql?.shortcode_media?.video_url) {
      videoUrl = data.graphql.shortcode_media.video_url;
    }

    if (!videoUrl) {
      return res.status(404).json({
        error: 'Could not find video URL. Reel may be private, unavailable, or Instagram changed their API.',
      });
    }

    const videoResp = await axios.get(videoUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://www.instagram.com/',
      },
    });

    const timestamp = Date.now();
    const filename = `reel_${timestamp}.mp4`;

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    videoResp.data.pipe(res);
  } catch (err) {
    console.error('Download error:', err?.response?.status, err?.response?.data || err.message);

    if (err?.response?.status === 404) {
      return res.status(404).json({ error: 'Reel not found or is private.' });
    }

    return res.status(500).json({
      error: 'Failed to fetch reel from Instagram. It might be private, blocked, or Instagram updated their API.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
