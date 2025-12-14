import React from 'react';
import clsx from 'clsx';

interface KeyProps {
  type: 'white' | 'black';
  active: boolean;
  label: string;
  note: string; // Used for rendering if we want
  onMouseDown: () => void;
  onMouseUp: () => void;
}

export const Key: React.FC<KeyProps> = ({ type, active, label, note, onMouseDown, onMouseUp }) => {
  const isWhite = type === 'white';
  
  return (
    <div
      className={clsx(
        'relative flex items-end justify-center select-none cursor-pointer transition-all duration-75',
        isWhite 
          ? 'w-10 sm:w-12 md:w-14 h-40 sm:h-56 md:h-64 bg-white rounded-b-[4px] shadow-[inset_0_-5px_10px_rgba(0,0,0,0.1),0_2px_5px_rgba(0,0,0,0.3)] z-0' 
          : 'w-6 sm:w-8 md:w-10 h-24 sm:h-36 md:h-40 bg-[#111] rounded-b-[4px] -mx-[1.25rem] z-10 shadow-[2px_4px_8px_rgba(0,0,0,0.6),inset_0_-5px_10px_rgba(255,255,255,0.05)] border-x border-t border-[#333]',
        active && isWhite && '!bg-gray-200 !shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] scale-y-[0.99] origin-top',
        active && !isWhite && '!bg-black !border-[#111] scale-y-[0.99] origin-top shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]',
        'hover:brightness-[0.98]',
        // Separator lines for white keys
        isWhite && 'border-r border-gray-300 last:border-r-0'
      )}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={(e) => { e.preventDefault(); onMouseDown(); }}
      onTouchEnd={(e) => { e.preventDefault(); onMouseUp(); }}
    >
      {/* Label on the key */}
      <div className={clsx(
          "absolute pointer-events-none text-[8px] sm:text-[10px] uppercase font-bold tracking-wider opacity-60",
          isWhite ? "bottom-4 text-gray-400" : "bottom-3 text-white/40"
      )}>
          {label}
      </div>

       {/* Note name hint (optional, subtle) */}
       {isWhite && (
           <div className="absolute bottom-1 pointer-events-none text-[6px] text-gray-300 font-mono opacity-0 hover:opacity-100 transition-opacity">
               {note}
           </div>
       )}
    </div>
  );
};
