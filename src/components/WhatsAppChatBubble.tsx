import React, { useState } from 'react';
import { MessageSquare, X, Send, Phone, CheckCheck } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

export const WhatsAppChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '916232101154';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('Hello M.G. Industries! I am inquiring about UFRP Fiberglass Sheet manufacturing, custom profiles, and pricing.')}`;

  const handleOpenChat = () => {
    soundFx.playClick();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-14 sm:bottom-16 right-3 sm:right-5 z-40 flex flex-col items-end gap-2 font-sans select-none">
      {/* Quick Tooltip / Chat Popup Box */}
      {isOpen && (
        <div className="w-72 bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl p-3.5 text-slate-100 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
                WA
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <span>M.G. Industries</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-mono">+91 6232101154 • Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex flex-col gap-1 font-sans">
            <div className="flex justify-between items-center text-[10px] text-emerald-400 font-mono font-bold">
              <span>Technical Sales Support</span>
              <span className="flex items-center gap-0.5"><CheckCheck className="w-3 h-3" /> Just now</span>
            </div>
            <p className="leading-snug">
              Need custom UFRP sheet quotes, technical specs, or bulk dispatch assistance? Chat directly on WhatsApp!
            </p>
          </div>

          <button
            onClick={handleOpenChat}
            className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open Chat on WhatsApp</span>
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => {
          soundFx.playClick();
          setIsOpen(!isOpen);
        }}
        onDoubleClick={handleOpenChat}
        className="group relative p-3 sm:p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 border-2 border-emerald-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
        title="Chat on WhatsApp (+91 6232101154)"
      >
        {/* Glowing Pulsing Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping opacity-75 pointer-events-none" />

        {/* WhatsApp Vector Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950 relative z-10"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.221h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.176-2.925-7.062A9.925 9.925 0 0012.012 2zm5.82 14.161c-.244.688-1.226 1.295-1.99 1.385-.538.062-1.242.091-3.606-.885-3.024-1.249-4.962-4.32-5.112-4.521-.15-.2-1.223-1.631-1.223-3.11 0-1.479.774-2.207 1.047-2.508.273-.301.597-.376.796-.376.199 0 .398.002.571.01.183.008.43-.07.672.512.244.588.832 2.032.905 2.182.073.15.122.326.024.521-.098.195-.147.316-.294.492-.147.176-.309.394-.442.53-.148.151-.302.316-.13.612.172.296.764 1.262 1.638 2.041 1.127.999 2.075 1.309 2.372 1.458.297.15.471.125.645-.075.174-.2.746-.869.945-1.168.199-.3.398-.25.672-.15.273.1 1.738.82 2.036.968.298.148.496.223.57.348.074.126.074.729-.17 1.417z" />
        </svg>

        {/* WhatsApp Badge */}
        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-slate-950 text-emerald-400 font-mono font-black text-[9px] rounded-full border border-emerald-400 shadow">
          +91
        </span>
      </button>
    </div>
  );
};
