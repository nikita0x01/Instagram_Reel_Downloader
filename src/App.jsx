import React from 'react';
import ReelDownloader from './components/ReelDownloader.jsx';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Instagram Reel Downloader
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Paste any public Instagram reel link and instantly save the video in high-quality MP4 to your
              device. Perfect for backing up your own content or saving reels for offline viewing.
            </p>
          </div>
          <div className="text-xs text-slate-400 text-right">
            <p className="font-medium text-slate-200">Developed by Nikita Satpute</p>
            <p className="text-slate-500">Personal project · Educational use only</p>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="w-full max-w-4xl">
            <div className="gradient-border rounded-3xl bg-slate-950/80 shadow-xl shadow-fuchsia-500/20 backdrop-blur-xl">
              <div className="rounded-3xl bg-gradient-to-br from-insta-pink via-insta-purple to-insta-yellow p-[1px]">
                <div className="rounded-[1.4rem] bg-slate-950/95 p-6 sm:p-8">
                  <ReelDownloader />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>
            © {new Date().getFullYear()} Nikita Satpute. All rights reserved.
          </span>
          <span className="text-slate-600 text-center sm:text-right">
            This tool is intended for downloading your own or publicly shared reels for personal use only.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
