import React from 'react';

export default function Navbar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'report', label: 'Report Scam' },
    { id: 'about', label: 'About' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setCurrentPage('home')}>
          <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400 filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Scam<span className="text-indigo-600 dark:text-indigo-400">Shield</span>
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                currentPage === item.id 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/50'
              }`}
              onClick={() => setCurrentPage(item.id)}
            >
              {item.label}
              {currentPage === item.id && (
                <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

