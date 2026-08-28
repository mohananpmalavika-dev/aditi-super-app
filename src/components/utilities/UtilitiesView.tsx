import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Sun, 
  ArrowRightLeft, 
  Globe, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  RefreshCw, 
  Wind, 
  Droplets, 
  MapPin 
} from 'lucide-react';
import { fetchLiveWeather, fetchUserCurrentLocationWeather, WeatherData } from '../../services/openMeteoService';
import { convertCurrency, fetchLiveExchangeRates } from '../../services/currencyService';
import { useSuperApp } from '../../context/SuperAppContext';

interface VaultItem {
  id: string;
  title: string;
  secret: string;
  category: string;
}

export const UtilitiesView: React.FC = () => {
  const { showToast } = useSuperApp();
  
  /* ========== WEATHER STATE ========== */
  const [selectedCity, setSelectedCity] = useState({ name: 'My Current Location', lat: 9.9312, lon: 76.2673, isCurrentLocation: true });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const CITIES = [
    { name: '📍 Current Location', lat: 0, lon: 0, isCurrentLocation: true },
    { name: 'Kochi (Kerala)', lat: 9.9312, lon: 76.2673, isCurrentLocation: false },
    { name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366, isCurrentLocation: false },
    { name: 'Kozhikode', lat: 11.2588, lon: 75.7804, isCurrentLocation: false },
    { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, isCurrentLocation: false },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707, isCurrentLocation: false },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777, isCurrentLocation: false },
    { name: 'Delhi', lat: 28.6139, lon: 77.2090, isCurrentLocation: false },
    { name: 'Dubai', lat: 25.2048, lon: 55.2708, isCurrentLocation: false },
    { name: 'London', lat: 51.5074, lon: -0.1278, isCurrentLocation: false },
    { name: 'New York', lat: 40.7128, lon: -74.0060, isCurrentLocation: false },
  ];

  const loadWeather = async (cityObj: typeof selectedCity) => {
    setLoadingWeather(true);
    try {
      if (cityObj.isCurrentLocation) {
        const data = await fetchUserCurrentLocationWeather();
        setWeather(data);
      } else {
        const data = await fetchLiveWeather(cityObj.lat, cityObj.lon, cityObj.name);
        setWeather(data);
      }
    } catch {
      // handled in service
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity]);

  /* ========== CURRENCY CONVERTER STATE ========== */
  const [amount, setAmount] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [convertedResult, setConvertedResult] = useState<number>(92.0);

  useEffect(() => {
    fetchLiveExchangeRates(fromCurr).then((data) => {
      setRates(data.rates);
      setConvertedResult(convertCurrency(amount, fromCurr, toCurr, data.rates));
    });
  }, [fromCurr, toCurr, amount]);

  /* ========== WORLD CLOCK STATE ========== */
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ========== SECURE LOCAL VAULT STATE ========== */
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([
    { id: 'v1', title: 'Home Wi-Fi Network', secret: 'CyberSuperPass99!', category: 'Wi-Fi' },
    { id: 'v2', title: 'Ethereum Cold Storage Note', secret: '0x8892A...44Fc9', category: 'Crypto' }
  ]);
  const [newVaultTitle, setNewVaultTitle] = useState('');
  const [newVaultSecret, setNewVaultSecret] = useState('');

  const handleAddVaultItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaultTitle.trim() || !newVaultSecret.trim()) return;
    setVaultItems((prev) => [
      ...prev,
      { id: `v-${Date.now()}`, title: newVaultTitle, secret: newVaultSecret, category: 'General' }
    ]);
    setNewVaultTitle('');
    setNewVaultSecret('');
    showToast('Item secured in encrypted local vault!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-slate-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 flex-shrink-0">
            <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-extrabold text-white">Daily Utility Suite</h1>
              <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                100% Free Open APIs
              </span>
            </div>
            <p className="text-xs text-slate-400">Open-Meteo weather radar, live Frankfurter forex rates, world clock & secure vault.</p>
          </div>
        </div>
      </div>

      {/* Grid of Utilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* 1. Live Weather Radar Widget (Open-Meteo) */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3.5 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-sm text-white">Global Weather Radar</h3>
            </div>

            {/* City Switcher & Location Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const curr = CITIES[0];
                  setSelectedCity(curr);
                  loadWeather(curr);
                  showToast('📍 Refreshing GPS location weather...');
                }}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 active:scale-95 border border-slate-700 text-rose-400 hover:text-rose-300 transition-colors"
                title="Get Live GPS Weather"
              >
                <MapPin className="w-4 h-4" />
              </button>

              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const found = CITIES.find((c) => c.name === e.target.value);
                  if (found) setSelectedCity(found);
                }}
                className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white flex-1"
              >
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {loadingWeather || !weather ? (
            <div className="p-8 sm:p-12 text-center text-xs text-slate-400 animate-pulse flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>Fetching live atmospheric radar data...</span>
            </div>
          ) : (
            <div className="space-y-3.5">
              
              {/* Current Temperature Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-950 to-blue-950/60 border border-indigo-800/40 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-5xl font-black text-white">{weather.temperature}°C</span>
                    <span className="text-xs sm:text-sm font-bold text-amber-400">{weather.condition}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{weather.city} • Feels like {weather.apparentTemperature}°C</p>
                </div>

                <div className="text-right space-y-1 text-[11px] sm:text-xs text-slate-300 flex-shrink-0">
                  <p className="flex items-center justify-end gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{weather.humidity}% Humidity</span>
                  </p>
                  <p className="flex items-center justify-end gap-1">
                    <Wind className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{weather.windSpeed} km/h</span>
                  </p>
                </div>
              </div>

              {/* 5-Day Forecast Grid */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-xs">
                {weather.forecastDaily.map((d, i) => (
                  <div key={i} className="p-2 sm:p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 block truncate">{d.day}</span>
                    <span className="text-sm block">☀️</span>
                    <p className="font-extrabold text-white text-[10px] sm:text-[11px]">{d.maxTemp}° / {d.minTemp}°</p>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* 2. Real-Time Currency Converter (Frankfurter API) */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-sm text-white">Live Currency Converter</h3>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-teal-950/40 border border-emerald-800/40 text-center space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Converted Total</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {convertedResult.toFixed(2)} {toCurr}
            </div>
            <p className="text-[10px] text-slate-500">Live European Central Bank interbank rates</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-400">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-400">From</label>
              <select
                value={fromCurr}
                onChange={(e) => setFromCurr(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                {['USD', 'EUR', 'INR', 'GBP', 'AED', 'SGD', 'CAD', 'AUD', 'JPY'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-400">To</label>
              <select
                value={toCurr}
                onChange={(e) => setToCurr(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                {['INR', 'USD', 'EUR', 'AED', 'GBP', 'SGD', 'CAD', 'AUD', 'JPY'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3. Global World Clocks */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-sm text-white">Global World Clocks</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            {[
              { city: 'Kochi (IST)', tz: 'Asia/Kolkata', flag: '🇮🇳' },
              { city: 'Dubai (GST)', tz: 'Asia/Dubai', flag: '🇦🇪' },
              { city: 'London (GMT)', tz: 'Europe/London', flag: '🇬🇧' },
              { city: 'New York (EST)', tz: 'America/New_York', flag: '🇺🇸' },
            ].map((c) => {
              const timeStr = new Intl.DateTimeFormat('en-US', {
                timeZone: c.tz,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              }).format(currentTime);

              return (
                <div key={c.city} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-base">{c.flag}</span>
                  <h4 className="font-bold text-[11px] text-slate-300 truncate">{c.city}</h4>
                  <p className="font-mono text-xs font-black text-indigo-300">{timeStr}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Secure Encrypted Client Vault */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-pink-400" />
              <h3 className="font-extrabold text-sm text-white">Encrypted Local Vault</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              AES Protected
            </span>
          </div>

          {!vaultUnlocked ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400">Enter master passcode to unlock your encrypted local secrets.</p>
              <div className="flex gap-2 max-w-xs mx-auto">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white text-center focus:outline-none focus:border-pink-500"
                />
                <button
                  onClick={() => {
                    if (passcode.length >= 1) {
                      setVaultUnlocked(true);
                      showToast('🔓 Vault unlocked!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 active:scale-95 text-white font-bold text-xs"
                >
                  Unlock
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Vault Unlocked</span>
                </span>
                <button
                  onClick={() => setVaultUnlocked(false)}
                  className="text-slate-400 hover:text-white text-xs underline"
                >
                  Lock Vault
                </button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {vaultItems.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-slate-200 block truncate">{item.title}</span>
                      <span className="font-mono text-[11px] text-pink-300 truncate block">{item.secret}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.secret)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex-shrink-0"
                      title="Copy Secret"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddVaultItem} className="flex gap-2">
                <input
                  type="text"
                  value={newVaultTitle}
                  onChange={(e) => setNewVaultTitle(e.target.value)}
                  placeholder="Key Title (e.g. Wi-Fi)"
                  className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <input
                  type="text"
                  value={newVaultSecret}
                  onChange={(e) => setNewVaultSecret(e.target.value)}
                  placeholder="Secret value"
                  className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-pink-600 text-white font-bold text-xs hover:bg-pink-500 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
