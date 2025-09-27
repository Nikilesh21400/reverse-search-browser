import React, { useState, useEffect } from 'react';

const ShortcutsHelp = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-lg font-bold mb-4">🔧 Keyboard Shortcuts</h2>
        <ul className="space-y-2 text-sm">
          <li>⌨️ <b>Ctrl + T</b> → New Tab</li>
          <li>⌨️ <b>Ctrl + W</b> → Close Current Tab</li>
          <li>⌨️ <b>Ctrl + R</b> → Reload Current Tab</li>
          <li>⌨️ <b>Ctrl + 1–9</b> → Switch to Tab by Index</li>
          <li>⌨️ <b>Ctrl + Z</b> → Toggle Zen Mode</li>
          <li>⌨️ <b>Ctrl + I</b> → Toggle Incognito Mode</li>
          <li>⌨️ <b>Ctrl + K</b> → Open Omnibox Search</li>
          <li>⌨️ <b>Escape</b> → Close Overlays</li>
        </ul>
        <div className="text-right mt-4">
          <button onClick={onClose} className="bg-blue-500 text-white px-4 py-1 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsHelp;
