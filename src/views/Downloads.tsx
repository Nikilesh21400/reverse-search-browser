import React, { useState } from 'react';

const Downloads = () => {
  const [downloads, setDownloads] = useState([
    { file: 'sample.pdf', status: 'completed' },
    { file: 'video.mp4', status: 'in progress' },
  ]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Downloads</h2>
      <ul className="space-y-2">
        {downloads.map((d, idx) => (
          <li key={idx} className="border p-2 rounded flex justify-between">
            <span>{d.file}</span>
            <span className={d.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
              {d.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Downloads;
