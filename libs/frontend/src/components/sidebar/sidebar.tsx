'use client';
import { useState } from 'react';

export function Sidebar() {
  const [a, seta] = useState(0);
  return (
    <div>
      <button
        onClick={() => {
          seta((p) => ++p);
        }}
      >
        {a}
      </button>
      <h1>Welcome to Sidebar!</h1>
    </div>
  );
}
