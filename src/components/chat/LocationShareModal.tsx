import React, { useState } from 'react';
import { MapPin, X, Navigation, Send, Globe } from 'lucide-react';

interface LocationShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendLocation: (locationText: string, mapUrl: string) => void;
}

const PRESET_LOCATIONS = [
  { name: 'Kollam Beach, Kerala', address: 'Kollam Beach Road, Kerala, India', coords: '8.8932° N, 76.6141° E' },
  { name: 'Marine Drive, Kochi', address: 'Marine Drive, Kochi, Kerala, India', coords: '9.9816° N, 76.2753° E' },
  { name: 'Infopark Technology Hub, Kochi', address: 'Infopark Phase 1, Kakkanad, Kochi', coords: '10.0159° N, 76.3639° E' },
  { name: 'Trivandrum Technopark', address: 'Technopark Campus, Thiruvananthapuram, Kerala', coords: '8.5581° N, 76.8810° E' },
  { name: 'MG Road, Bengaluru', address: 'MG Road, Bengaluru, Karnataka, India', coords: '12.9716° N, 77.5946° E' }
];

export const LocationShareModal: React.FC<LocationShareModalProps> = ({
  isOpen,
  onClose,
  onSendLocation
}) => {
  const [selectedLoc, setSelectedLoc] = useState(PRESET_LOCATIONS[0]);
  const [customQuery, setCustomQuery] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    const locName = customQuery || selectedLoc.name;
    const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(locName)}`;
    onSendLocation(locName, mapUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Share Live Location</h3>
              <p className="text-[11px] text-slate-400">Interactive GPS map point</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Visual Preview */}
        <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
          {/* Simulated Satellite Map Grid */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">{customQuery || selectedLoc.name}</h4>
              <p className="text-[10px] text-emerald-400 font-mono">{selectedLoc.coords}</p>
            </div>
          </div>
        </div>

        {/* Preset Location Quick List */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Nearby Places
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {PRESET_LOCATIONS.map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedLoc(loc);
                  setCustomQuery('');
                }}
                className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors flex items-center justify-between border ${
                  selectedLoc.name === loc.name && !customQuery
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">{loc.name}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{loc.address}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:scale-[1.02] transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Share This Location</span>
        </button>

      </div>
    </div>
  );
};
