import React, { useState, useCallback, useEffect } from 'react';
import SwitchBox from './SwitchBox';
import MatrixChat from './MatrixChat';
import ResizeHandle from './ResizeHandle';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function FrameLayout() {
  const [leftWidth, setLeftWidth] = useState(66);
  const [topHeight, setTopHeight] = useState(50);
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
  const [isResizingVertical, setIsResizingVertical] = useState(false);
  const [isBottomFrameMaximized, setIsBottomFrameMaximized] = useState(false);
  const [previousLayout, setPreviousLayout] = useState({ leftWidth: 66, topHeight: 50 });

  const handleHorizontalResize = useCallback((e: MouseEvent) => {
    if (!isResizingHorizontal) return;
    
    const windowWidth = window.innerWidth;
    const percentage = (e.clientX / windowWidth) * 100;
    
    if (percentage >= 15 && percentage <= 85) {
      setLeftWidth(percentage);
    }
  }, [isResizingHorizontal]);

  const handleVerticalResize = useCallback((e: MouseEvent) => {
    if (!isResizingVertical) return;
    
    const container = document.querySelector('.left-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const relativeY = ((e.clientY - containerRect.top) / containerRect.height) * 100;
    
    if (relativeY >= 10 && relativeY <= 90) {
      setTopHeight(relativeY);
    }
  }, [isResizingVertical]);

  const handleMouseUp = useCallback(() => {
    setIsResizingHorizontal(false);
    setIsResizingVertical(false);
    document.body.classList.remove('select-none', 'resizing');
  }, []);

  const toggleMaximize = () => {
    if (!isBottomFrameMaximized) {
      setPreviousLayout({ leftWidth, topHeight });
      setLeftWidth(100);
      setTopHeight(0);
    } else {
      setLeftWidth(previousLayout.leftWidth);
      setTopHeight(previousLayout.topHeight);
    }
    setIsBottomFrameMaximized(!isBottomFrameMaximized);
  };

  useEffect(() => {
    if (isResizingHorizontal || isResizingVertical) {
      document.body.classList.add('select-none', 'resizing');
      
      const handleMouseMove = isResizingHorizontal ? handleHorizontalResize : handleVerticalResize;
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mouseleave', handleMouseUp);
        document.body.classList.remove('select-none', 'resizing');
      };
    }
  }, [isResizingHorizontal, isResizingVertical, handleHorizontalResize, handleVerticalResize, handleMouseUp]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div 
        style={{ width: `${leftWidth}%`, minWidth: '200px' }} 
        className="left-container flex flex-col relative"
      >
        {!isBottomFrameMaximized && (
          <>
            <div 
              style={{ height: `${topHeight}%`, minHeight: '100px' }} 
              className="bg-white overflow-hidden border-r border-gray-200"
            >
              <SwitchBox />
            </div>

            <div
              className="w-full h-1 bg-gray-200 hover:bg-indigo-400 cursor-row-resize resize-handle"
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizingVertical(true);
              }}
            />
          </>
        )}

        <div 
          style={{ height: isBottomFrameMaximized ? '100%' : `${100 - topHeight}%`, minHeight: '100px' }}
          className="bg-white overflow-hidden border-r border-gray-200 relative"
        >
          <button
            onClick={toggleMaximize}
            className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isBottomFrameMaximized ? (
              <Minimize2 className="h-4 w-4 text-gray-600" />
            ) : (
              <Maximize2 className="h-4 w-4 text-gray-600" />
            )}
          </button>
          <iframe
            src="/pages/page2.html"
            className="w-full h-full border-0"
            title="Bottom Frame"
          />
        </div>
      </div>

      {!isBottomFrameMaximized && (
        <>
          <ResizeHandle
            orientation="horizontal"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizingHorizontal(true);
            }}
            className="w-1 hover:w-2 transition-all resize-handle"
          />
          
          <div 
            style={{ width: `${100 - leftWidth}%`, minWidth: '200px' }}
            className="bg-white overflow-hidden"
          >
            <MatrixChat />
          </div>
        </>
      )}
    </div>
  );
}