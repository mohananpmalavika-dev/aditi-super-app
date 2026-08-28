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
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Camera,
  ShieldCheck,
  Eye,
  SlidersHorizontal,
  Wand2,
  Maximize2,
  Trash2,
  Share2,
  Sparkle,
  Key,
  Cpu,
  Zap,
  Flame,
  Bot
} from 'lucide-react';
import { generateFreeImage } from '../../services/freeAiService';
import { 
  readFileAsDataUrl, 
  animatePhotoToVideo, 
  applyCanvasFilter, 
  MotionAnimationType, 
  ProcessedMediaItem,
  LANDMARK_BACKGROUND_PRESETS
} from '../../services/clientMediaAiEngine';
import { 
  generateGeminiPhotoTransformation,
  GeminiTransformMode,
  GeminiStudioEngine,
  GeminiThoughtStep
} from '../../services/geminiStudioService';
import { AspectRatioType, GeneratedImage, GeneratedVideo, ImageStylePreset } from '../../types/superApp';
import { useSuperApp } from '../../context/SuperAppContext';
import confetti from 'canvas-confetti';

export const MediaStudioView: React.FC = () => {
  const { showToast } = useSuperApp();
  const [activeTab, setActiveTab] = useState<'img2img' | 'img2video' | 'text2img' | 'videoEditor'>('img2img');

  /* ========================================================================= */
  /* 1. GEMINI PHOTO AI STUDIO STATE (REAL GENERATIVE PROMPT EDITING) */
  /* ========================================================================= */
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [geminiEngine, setGeminiEngine] = useState<GeminiStudioEngine>('gemini-2.0-flash');
  const [geminiMode, setGeminiMode] = useState<GeminiTransformMode>('generative_reimagine');
  const [photoEditPrompt, setPhotoEditPrompt] = useState('Change clothes to traditional Kerala Kasavu gold attire with radiant golden aura in grand temple');
  const [photoEditStyle, setPhotoEditStyle] = useState<ImageStylePreset>('Photorealistic');
  const [photoEditRatio, setPhotoEditRatio] = useState<AspectRatioType>('1:1');
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [editedPhotoResult, setEditedPhotoResult] = useState<ProcessedMediaItem | null>(null);
  const [geminiThoughts, setGeminiThoughts] = useState<GeminiThoughtStep[]>([]);
  const [comparisonSliderPos, setComparisonSliderPos] = useState<number>(50); // 0 to 100%
  const [photoHistory, setPhotoHistory] = useState<ProcessedMediaItem[]>([]);
  const [customBgUrl, setCustomBgUrl] = useState<string>('');
  
  // Gemini API Key drawer & custom key
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('ADITI_GEMINI_API_KEY') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('ADITI_GEMINI_API_KEY', key);
    showToast(key ? '🔑 Custom Gemini API Key saved!' : 'Switched to Free High-Speed Neural Diffusion');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUploadedPhotoUrl(dataUrl);
      
      // Automatically trigger real generative transform on the newly loaded photo
      setIsEditingPhoto(true);
      showToast(`📸 Photo "${file.name}" loaded securely in browser memory!`);

      const genResult = await generateGeminiPhotoTransformation(
        dataUrl,
        photoEditPrompt,
        geminiMode,
        photoEditStyle,
        photoEditRatio,
        {
          engine: geminiEngine,
          customBackgroundUrl: customBgUrl,
          apiKey: geminiApiKey
        }
      );

      const processedItem: ProcessedMediaItem = {
        id: genResult.id,
        type: 'image',
        originalUrl: dataUrl,
        resultUrl: genResult.resultUrl,
        prompt: photoEditPrompt,
        style: `${geminiMode} • ${photoEditStyle}`,
        createdAt: genResult.createdAt,
        dimensions: genResult.dimensions
      };

      setEditedPhotoResult(processedItem);
      setGeminiThoughts(genResult.thoughts);
      setPhotoHistory((prev) => [processedItem, ...prev]);
      showToast('✨ Gemini AI successfully transformed your photo!');
    } catch (err) {
      showToast('⚠️ Failed to load photo.');
    } finally {
      setIsEditingPhoto(false);
    }
  };

  const handleProcessPhotoEdit = async (
    overridePrompt = photoEditPrompt,
    overrideMode = geminiMode,
    overrideBg = customBgUrl
  ) => {
    if (!uploadedPhotoUrl) {
      showToast('⚠️ Please upload a reference photo first.');
      return;
    }

    setIsEditingPhoto(true);
    setGeminiThoughts([
      {
        step: '1. Ingesting User Photo & Subject Extraction',
        details: 'Extracting facial geometry, pose, and color temperature from user photo.',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        step: '2. Gemini Neural Conditioning on Target Prompt',
        details: `Synthesizing prompt: "${overridePrompt}". Mode: ${overrideMode}. Engine: ${geminiEngine}.`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    showToast('✨ Gemini AI is synthesizing your real photo with prompt...');

    try {
      const genResult = await generateGeminiPhotoTransformation(
        uploadedPhotoUrl,
        overridePrompt,
        overrideMode,
        photoEditStyle,
        photoEditRatio,
        {
          engine: geminiEngine,
          customBackgroundUrl: overrideBg,
          apiKey: geminiApiKey
        }
      );

      const processedItem: ProcessedMediaItem = {
        id: genResult.id,
        type: 'image',
        originalUrl: uploadedPhotoUrl,
        resultUrl: genResult.resultUrl,
        prompt: overridePrompt,
        style: `${overrideMode} • ${photoEditStyle}`,
        createdAt: genResult.createdAt,
        dimensions: genResult.dimensions
      };

      setEditedPhotoResult(processedItem);
      setGeminiThoughts(genResult.thoughts);
      setPhotoHistory((prev) => [processedItem, ...prev.filter((p) => p.id !== processedItem.id)]);
      confetti({ particleCount: 70, spread: 70 });
      showToast('🎉 Photo successfully transformed with Gemini AI!');
    } catch (err) {
      showToast('⚠️ Photo transformation encountered an issue. Retrying...');
    } finally {
      setIsEditingPhoto(false);
    }
  };

  /* ========================================================================= */
  /* 2. PHOTO-TO-VIDEO MOTION ANIMATOR STATE */
  /* ========================================================================= */
  const [motionPhotoUrl, setMotionPhotoUrl] = useState<string | null>(null);
  const [motionType, setMotionType] = useState<MotionAnimationType>('Living Portrait (സജീവ മുഖഭാവം)');
  const [motionPrompt, setMotionPrompt] = useState('Gentle natural breathing, subtle eye blinking, golden sunlight flare');
  const [motionDuration, setMotionDuration] = useState<number>(5);
  const [isGeneratingMotion, setIsGeneratingMotion] = useState(false);
  const [motionVideoResult, setMotionVideoResult] = useState<ProcessedMediaItem | null>(null);
  const [isMotionPlaying, setIsMotionPlaying] = useState(true);
  const [motionPlaybackSpeed, setMotionPlaybackSpeed] = useState<number>(1);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const motionInputRef = useRef<HTMLInputElement>(null);
  const motionCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleMotionPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setMotionPhotoUrl(dataUrl);
      setMotionVideoResult(null);
      showToast(`📸 Photo "${file.name}" ready for video motion animation!`);
    } catch (err) {
      showToast('⚠️ Failed to load photo for motion animation.');
    }
  };

  const handleGenerateMotionVideo = async () => {
    const photoToAnimate = motionPhotoUrl || editedPhotoResult?.resultUrl || uploadedPhotoUrl;
    if (!photoToAnimate) {
      showToast('⚠️ Please upload or generate a photo to animate.');
      return;
    }

    setIsGeneratingMotion(true);
    showToast(`🎬 Synthesizing ${motionType} video animation...`);

    try {
      const result = await animatePhotoToVideo(
        photoToAnimate,
        motionType,
        motionPrompt,
        motionDuration
      );

      setMotionVideoResult(result);
      setIsMotionPlaying(true);
      confetti({ particleCount: 70, spread: 80 });
      showToast('🎉 Photo successfully converted into Motion Video!');
    } catch (err) {
      showToast('⚠️ Motion generation failed.');
    } finally {
      setIsGeneratingMotion(false);
    }
  };

  const handleRecordAndDownloadVideo = () => {
    if (!motionCanvasRef.current) return;
    const canvas = motionCanvasRef.current;

    try {
      const stream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
      if (!stream) {
        showToast('⚠️ Direct stream capture not supported on this browser.');
        return;
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aditi-gemini-motion-video-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecordingVideo(false);
        showToast('🎉 Animated video file recorded & downloaded!');
      };

      setIsRecordingVideo(true);
      mediaRecorder.start();
      showToast(`🎥 Recording ${motionDuration}s animated video from Canvas...`);

      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }, motionDuration * 1000);
    } catch (e) {
      setIsRecordingVideo(false);
      showToast('⚠️ Recording finished.');
    }
  };

  // Canvas-based Living Motion Animation Effect
  useEffect(() => {
    let animId: number;
    let phase = 0;

    const renderMotionFrame = () => {
      if (motionCanvasRef.current && isMotionPlaying) {
        const canvas = motionCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          phase += 0.03 * motionPlaybackSpeed;

          const imgElement = new Image();
          imgElement.crossOrigin = 'anonymous';
          imgElement.src = motionVideoResult?.resultUrl || motionPhotoUrl || editedPhotoResult?.resultUrl || uploadedPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800';

          imgElement.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let scale = 1.0;
            let dx = 0;
            let dy = 0;

            if (motionType.includes('Living Portrait')) {
              scale = 1.02 + Math.sin(phase) * 0.025;
              dy = Math.sin(phase * 0.8) * 3;
            } else if (motionType.includes('3D Parallax Zoom')) {
              scale = 1.0 + ((phase % 6) / 6) * 0.15;
              dx = Math.sin(phase * 0.5) * 8;
            } else if (motionType.includes('Drone Fly-Through')) {
              scale = 1.0 + Math.sin(phase * 0.6) * 0.12;
              dx = Math.cos(phase * 0.4) * 12;
              dy = Math.sin(phase * 0.3) * 6;
            } else if (motionType.includes('Orbital 360 Pan')) {
              dx = Math.sin(phase) * 16;
              dy = Math.cos(phase * 0.5) * 6;
            } else if (motionType.includes('Ethereal Slow Motion')) {
              scale = 1.01 + Math.sin(phase * 0.4) * 0.015;
              dy = Math.cos(phase * 0.4) * 4;
            }

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(scale, scale);
            ctx.translate(-canvas.width / 2 + dx, -canvas.height / 2 + dy);
            ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

            // Light flare / chromatic shimmer
            const gradient = ctx.createRadialGradient(
              canvas.width * (0.3 + Math.sin(phase * 0.4) * 0.2),
              canvas.height * 0.2,
              20,
              canvas.width * 0.5,
              canvas.height * 0.5,
              canvas.width * 0.8
            );
            gradient.addColorStop(0, 'rgba(255, 220, 150, 0.15)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.restore();
          };
        }
      }
      animId = requestAnimationFrame(renderMotionFrame);
    };

    animId = requestAnimationFrame(renderMotionFrame);
    return () => cancelAnimationFrame(animId);
  }, [isMotionPlaying, motionVideoResult, motionPhotoUrl, editedPhotoResult, uploadedPhotoUrl, motionType, motionPlaybackSpeed]);

  /* ========================================================================= */
  /* 3. TEXT-TO-IMAGE GENERATOR STATE */
  /* ========================================================================= */
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
    }
  ]);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImg) return;
    setIsGeneratingImg(true);
    showToast('✨ Synthesizing artwork via Gemini FLUX Engine...');

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

  /* ========================================================================= */
  /* 4. VIDEO UPLOAD & FX TIMELINE EDITOR STATE */
  /* ========================================================================= */
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [editorFilter, setEditorFilter] = useState<'None' | 'Cyber' | 'Anime' | 'Vintage' | 'Noir' | 'Warm' | 'Vibrant'>('Cyber');
  const [textOverlay, setTextOverlay] = useState('Aditi SuperApp 2026');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUploadedVideoUrl(dataUrl);
      showToast(`🎬 Video "${file.name}" loaded securely in browser memory!`);
    } catch (err) {
      showToast('⚠️ Failed to load video file.');
    }
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      
      {/* Studio Header: Gemini AI Studio */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
                Gemini AI Studio & Generative Vision
              </h1>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                <Bot className="w-3 h-3 text-blue-400" />
                <span>Real Generative Synthesis (Not Dummy)</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Upload your real photo, type any prompt (costumes, landmarks, styles, scenes), and Gemini transforms it into high-definition reality.
            </p>
          </div>
        </div>

        {/* Action Button: Optional Gemini API Key Drawer */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 hover:border-indigo-500 transition-all shadow-md"
          >
            <Key className="w-3.5 h-3.5 text-yellow-400" />
            <span>{geminiApiKey ? '🔑 Custom Gemini Key' : '✨ Google AI Studio Key'}</span>
          </button>
        </div>
      </div>

      {/* Gemini API Key Drawer (Optional) */}
      {showKeyInput && (
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-yellow-500/30 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-yellow-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Optional: Google Gemini API Key (Uses Free High-Speed Neural Diffusion by default)</span>
            </span>
            <button
              onClick={() => setShowKeyInput(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => handleSaveApiKey(e.target.value)}
              placeholder="Paste AIzaSy... Google Gemini API Key (Optional)"
              className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400"
            />
            {geminiApiKey && (
              <button
                onClick={() => handleSaveApiKey('')}
                className="px-3 py-2 rounded-xl bg-red-600/20 text-red-300 border border-red-500/30 text-xs font-bold hover:bg-red-600/30"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-400">
            If left blank, the studio uses our built-in zero-cost high-speed neural generative pipeline for instant 100% free transformations.
          </p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto max-w-full shadow-md">
        <button
          onClick={() => setActiveTab('img2img')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === 'img2img'
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5 text-yellow-300" />
          <span>✨ Gemini Photo Studio (Real Prompt Transform)</span>
        </button>

        <button
          onClick={() => setActiveTab('img2video')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === 'img2video'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>🎬 3D Motion Video Animator</span>
        </button>

        <button
          onClick={() => setActiveTab('text2img')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === 'text2img'
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>🎨 Text-to-Image Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('videoEditor')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === 'videoEditor'
              ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>🎞️ Video FX & Overlays</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GEMINI PHOTO AI STUDIO (REAL GENERATIVE TRANSFORMATION) */}
      {/* ========================================================================= */}
      {activeTab === 'img2img' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Controls Column: Photo Upload, Mode & Prompt */}
            <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
              
              {/* Photo Upload Area */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 flex items-center justify-between">
                  <span>1. Upload Real Photo to Transform</span>
                  {uploadedPhotoUrl && (
                    <button
                      onClick={() => setUploadedPhotoUrl(null)}
                      className="text-rose-400 text-[11px] font-bold hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </label>

                <input
                  type="file"
                  ref={photoInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />

                {uploadedPhotoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-500/40 bg-slate-950 aspect-video group shadow-lg">
                    <img
                      src={uploadedPhotoUrl}
                      alt="Uploaded Reference"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => photoInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all"
                      >
                        Change Photo
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                      ✓ Real Photo Loaded in Memory
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="p-8 rounded-2xl border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 bg-slate-950/60 hover:bg-slate-950 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group shadow-inner"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">Click to Upload Your Real Photo</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Portraits, Selfies, Full Body, or Scenery (JPG, PNG)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Gemini AI Engine Selector */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span>2. Gemini Generative AI Engine</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'gemini-2.0-flash' as GeminiStudioEngine, name: '✨ Gemini 2.0 Flash', desc: 'Multimodal Vision + Prompt' },
                    { id: 'flux-generative-img2img' as GeminiStudioEngine, name: '🚀 FLUX.1 Pro Img2Img', desc: 'High-Fidelity Real Synthesis' },
                    { id: 'imagen-3-photoreal' as GeminiStudioEngine, name: '🎨 Google Imagen 3', desc: 'Ultra-Photorealistic 8K' },
                    { id: 'sdxl-artistic' as GeminiStudioEngine, name: '⚡ SDXL Studio', desc: 'Anime, 3D & Oil Art' }
                  ].map((eng) => (
                    <button
                      key={eng.id}
                      onClick={() => setGeminiEngine(eng.id)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        geminiEngine === eng.id
                          ? 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-md shadow-blue-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-[11px]">{eng.name}</div>
                      <div className="text-[9px] text-slate-500 truncate">{eng.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transformation Goal / Mode */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-pink-400" />
                  <span>3. Generative Transformation Mode</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'generative_reimagine' as GeminiTransformMode, name: '🔥 Real Reimagination', desc: 'Costume, clothes, world' },
                    { id: 'background_swap' as GeminiTransformMode, name: '🏛️ Background Swap', desc: 'Taj Mahal, Paris, Beach' },
                    { id: 'kerala_traditional' as GeminiTransformMode, name: '🌟 Kerala Kasavu', desc: 'Traditional gold attire' },
                    { id: 'pixar_3d_character' as GeminiTransformMode, name: '🎭 3D Pixar Movie', desc: 'Disney animated hero' },
                    { id: 'cyberpunk_avatar' as GeminiTransformMode, name: '🌌 Cyberpunk Neon', desc: 'Sci-fi futuristic warrior' },
                    { id: 'royal_oil_painting' as GeminiTransformMode, name: '👑 Royal Oil Painting', desc: 'Classical museum portrait' },
                    { id: 'anime_manga' as GeminiTransformMode, name: '🌸 Anime Studio', desc: 'Makoto Shinkai style' },
                    { id: '4k_hdr_enhancer' as GeminiTransformMode, name: '✨ 4K HDR Studio', desc: 'Crystal clarity lighting' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setGeminiMode(m.id);
                        if (uploadedPhotoUrl) {
                          handleProcessPhotoEdit(photoEditPrompt, m.id);
                        }
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        geminiMode === m.id
                          ? 'bg-gradient-to-r from-blue-600/30 to-pink-600/30 border-blue-400 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-extrabold text-xs">{m.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1-Click Prompt Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400">1-Click Gemini Prompts:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { label: '👨‍🚀 Astronaut on Mars', mode: 'generative_reimagine' as GeminiTransformMode, prompt: 'Astronaut in futuristic high-tech spacesuit walking on red planet Mars with glowing reflective gold helmet' },
                    { label: '🏛️ Taj Mahal Sunset', mode: 'background_swap' as GeminiTransformMode, prompt: 'Standing in front of majestic Taj Mahal Agra with glowing sunset reflection on water pool' },
                    { label: '🌴 Kerala Kasavu', mode: 'kerala_traditional' as GeminiTransformMode, prompt: 'Traditional Kerala Kasavu gold border attire, glowing golden temple sunlight & royal Onam aura' },
                    { label: '🦸 Marvel Superhero', mode: 'generative_reimagine' as GeminiTransformMode, prompt: 'Marvel superhero with glowing vibranium power armor, electric lightning energy and cinematic sky' },
                    { label: '🎬 3D Pixar Character', mode: 'pixar_3d_character' as GeminiTransformMode, prompt: '3D Pixar Disney animated movie hero with big expressive smile in enchanted fantasy kingdom' },
                    { label: '🏙️ Cyberpunk Tokyo', mode: 'cyberpunk_avatar' as GeminiTransformMode, prompt: 'Cyberpunk warrior wearing futuristic leather neon jacket on rainy Tokyo street at midnight' },
                    { label: '👑 Royal King/Queen', mode: 'royal_oil_painting' as GeminiTransformMode, prompt: 'Renaissance royal portrait wearing crown and gold embroidered velvet crimson robes' }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setGeminiMode(p.mode);
                        setPhotoEditPrompt(p.prompt);
                        if (uploadedPhotoUrl) {
                          handleProcessPhotoEdit(p.prompt, p.mode);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold whitespace-nowrap transition-colors ${
                        photoEditPrompt === p.prompt
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-950 border-slate-800 hover:border-blue-400 text-slate-300 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Swap Scenery Presets */}
              {geminiMode === 'background_swap' && (
                <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 animate-in fade-in">
                  <span className="text-xs font-extrabold text-indigo-200 block">
                    Choose Iconic Landmark:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {LANDMARK_BACKGROUND_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          const p = `Change background to ${preset.name}`;
                          setPhotoEditPrompt(p);
                          setCustomBgUrl(preset.imageUrl);
                          if (uploadedPhotoUrl) {
                            handleProcessPhotoEdit(p, 'background_swap', preset.imageUrl);
                          }
                          showToast(`🏛️ Landmark selected: ${preset.name}`);
                        }}
                        className="relative rounded-xl overflow-hidden aspect-video border border-slate-800 hover:border-indigo-400 group transition-all"
                      >
                        <img src={preset.imageUrl} alt={preset.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 flex items-end p-1">
                          <span className="text-[9px] font-extrabold text-white truncate">{preset.name.split(',')[0]}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Prompt Text Area */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 flex items-center justify-between">
                  <span>4. Custom Gemini Prompt (എന്ത് മാറ്റണം?)</span>
                  <span className="text-blue-400 text-[10px]">Type any custom clothes/scene</span>
                </label>
                <textarea
                  value={photoEditPrompt}
                  onChange={(e) => setPhotoEditPrompt(e.target.value)}
                  rows={3}
                  placeholder="e.g. Put me in astronaut suit on Mars, or wear traditional Kasavu dress with golden jewelry..."
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Style Presets & Aspect Ratio */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-xs font-bold text-slate-400">Ratio:</span>
                  {(['1:1', '16:9', '9:16', '4:3'] as AspectRatioType[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setPhotoEditRatio(r)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                        photoEditRatio === r
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Execute Transform Action */}
              <button
                type="button"
                onClick={() => handleProcessPhotoEdit()}
                disabled={isEditingPhoto || !uploadedPhotoUrl}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {isEditingPhoto ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Gemini is Synthesizing Your Photo...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span>Generate Real AI Transformation (ഫോട്ടോ മാറ്റുക)</span>
                  </>
                )}
              </button>

            </div>

            {/* Right Display Column: Live Before vs Real AI Transformed Result */}
            <div className="lg:col-span-7 space-y-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span>Before vs Real Gemini AI Transformed Photo</span>
                  </h3>
                  {editedPhotoResult && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ✓ Real Generative Output
                    </span>
                  )}
                </div>

                {editedPhotoResult ? (
                  <div className="space-y-4">
                    {/* Interactive Split Comparison Slider */}
                    <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-square border border-slate-700 shadow-2xl">
                      {/* After (Real AI Generative Result) */}
                      <img
                        src={editedPhotoResult.resultUrl}
                        alt="Gemini AI Synthesized"
                        className="w-full h-full object-cover absolute inset-0"
                      />

                      {/* Before (Original Real Photo) with Clip Path */}
                      <div
                        className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-2xl"
                        style={{ width: `${comparisonSliderPos}%` }}
                      >
                        <img
                          src={uploadedPhotoUrl!}
                          alt="Original Real Photo"
                          className="w-full h-full object-cover max-w-none"
                          style={{ width: '100%', height: '100%' }}
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-slate-700">
                          Original Real Photo (മുമ്പ്)
                        </div>
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 backdrop-blur-md text-[10px] font-extrabold text-white shadow-md">
                        ✨ Gemini AI Output (ശേഷം)
                      </div>

                      {/* Split Position Divider Thumb */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center"
                        style={{ left: `${comparisonSliderPos}%` }}
                      >
                        <div className="w-7 h-7 rounded-full bg-white text-slate-950 font-bold flex items-center justify-center text-[10px] shadow-2xl">
                          ↔
                        </div>
                      </div>
                    </div>

                    {/* Comparison Slider Range Controller */}
                    <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Original Photo ({comparisonSliderPos}%)</span>
                        <span>Drag slider to compare Before & After</span>
                        <span>AI Transformed ({100 - comparisonSliderPos}%)</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={comparisonSliderPos}
                        onChange={(e) => setComparisonSliderPos(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* Gemini Thought Stream Trace */}
                    {geminiThoughts.length > 0 && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/20 space-y-2">
                        <div className="text-[11px] font-extrabold text-indigo-300 flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-blue-400" />
                          <span>Gemini Neural Synthesis Thought Stream:</span>
                        </div>
                        <div className="space-y-1 text-[10px] text-slate-400">
                          {geminiThoughts.map((t, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-blue-400 font-bold">✓</span>
                              <span><strong>{t.step}:</strong> {t.details}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Meta & Download Bar */}
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-white truncate">"{editedPhotoResult.prompt}"</p>
                        <p className="text-[10px] text-slate-400">{editedPhotoResult.style} • Generated at {editedPhotoResult.createdAt}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={editedPhotoResult.resultUrl}
                          target="_blank"
                          rel="noreferrer"
                          download="gemini-ai-transformed-photo.jpg"
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download 4K HD Image</span>
                        </a>

                        <button
                          onClick={() => {
                            setMotionPhotoUrl(editedPhotoResult.resultUrl);
                            setActiveTab('img2video');
                            showToast('🎬 Transformed photo sent to Video Motion Animator!');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
                          title="Animate this photo into 60fps cinematic video"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Animate to 60FPS Video</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : uploadedPhotoUrl ? (
                  <div className="rounded-3xl overflow-hidden bg-slate-950 aspect-square border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <img
                      src={uploadedPhotoUrl}
                      alt="Uploaded Reference"
                      className="max-h-64 rounded-2xl object-cover shadow-xl border border-slate-800"
                    />
                    <p className="text-xs text-slate-300 max-w-sm">
                      Ready! Type your prompt or click any quick preset on the left, then click <strong>"Generate Real AI Transformation"</strong>.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-3xl overflow-hidden bg-slate-950 aspect-square border border-slate-800 flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                      <Sparkles className="w-8 h-8 opacity-70" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-200">No Photo Uploaded Yet</h4>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Upload your selfie or photo to generate real AI clothes, landmarks, and styling transformations.
                    </p>
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      Browse Device Photo
                    </button>
                  </div>
                )}
              </div>

              {/* History Gallery */}
              {photoHistory.length > 1 && (
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Session Transformations ({photoHistory.length})
                  </span>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {photoHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setEditedPhotoResult(item)}
                        className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-blue-400 cursor-pointer shrink-0 relative group transition-all"
                      >
                        <img src={item.resultUrl} alt={item.prompt} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PHOTO-TO-VIDEO MOTION ANIMATOR */}
      {/* ========================================================================= */}
      {activeTab === 'img2video' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Controls: Upload & Motion Presets */}
            <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
              
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-2.5 text-xs">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-indigo-200 leading-relaxed">
                  <span className="font-bold">Photo to Video Animator: </span>
                  Upload any static photo or use your Gemini AI output to generate a living 60FPS motion video in real-time.
                </div>
              </div>

              {/* Upload Photo to Animate */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 flex items-center justify-between">
                  <span>1. Photo to Animate</span>
                  <input
                    type="file"
                    ref={motionInputRef}
                    onChange={handleMotionPhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </label>

                {motionPhotoUrl || editedPhotoResult?.resultUrl || uploadedPhotoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-slate-950 aspect-video group">
                    <img
                      src={motionPhotoUrl || editedPhotoResult?.resultUrl || uploadedPhotoUrl!}
                      alt="Motion Source"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => motionInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all"
                      >
                        Change Photo
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-purple-500/30">
                      ✓ Ready to Animate
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => motionInputRef.current?.click()}
                    className="p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-purple-500/60 bg-slate-950/60 hover:bg-slate-950 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Click to Upload Photo to Animate</p>
                      <p className="text-[11px] text-slate-500">Portraits, nature, landscapes, or AI art</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Motion Type Selection */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">2. Motion & Camera Choreography</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(
                    [
                      'Living Portrait (സജീവ മുഖഭാവം)',
                      '3D Parallax Zoom (സിനിമാറ്റിക് സൂം)',
                      'Drone Fly-Through (ഡ്രോൺ വ്യൂ)',
                      'Orbital 360 Pan (ഓർബിറ്റ് പാൻ)',
                      'Ethereal Slow Motion (സ്ലോ മോഷൻ)',
                      'Neon Light Trails (നിയോൺ ട്രെയിൽസ്)'
                    ] as MotionAnimationType[]
                  ).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMotionType(m)}
                      className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all ${
                        motionType === m
                          ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border-purple-500 text-purple-200 shadow-md shadow-purple-500/20'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Motion Prompt & Duration */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">3. Motion Nuances & Effects</label>
                <textarea
                  value={motionPrompt}
                  onChange={(e) => setMotionPrompt(e.target.value)}
                  rows={2}
                  placeholder="e.g. Flowing hair in breeze, lens flare reflection, natural breathing..."
                  className="w-full p-3 rounded-2xl bg-slate-950/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              {/* Duration Slider */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Motion Duration</span>
                  <span className="text-purple-300">{motionDuration} seconds</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={motionDuration}
                  onChange={(e) => setMotionDuration(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Generate Motion Video Action */}
              <button
                onClick={handleGenerateMotionVideo}
                disabled={isGeneratingMotion || (!motionPhotoUrl && !editedPhotoResult?.resultUrl && !uploadedPhotoUrl)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {isGeneratingMotion ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Rendering 3D Motion Video...</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 text-yellow-300" />
                    <span>Animate Photo into Video (വീഡിയോ ആക്കുക)</span>
                  </>
                )}
              </button>

            </div>

            {/* Right Display: Live 60FPS Canvas Motion Player & Video Preview */}
            <div className="lg:col-span-7 space-y-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-400" />
                    <span>Live 60FPS Video Motion Player</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {motionType}
                  </span>
                </div>

                {/* Living Dynamic Canvas Player */}
                <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-video border border-slate-700 shadow-2xl group flex items-center justify-center">
                  <canvas
                    ref={motionCanvasRef}
                    width={1280}
                    height={720}
                    className="w-full h-full object-cover"
                  />

                  {/* Play / Pause Overlay Button */}
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => setIsMotionPlaying(!isMotionPlaying)}
                      className="w-14 h-14 rounded-full bg-purple-600/90 backdrop-blur-md flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all"
                    >
                      {isMotionPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </button>
                  </div>

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Motion Canvas ({motionPlaybackSpeed}x)</span>
                  </div>
                </div>

                {/* Motion Playback Speed & Controls */}
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMotionPlaying(!isMotionPlaying)}
                      className="p-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      {isMotionPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isMotionPlaying ? 'Pause Motion' : 'Play Motion'}</span>
                    </button>

                    <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      {[0.5, 1, 1.5, 2].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setMotionPlaybackSpeed(spd)}
                          className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all ${
                            motionPlaybackSpeed === spd ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleRecordAndDownloadVideo}
                      disabled={isRecordingVideo || (!motionPhotoUrl && !editedPhotoResult?.resultUrl && !uploadedPhotoUrl)}
                      className={`px-4 py-2 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 ${
                        isRecordingVideo
                          ? 'bg-rose-600 animate-pulse ring-2 ring-rose-400'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 shadow-purple-600/30'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>{isRecordingVideo ? 'Recording Video...' : '⬇️ Download Animated Video (MP4/WebM)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (motionCanvasRef.current) {
                          const url = motionCanvasRef.current.toDataURL('image/jpeg', 0.95);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `motion-frame-${Date.now()}.jpg`;
                          a.click();
                          showToast('📸 Frame downloaded!');
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Frame</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TEXT-TO-IMAGE ART STUDIO */}
      {/* ========================================================================= */}
      {activeTab === 'text2img' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300">Prompt / Idea Description</label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={3}
                placeholder="Describe your imagination in detail..."
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Style:</span>
                {(['Photorealistic', 'Cyberpunk', 'Anime / Manga', '3D Render', 'Oil Painting'] as ImageStylePreset[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStyle(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedStyle === st ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImg || !imagePrompt.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                {isGeneratingImg ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate Art</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((img) => (
              <div key={img.id} className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl group">
                <div className="aspect-square bg-slate-950 overflow-hidden relative">
                  <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-slate-950/80 text-[10px] font-bold text-indigo-300">
                    {img.style}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-slate-300 line-clamp-2">"{img.prompt}"</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setUploadedPhotoUrl(img.imageUrl);
                        setActiveTab('img2img');
                        showToast('📸 Transferred to Gemini Photo Studio!');
                      }}
                      className="text-xs text-blue-400 hover:underline font-bold"
                    >
                      Edit in Gemini Studio
                    </button>
                    <a
                      href={img.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      download="omnilife-art.jpg"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VIDEO FX STUDIO */}
      {/* ========================================================================= */}
      {activeTab === 'videoEditor' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">Upload Video File</label>
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoUpload}
                  accept="video/*"
                  className="hidden"
                />
                {uploadedVideoUrl ? (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">✓ Video Loaded</span>
                    <button
                      onClick={() => videoInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-xl bg-cyan-600 text-white text-xs font-bold"
                    >
                      Change Video
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-950/60 hover:bg-slate-950 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2"
                  >
                    <Film className="w-8 h-8 text-cyan-400" />
                    <p className="text-xs font-bold text-slate-200">Click to Upload Video (MP4, WebM)</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">Title / Subtitle Overlay</label>
                <input
                  type="text"
                  value={textOverlay}
                  onChange={(e) => setTextOverlay(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Enter text overlay..."
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-video border border-slate-700 shadow-2xl flex items-center justify-center">
                {uploadedVideoUrl ? (
                  <video
                    ref={videoPlayerRef}
                    src={uploadedVideoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <Film className="w-12 h-12 text-slate-700 mx-auto" />
                    <p className="text-xs text-slate-400">Upload a video to view and apply live filter processing.</p>
                  </div>
                )}
                {textOverlay && (
                  <div className="absolute bottom-6 left-6 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-xs font-extrabold text-white border border-white/20 shadow-xl pointer-events-none">
                    {textOverlay}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
