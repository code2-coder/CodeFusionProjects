import React from 'react';

const WhatsAppButton = () => {
  // Configurable WhatsApp details
  const phoneNumber = "918767316759"; // Replace with actual business number
  const message = "Hello! I am interested in building a project with Code Fusion.";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Premium Glassmorphic Tooltip */}
      <span className="mr-3 px-3 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-500/20 text-xs font-semibold text-emerald-400 opacity-0 -translate-x-4 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap shadow-[0_4px_20px_rgba(16,185,129,0.15)]">
        Chat with us!
      </span>

      {/* Modern Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:scale-110 active:scale-95 focus:outline-none"
        aria-label="Chat on WhatsApp"
      >
        {/* Subtle breathing glow effect */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping opacity-75 group-hover:animate-none"></span>
        
        {/* Modern WhatsApp SVG icon */}
        <svg
          className="w-7 h-7 fill-current transform group-hover:rotate-12 transition-transform duration-300 relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.9 9.9 0 0 0-6.98-2.778c-5.443 0-9.874 4.372-9.878 9.8.002 1.76.474 3.479 1.371 5.017L1.82 22.185l4.827-1.261zm11.237-7.234c-.31-.155-1.837-.907-2.122-1.01-.284-.103-.491-.155-.697.155-.207.31-.802 1.01-.983 1.216-.181.206-.362.232-.672.077-.31-.155-1.308-.482-2.49-1.538-.919-.82-1.54-1.834-1.72-2.143-.18-.31-.019-.477.136-.632.139-.139.31-.362.465-.542.155-.181.206-.31.31-.516.103-.207.052-.387-.026-.542-.077-.155-.697-1.678-.954-2.297-.25-.602-.525-.522-.72-.532-.186-.01-.398-.011-.61-.011-.212 0-.557.08-.847.397-.29.317-1.11 1.083-1.11 2.642 0 1.558 1.137 3.067 1.292 3.274.155.207 2.237 3.415 5.419 4.787.757.327 1.348.522 1.81.667.76.241 1.45.207 1.996.126.609-.09 1.837-.75 2.096-1.439.258-.69.258-1.282.18-1.402-.077-.12-.284-.19-.593-.346z" />
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;
