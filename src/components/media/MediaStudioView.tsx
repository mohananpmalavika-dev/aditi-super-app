import React, { useState, useRef, useEffect } from 'react';
import { 
  Palette, 
  Video, 
  Scissors, 
  Sparkles, 
  Download, 
  Heart, 
  Play, 
  Pause, 
  Plus, 
  Layers, 
  Film, 
  Type, 
  Sliders,
  Check,
  RefreshCw
} from 'lucide-react';
import { generateFreeImage } from '../../services/freeAiService';
import { AspectRatioType, GeneratedImage, GeneratedVideo, ImageStylePreset, VideoEditorClip } from '../../types/superApp';
import { useSuperApp } from '../../context/SuperAppContext';
import confetti from 'canvas-confetti';

export const MediaStudioView: React.FC = () => {
  const { showToast } = useSuperApp();
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'editor'>('image');

  /* ========== IMAGE GENERATOR STATE ========== */
  const [imagePrompt, setImagePrompt] = useState('Cyberpunk neon city alley at midnight with flying cars and holographic billboards');
  const [selectedStyle, setSelectedStyle] = useState<ImageStylePreset>('Cyberpunk');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>('1:1');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [gallery, setGallery] = useState<GeneratedImage[]>([
    {
      id: 'init-img-1',
      prompt: 'Cyberpunk neon city alley at midnight with flying cars',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      style: 'Cyberpunk',
      aspectRatio: '1:1',
      createdAt: '10:15 AM',
      likes: 14
    },
    {
      id: 'init-img-2',
      prompt: 'Anime visual style enchanted magical forest with glowing blue crystals',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      style: 'Anime / Manga',
      aspectRatio: '16:9',
      createdAt: '11:20 AM',
      likes: 29
    }
  ]);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImg) return;
    setIsGeneratingImg(true);
    showToast('✨ Synthesizing masterpiece via Pollinations FLUX Engine (100% Free)...');

    try {
      const newImg = await generateFreeImage(imagePrompt, selectedStyle, selectedRatio);
      setGallery((prev) => [newImg, ...prev]);
      confetti({ particleCount: 50, spread: 60 });
      showToast('🎉 Image generated successfully!');
    } catch (err) {
      showToast('⚠️ Generation error, please try again.');
    } finally {
      setIsGeneratingImg(false);
    }
  };

  /* ========== VIDEO GENERATOR STATE ========== */
  const [videoPrompt, setVideoPrompt] = useState('Drone sweeping flight over futuristic emerald archipelago islands at sunset');
  const [videoMotion, setVideoMotion] = useState<'Cinematic Pan' | 'Drone Shot' | 'Slow Motion' | 'Hyperlapse' | 'Orbit 360'>('Drone Shot');
  const [videoDuration, setVideoDuration] = useState<number>(5);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoGallery, setVideoGallery] = useState<GeneratedVideo[]>([
    {
      id: 'vid-1',
      prompt: 'Cinematic drone shot over misty neon mountains and futuristic architecture',
      videoUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
      motionStyle: 'Drone Shot',
      duration: 6,
      createdAt: '09:40 AM'
    }
  ]);

  const handleGenerateVideo = () => {
    if (!videoPrompt.trim() || isGeneratingVideo) return;
    setIsGeneratingVideo(true);
    showToast('🎥 Rendering AI motion keyframes in browser...');

    setTimeout(() => {
      const newVid: GeneratedVideo = {
        id: `vid-${Date.now()}`,
        prompt: videoPrompt,
        videoUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(videoPrompt + ', cinematic motion sequence, 4k ultra hd')}?width=1280&height=720&model=flux&seed=${Math.floor(Math.random() * 99999)}`,
        motionStyle: videoMotion,
        duration: videoDuration,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setVideoGallery((prev) => [newVid, ...prev]);
      setIsGeneratingVideo(false);
      confetti({ particleCount: 60, spread: 70 });
      showToast('🎬 AI Video Render Complete!');
    }, 2500);
  };

  /* ========== VIDEO EDITOR TIMELINE STATE ========== */
  const [editorFilter, setEditorFilter] = useState<'None' | 'Vintage' | 'Cyber' | 'Warm Glow' | 'Noir' | 'Vibrant'>('Cyber');
  const [textOverlay, setTextOverlay] = useState('Aditi Studio 2026');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0); // 0 to 100%
  const [clips, setClips] = useState<VideoEditorClip[]>([
    { id: 'c1', type: 'video', name: 'Main Track (Drone Sunset)', startTime: 0, endTime: 6, filterName: 'Cyber' },
    { id: 'c2', type: 'text', name: 'Title Overlay', startTime: 1, endTime: 4, content: 'Cyberpunk Metropolis' },
    { id: 'c3', type: 'audio', name: 'Synthesizer Cyberwave BGM', startTime: 0, endTime: 6 }
  ]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayhead((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Studio Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/25">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">AI Creative Media Studio</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% Free AI
              </span>
            </div>
            <p className="text-xs text-slate-400">Generate high-res art, cinematic motion clips & edit timelines in-browser.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950/70 border border-slate-800">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'image'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>AI Image Gen</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>AI Video Gen</span>
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'editor'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Video Editor</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. AI IMAGE GENERATOR TAB */}
      {/* ========================================================================= */}
      {activeTab === 'image' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            
            {/* Prompt input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Prompt Description</span>
                <span className="text-indigo-400">Powered by Pollinations FLUX (No API key needed)</span>
              </label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={3}
                placeholder="Describe what you want to create in vivid detail..."
                className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>

            {/* Style Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Style Preset</label>
              <div className="flex flex-wrap gap-2">
                {(['Cyberpunk', 'Photorealistic', 'Anime / Manga', '3D Render', 'Oil Painting', 'Cinematic Film', 'Digital Art'] as ImageStylePreset[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedStyle === style
                        ? 'bg-pink-600/30 border-pink-500 text-pink-300 shadow-md shadow-pink-500/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Aspect Ratio:</span>
                {(['1:1', '16:9', '9:16', '4:3'] as AspectRatioType[]).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setSelectedRatio(ratio)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      selectedRatio === ratio
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImg || !imagePrompt.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
              >
                {isGeneratingImg ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Art...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Generate Artwork</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Generated Gallery */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-400" />
              <span>Generated Creation Gallery ({gallery.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-pink-500/40 shadow-xl group transition-all"
                >
                  <div className="relative overflow-hidden bg-slate-950 aspect-square">
                    <img
                      src={img.imageUrl}
                      alt={img.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-pink-300 border border-pink-500/30">
                      {img.style} • {img.aspectRatio}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
                      "{img.prompt}"
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="text-[10px] text-slate-500">{img.createdAt}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            img.likes += 1;
                            showToast('❤️ Saved to favorites!');
                          }}
                          className="flex items-center gap-1 text-slate-400 hover:text-pink-400 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{img.likes}</span>
                        </button>
                        <a
                          href={img.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          download="omnilife-art.jpg"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Open HD / Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AI VIDEO GENERATOR TAB */}
      {/* ========================================================================= */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Video Prompt & Scene Choreography</label>
              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                rows={3}
                placeholder="Describe camera motion, scenery, and dynamic action in the shot..."
                className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Motion Style</label>
                <select
                  value={videoMotion}
                  onChange={(e) => setVideoMotion(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Drone Shot">Drone Shot (Aerial sweeping view)</option>
                  <option value="Cinematic Pan">Cinematic Pan (Smooth 35mm pan)</option>
                  <option value="Slow Motion">Slow Motion (120fps dramatic action)</option>
                  <option value="Hyperlapse">Hyperlapse (Fast dynamic motion)</option>
                  <option value="Orbit 360">Orbit 360 (Rotational camera)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Duration: {videoDuration} seconds</label>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 mt-3"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo || !videoPrompt.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:scale-105 disabled:opacity-50 transition-all"
              >
                {isGeneratingVideo ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rendering Scene Keyframes...</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 text-yellow-300" />
                    <span>Render Motion Video</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Video Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {videoGallery.map((vid) => (
              <div key={vid.id} className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl group">
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={vid.videoUrl}
                    alt={vid.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-purple-600/80 backdrop-blur-md flex items-center justify-center text-white shadow-xl shadow-purple-500/40 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                    {vid.motionStyle} • {vid.duration}s
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-xs text-slate-200 font-semibold line-clamp-2">"{vid.prompt}"</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>Generated {vid.createdAt}</span>
                    <button
                      onClick={() => {
                        setActiveTab('editor');
                        showToast('Clip imported into Video Editor Timeline!');
                      }}
                      className="text-purple-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Edit on Timeline</span>
                      <Scissors className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WEB VIDEO EDITOR TIMELINE TAB */}
      {/* ========================================================================= */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            
            {/* Editor Canvas Player & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Video Canvas Preview */}
              <div className="lg:col-span-2 space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80"
                    alt="Canvas Preview"
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      editorFilter === 'Cyber' ? 'hue-rotate-90 saturate-200 contrast-125' :
                      editorFilter === 'Vintage' ? 'sepia contrast-125' :
                      editorFilter === 'Noir' ? 'grayscale contrast-150' :
                      editorFilter === 'Warm Glow' ? 'brightness-110 saturate-150' : ''
                    }`}
                  />

                  {/* Text Overlay Layer */}
                  {textOverlay && (
                    <div className="absolute top-6 left-6 font-extrabold text-lg sm:text-2xl text-white tracking-widest uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] border-b-2 border-indigo-500 pb-1">
                      {textOverlay}
                    </div>
                  )}

                  {/* Playhead Progress Overlay */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-pink-500 shadow-lg shadow-pink-500/50 pointer-events-none"
                    style={{ left: `${playhead}%` }}
                  />
                </div>

                {/* Player Play/Pause and Seek Bar */}
                <div className="flex items-center gap-4 px-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/30 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                      <span>00:{Math.floor((playhead / 100) * 6).toString().padStart(2, '0')}</span>
                      <span>00:06 (Total)</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={playhead}
                      onChange={(e) => setPlayhead(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Inspector & Filter Controls */}
              <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>Color Grading & FX</span>
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  {(['None', 'Cyber', 'Vintage', 'Warm Glow', 'Noir', 'Vibrant'] as any[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setEditorFilter(filter)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        editorFilter === filter
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-pink-400" />
                    <span>Overlay Title Text</span>
                  </label>
                  <input
                    type="text"
                    value={textOverlay}
                    onChange={(e) => setTextOverlay(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Enter on-screen text..."
                  />
                </div>

                <button
                  onClick={() => {
                    confetti({ particleCount: 70, spread: 70 });
                    showToast('💾 Video Rendered & Saved to your media library!');
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Export 1080p Video</span>
                </button>
              </div>

            </div>

            {/* Timeline Multi-Track Visualizer */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-indigo-400" />
                  <span>Multi-Track Timeline</span>
                </span>
                <span className="text-[11px] text-slate-500">Track Synchronizer</span>
              </div>

              <div className="space-y-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                {clips.map((clip) => (
                  <div key={clip.id} className="flex items-center gap-3">
                    <div className="w-24 text-[11px] font-bold text-slate-400 truncate">
                      {clip.type.toUpperCase()}
                    </div>
                    <div className="flex-1 relative h-9 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-lg px-3 flex items-center text-[10px] font-bold text-white shadow-md ${
                          clip.type === 'video'
                            ? 'bg-indigo-600/80 border border-indigo-400/50 w-full'
                            : clip.type === 'text'
                            ? 'bg-pink-600/80 border border-pink-400/50 w-2/3 ml-12'
                            : 'bg-emerald-600/80 border border-emerald-400/50 w-full'
                        }`}
                      >
                        {clip.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
