import React, { useState, useEffect } from 'react';

const SplitView = ({ leftPanel, centerPanel, rightPanel }) => {
  const [leftWidth, setLeftWidth] = useState(() => {
    const savedWidth = localStorage.getItem('aiBuilderLeftWidth');
    return savedWidth ? parseInt(savedWidth, 10) : 350;
  });
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      // Restrict dragging between 280px and 50% of the screen width
      const newWidth = Math.min(Math.max(e.clientX, 280), window.innerWidth * 0.5);
      setLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      // Save to localStorage when dragging stops
      window.addEventListener('mouseup', () => {
        localStorage.setItem('aiBuilderLeftWidth', leftWidth.toString());
      }, { once: true });
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={`flex h-screen w-full overflow-hidden bg-[#000000] text-white ${isDragging ? 'select-none cursor-col-resize' : ''}`}>
      {/* Left Panel - Chat */}
      <div 
        style={{ width: `${leftWidth}px` }} 
        className="shrink-0 bg-[#09090b] flex flex-col relative z-20"
      >
        {leftPanel}
      </div>

      {/* Resizer Handle */}
      <div 
        onMouseDown={() => setIsDragging(true)}
        onDoubleClick={() => {
          setLeftWidth(350);
          localStorage.setItem('aiBuilderLeftWidth', '350');
        }}
        className="w-1.5 hover:w-2 bg-white/5 border-r border-white/10 hover:bg-blue-500/50 cursor-col-resize flex items-center justify-center shrink-0 z-30 transition-all group relative"
        title="Drag to resize, double-click to reset"
      >
        <div className="absolute flex items-center justify-center h-8 w-5 bg-gray-800 border border-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          <span className="text-[10px] text-gray-300">◀▶</span>
        </div>
      </div>

      {/* Center Panel - Live Preview */}
      <div className={`flex-1 bg-[#121212] flex flex-col relative overflow-hidden z-10 ${isDragging ? 'pointer-events-none' : ''}`}>
        {centerPanel}
      </div>

      {/* Right Panel - Properties */}
      {rightPanel && (
        <div className="w-[280px] lg:w-[320px] shrink-0 border-l border-white/10 bg-[#09090b] flex flex-col z-20">
          {rightPanel}
        </div>
      )}
    </div>
  );
};

export default SplitView;
