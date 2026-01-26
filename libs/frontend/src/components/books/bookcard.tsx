'use client';
import { useState } from 'react';

export function BookCard() {
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
      <h1>Welcome to BookCard!</h1>
    </div>
  );
}
