import axios from 'axios';

export async function downloadReel(reelUrl) {
  const response = await axios.post(
    '/api/download',
    { url: reelUrl },
    {
      responseType: 'blob',
    }
  );

  const timestamp = Date.now();
  const filename = `reel_${timestamp}.mp4`;

  const blob = new Blob([response.data], { type: 'video/mp4' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);

  return filename;
}
