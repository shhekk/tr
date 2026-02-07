import { ReactNode } from 'react';

export default function ({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-h-screen bg-black">
      <div className="w-full h-full absolute bg-amber-400 -z-10">
        <div className="boxxed top-0 bottom-0 w-xl h-58 bg-[green] ">
          {children}
        </div>
      </div>
    </div>
  );
}
