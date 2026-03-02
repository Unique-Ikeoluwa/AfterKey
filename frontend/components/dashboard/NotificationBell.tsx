"use client";
import { useAppStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";

export default function NotificationBell() {
  const { notifications, clearNotifications } = useAppStore();
  const [open, setOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={bellRef}>
      <button 
        onClick={() => setOpen(!open)} 
        className="p-2 hover:bg-slate-800 rounded-lg transition-all relative"
      >
        <Bell size={20} className={notifications.length > 0 ? "text-indigo-400" : "text-slate-400"} />
        {notifications.length > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 w-2 h-2 rounded-full ring-2 ring-slate-950 animate-pulse" />
        )}
      </button>

      {open && (
        <div className="fixed sm:absolute right-4 left-4 sm:left-auto sm:right-0 mt-4 sm:w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[60] backdrop-blur-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-800/50 bg-slate-900/50">
            <h4 className="font-bold text-white text-xs uppercase tracking-widest">Notifications</h4>
            {notifications.length > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  clearNotifications();
                }}
                className="text-[10px] flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold uppercase transition-colors"
              >
                <CheckCheck size={12} />
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center italic">No new alerts</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  <p className={`text-sm ${n.message.includes('Warning') ? 'text-yellow-200/90 font-medium' : 'text-slate-300'}`}>
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block font-bold">{n.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
