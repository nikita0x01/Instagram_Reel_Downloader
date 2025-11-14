import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { downloadReel } from '../api/download.js';

const PLACEHOLDER_URL = 'https://www.instagram.com/reel/EXAMPLE_ID/';

const isValidInstagramUrl = (url) => {
  try {
    const u = new URL(url);
    return (
      ['www.instagram.com', 'instagram.com'].includes(u.hostname) &&
      (u.pathname.startsWith('/reel/') || u.pathname.startsWith('/p/') || u.pathname.startsWith('/tv/'))
    );
  } catch {
    return false;
  }
};

const STORAGE_KEY = 'reel_download_history_v1';

const ReelDownloader = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const handleDownload = async () => {
    console.log('Download button clicked');

    if (!url.trim()) {
      toast.error('Please paste a Reel URL first.');
      return;
    }

    if (!isValidInstagramUrl(url.trim())) {
      toast.error('Please enter a valid public Instagram Reel URL.');
      return;
    }

    toast.loading('Preparing download...', { id: 'reel-download' });
    setIsLoading(true);
    try {
      const filename = await downloadReel(url.trim());
      toast.success('Download started!', { id: 'reel-download' });

      const thumb = url.includes('/reel/') || url.includes('/p/') || url.includes('/tv/')
        ? `${url.split('?')[0]}media/?size=m`
        : null;

      const newItem = {
        id: Date.now(),
        url: url.trim(),
        filename,
        thumbnail: thumb,
        createdAt: new Date().toISOString(),
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev];
        return updated.slice(0, 3);
      });
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to download reel. It may be private, invalid, or Instagram blocked the request.';
      toast.error(message, { id: 'reel-download' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    toast('Input cleared');
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-insta-pink via-insta-purple to-insta-yellow text-white text-xl font-bold shadow-lg shadow-fuchsia-500/40">
              IG
            </span>
            <span>Reel Downloader</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Paste a public Instagram Reel URL and download it in the best available MP4 quality.
          </p>
        </div>
      </header>

      <div className="space-y-4">
        <label className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          Reel URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={PLACEHOLDER_URL}
              className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 pr-24 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 focus:outline-none focus:ring-2 focus:ring-insta-pink/80 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-1 right-1 rounded-2xl bg-slate-800/80 px-3 text-xs font-medium text-slate-300 hover:bg-slate-700/90 active:scale-95 transition-transform"
            >
              Clear
            </button>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-insta-pink via-insta-purple to-insta-yellow px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/40 hover:brightness-110 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Downloading...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-4 w-4 border-[2px] border-white/80 border-l-transparent rounded-full" />
                Download MP4
              </span>
            )}
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Make sure the reel is public and accessible without login. Private reels or region-locked content
          cannot be downloaded.
        </p>
      </div>

      {history.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Recent Downloads
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {history.map((item) => (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-inner shadow-black/40"
              >
                <div className="aspect-[9/16] w-full bg-slate-900 relative overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt="Reel thumbnail"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[11px] text-slate-500">
                      No preview
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-100">
                    <span className="truncate max-w-[60%]">{item.filename}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        toast.success('Reel URL copied');
                      }}
                      className="px-2 py-0.5 rounded-full bg-slate-900/90 text-[10px] font-medium border border-white/10"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className="pt-2 border-t border-slate-800/80 mt-4 flex flex-col sm:flex-row gap-2 items-center justify-between text-[11px] text-slate-500">
        <span>Built for educational and personal backup use only.</span>
        <span className="text-slate-600">Respect Instagrams terms of service and creators rights.</span>
      </footer>
    </div>
  );
};

export default ReelDownloader;
