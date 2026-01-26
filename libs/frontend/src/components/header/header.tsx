'use client';
import { useState } from 'react';

export function Header() {
  const [a, seta] = useState(0);
  return (
    <div>
      <button
        className="bg-black text-red-950 text-2xl "
        onClick={() => {
          seta((p) => ++p);
        }}
      >
        {a}
      </button>
      <h1>Welcome to Header!</h1>
    </div>
  );
}
