import React, { forwardRef } from 'react';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

const ResizeHandle = forwardRef<HTMLDivElement, ResizeHandleProps>(({ 
  onMouseDown, 
  orientation = 'horizontal',
  className = '',
  style = {}
}, ref) => {
  const isHorizontal = orientation === 'horizontal';
  
  return (
    <div
      ref={ref}
      className={`group relative ${isHorizontal ? 'cursor-col-resize' : 'cursor-row-resize'} ${className}`}
      onMouseDown={onMouseDown}
      style={style}
    >
      <div 
        className={`absolute bg-gray-200 group-hover:bg-indigo-400 group-active:bg-indigo-600
          ${isHorizontal 
            ? 'inset-y-0 w-1 left-1/2 -translate-x-1/2' 
            : 'inset-x-0 h-1 top-1/2 -translate-y-1/2'
          }`}
      />
    </div>
  );
});

ResizeHandle.displayName = 'ResizeHandle';

export default ResizeHandle;