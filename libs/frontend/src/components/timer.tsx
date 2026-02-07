'use client';
import { useEffect, useState } from 'react';

// use in client component to use useComplete
export function Timer({
  till,
  onCompelete,
}: {
  till: number;
  onCompelete?: () => void;
}) {
  const milltosec = (time: number) => Math.floor(time / 1000);

  const [remaining, setRemaining] = useState(() =>
    Math.floor(Math.max(0, milltosec(till - Date.now())) / 1000),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(() => {
        const next = Math.max(0, milltosec(till - Date.now()));
        if (next === 0) {
          clearInterval(id);
          onCompelete && onCompelete();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [till, milltosec]);

  return <div>{remaining}</div>;
}
