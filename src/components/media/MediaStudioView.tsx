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
  Sparkle
} from 'lucide-react';
import { generateFreeImage } from '../../services/freeAiService';
import { 
  readFileAsDataUrl, 
  editPhotoWithAiPrompt, 
  animatePhotoToVideo, 
  applyCanvasFilter, 
  AiPhotoEditMode, 
  MotionAnimationType, 
  ProcessedMediaItem 
} from '../../services/clientMediaAiEngine';
import { AspectRatioType, GeneratedImage, GeneratedVideo, ImageStylePreset, VideoEditorClip } from '../../types/superApp';
import { useSuperApp } from '../../context/SuperAppContext';
import confetti from 'canvas-confetti';

export const MediaStudioView: React.FC = () => {
  const { showToast } = useSuperApp();
  const [activeTab, setActiveTab] = useState<'text2img' | 'img2img' | 'img2video' | 'videoEditor'>('img2img');

  /* ========================================================================= */
  /* 1. TEXT-TO-IMAGE GENERATOR STATE */
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

  /* ========================================================================= */
  /* 2. PHOTO-TO-IMAGE AI PROMPT EDITOR STATE (PHOTO UPLOAD & EDIT) */
  /* ========================================================================= */
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [photoEditPrompt, setPhotoEditPrompt] = useState('Change outfit to traditional Kerala Kasavu gold attire with Onam floral backdrop');
  const [photoEditMode, setPhotoEditMode] = useState<AiPhotoEditMode>('Kerala Traditional Look (കേരള തനിമ)');
  const [photoEditStyle, setPhotoEditStyle] = useState<ImageStylePreset>('Photorealistic');
  const [photoEditRatio, setPhotoEditRatio] = useState<AspectRatioType>('1:1');
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [editedPhotoResult, setEditedPhotoResult] = useState<ProcessedMediaItem | null>(null);
  const [comparisonSliderPos, setComparisonSliderPos] = useState<number>(50); // 0 to 100%
  const [photoHistory, setPhotoHistory] = useState<ProcessedMediaItem[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUploadedPhotoUrl(dataUrl);
      setEditedPhotoResult(null);
      showToast(`📸 Photo "${file.name}" loaded securely in browser memory (Zero DB storage)!`);
    } catch (err) {
      showToast('⚠️ Failed to read photo file.');
    }
  };

  const handleProcessPhotoEdit = async () => {
    if (!uploadedPhotoUrl) {
      showToast('⚠️ Please upload a reference photo first.');
      return;
    }
    if (!photoEditPrompt.trim()) {
      showToast('⚠️ Please describe your desired photo edit.');
      return;
    }

    setIsEditingPhoto(true);
    showToast('✨ AI is transforming your uploaded photo (100% Client-Side Private)...');

    try {
      const result = await editPhotoWithAiPrompt(
        uploadedPhotoUrl,
        photoEditPrompt,
        photoEditMode,
        photoEditStyle,
        photoEditRatio
      );

      setEditedPhotoResult(result);
      setPhotoHistory((prev) => [result, ...prev]);
      confetti({ particleCount: 60, spread: 70 });
      showToast('🎉 Photo successfully transformed by AI prompt!');
    } catch (err) {
      showToast('⚠️ Photo transformation encountered an issue.');
    } finally {
      setIsEditingPhoto(false);
    }
  };

  /* ========================================================================= */
  /* 3. PHOTO-TO-VIDEO MOTION ANIMATOR STATE (PHOTO UPLOAD ➔ VIDEO) */
  /* ========================================================================= */
  const [motionPhotoUrl, setMotionPhotoUrl] = useState<string | null>(null);
  const [motionType, setMotionType] = useState<MotionAnimationType>('Living Portrait (സജീവ മുഖഭാവം)');
  const [motionPrompt, setMotionPrompt] = useState('Gentle natural breathing, subtle eye blinking, golden sunlight flare');
  const [motionDuration, setMotionDuration] = useState<number>(5);
  const [isGeneratingMotion, setIsGeneratingMotion] = useState(false);
  const [motionVideoResult, setMotionVideoResult] = useState<ProcessedMediaItem | null>(null);
  const [isMotionPlaying, setIsMotionPlaying] = useState(true);
  const [motionPlaybackSpeed, setMotionPlaybackSpeed] = useState<number>(1);
  const [motionCanvasPhase, setMotionCanvasPhase] = useState<number>(0);
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
    const photoToAnimate = motionPhotoUrl || uploadedPhotoUrl;
    if (!photoToAnimate) {
      showToast('⚠️ Please upload a photo to animate.');
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
          setMotionCanvasPhase(phase);

          const imgElement = new Image();
          imgElement.crossOrigin = 'anonymous';
          imgElement.src = motionVideoResult?.resultUrl || motionPhotoUrl || uploadedPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800';

          imgElement.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Compute dynamic 3D parallax / zoom / living portrait offsets
            let scale = 1.0;
            let dx = 0;
            let dy = 0;

            if (motionType.includes('Living Portrait')) {
              scale = 1.02 + Math.sin(phase) * 0.025; // Gentle breathing pulse
              dy = Math.sin(phase * 0.8) * 3;
            } else if (motionType.includes('3D Parallax Zoom')) {
              scale = 1.0 + ((phase % 6) / 6) * 0.15; // Continuous cinematic zoom
              dx = Math.sin(phase * 0.5) * 8;
            } else if (motionType.includes('Drone Fly-Through')) {
              scale = 1.0 + Math.sin(phase * 0.6) * 0.12;
              dx = Math.cos(phase * 0.4) * 12;
              dy = Math.sin(phase * 0.3) * 6;
            } else if (motionType.includes('Orbital 360 Pan')) {
              dx = Math.sin(phase) * 16;
              dy = Math.cos(phase * 0.5) * 6;
            }

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(scale, scale);
            ctx.translate(-canvas.width / 2 + dx, -canvas.height / 2 + dy);
            ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

            // Light flare layer
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
  }, [isMotionPlaying, motionVideoResult, motionPhotoUrl, uploadedPhotoUrl, motionType, motionPlaybackSpeed]);

  /* ========================================================================= */
  /* 4. VIDEO UPLOAD & AI FX TIMELINE EDITOR STATE */
  /* ========================================================================= */
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [editorFilter, setEditorFilter] = useState<'None' | 'Cyber' | 'Anime' | 'Vintage' | 'Noir' | 'Warm' | 'Vibrant'>('Cyber');
  const [textOverlay, setTextOverlay] = useState('Aditi SuperApp 2026');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoPlayhead, setVideoPlayhead] = useState(0); // 0 to 100%
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
      
      {/* Studio Header & Tab Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-pink-500/25">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">AI Creative Media Studio</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>100% Client-Side Private (Zero DB Storage)</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload photos/videos, edit with AI prompts, and animate into cinematic motion videos directly in-browser.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('img2img')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'img2img'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>📸 Photo AI Editor (Edit with Prompt)</span>
          </button>

          <button
            onClick={() => setActiveTab('img2video')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'img2video'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>🎬 Photo to Video Animator</span>
          </button>

          <button
            onClick={() => setActiveTab('text2img')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'text2img'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🎨 Text to Image Art</span>
          </button>

          <button
            onClick={() => setActiveTab('videoEditor')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'videoEditor'
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>🎞️ Video Upload & FX</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PHOTO-TO-IMAGE AI PROMPT EDITOR (UPLOAD & EDIT PHOTO BY PROMPT) */}
      {/* ========================================================================= */}
      {activeTab === 'img2img' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Controls Column: Photo Upload & Prompt Formulation */}
            <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
              
              {/* Privacy Notice Card */}
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-emerald-200 leading-relaxed">
                  <span className="font-bold">100% Client-Side Privacy: </span>
                  Your uploaded photos are processed strictly in browser memory. They are <strong>never stored</strong> in any cloud database or server.
                </div>
              </div>

              {/* Photo Upload Area */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 flex items-center justify-between">
                  <span>1. Upload Reference Photo</span>
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
                  <div className="relative rounded-2xl overflow-hidden border-2 border-pink-500/40 bg-slate-950 aspect-video group">
                    <img
                      src={uploadedPhotoUrl}
                      alt="Uploaded Reference"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => photoInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-pink-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all"
                      >
                        Change Photo
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-pink-300 border border-pink-500/30">
                      ✓ Photo Loaded in Memory
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-pink-500/60 bg-slate-950/60 hover:bg-slate-950 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-pink-600/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Click to Upload Photo or Drag & Drop</p>
                      <p className="text-[11px] text-slate-500">Supports JPG, PNG, WebP (High Resolution)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Edit Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">2. Transformation Goal (എഡിറ്റ് ചെയ്യേണ്ട രീതി)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(
                    [
                      'Kerala Traditional Look (കേരള തനിമ)',
                      'Cyberpunk Avatar (സൈബർപങ്ക്)',
                      'Anime / Watercolor (അനിമേഷൻ)',
                      'Background Swap (പശ്ചാത്തലം മാറ്റുക)',
                      'Royal Vintage Oil Painting (ഓയിൽ പെയിന്റിംഗ്)',
                      '4K Ultra HDR Enhancer (എച്ച്.ഡി.ആർ)'
                    ] as AiPhotoEditMode[]
                  ).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPhotoEditMode(mode)}
                      className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all ${
                        photoEditMode === mode
                          ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 border-pink-500 text-pink-200 shadow-md shadow-pink-500/20'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Description Input */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 flex items-center justify-between">
                  <span>3. Edit Instructions / Prompt</span>
                  <span className="text-indigo-400 text-[10px]">Describe desired modifications</span>
                </label>
                <textarea
                  value={photoEditPrompt}
                  onChange={(e) => setPhotoEditPrompt(e.target.value)}
                  rows={3}
                  placeholder="e.g. Turn outfit into royal Kasavu sari with temple background, realistic lighting..."
                  className="w-full p-3.5 rounded-2xl bg-slate-950/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                />
              </div>

              {/* Style Presets & Aspect Ratio */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-400">Style Flavor:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['Photorealistic', 'Cinematic Film', 'Digital Art', 'Oil Painting'] as ImageStylePreset[]).map((style) => (
                      <button
                        key={style}
                        onClick={() => setPhotoEditStyle(style)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          photoEditStyle === style
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Execute Transform Action */}
              <button
                onClick={handleProcessPhotoEdit}
                disabled={isEditingPhoto || !uploadedPhotoUrl || !photoEditPrompt.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {isEditingPhoto ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Photo with AI (ഫോട്ടോ എഡിറ്റ് ചെയ്യുന്നു)...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-yellow-300" />
                    <span>Apply AI Prompt Edit (ഫോട്ടോ എഡിറ്റ് ചെയ്യുക)</span>
                  </>
                )}
              </button>

            </div>

            {/* Right Display Column: Live Before vs After Comparison & Result Preview */}
            <div className="lg:col-span-7 space-y-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Eye className="w-4 h-4 text-pink-400" />
                    <span>Interactive Before vs AI Edited Preview</span>
                  </h3>
                  {editedPhotoResult && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ✓ Transformation Complete
                    </span>
                  )}
                </div>

                {editedPhotoResult ? (
                  <div className="space-y-4">
                    {/* Interactive Split Comparison Slider */}
                    <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-square border border-slate-700 shadow-2xl">
                      {/* After (AI Edited Result) Image */}
                      <img
                        src={editedPhotoResult.resultUrl}
                        alt="AI Edited Result"
                        className="w-full h-full object-cover absolute inset-0"
                      />

                      {/* Before (Original Uploaded) Image with Clip Path */}
                      <div
                        className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-2xl"
                        style={{ width: `${comparisonSliderPos}%` }}
                      >
                        <img
                          src={uploadedPhotoUrl!}
                          alt="Original Uploaded"
                          className="w-full h-full object-cover max-w-none"
                          style={{ width: '100%', height: '100%' }}
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-slate-700">
                          Original Photo (മുമ്പ്)
                        </div>
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-pink-600/90 backdrop-blur-md text-[10px] font-bold text-white shadow-md">
                        AI Edited (ശേഷം)
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
                        <span>AI Edited ({100 - comparisonSliderPos}%)</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={comparisonSliderPos}
                        onChange={(e) => setComparisonSliderPos(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                    </div>

                    {/* Meta & Download Bar */}
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">"{editedPhotoResult.prompt}"</p>
                        <p className="text-[10px] text-slate-400">{editedPhotoResult.style} • Created {editedPhotoResult.createdAt}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={editedPhotoResult.resultUrl}
                          target="_blank"
                          rel="noreferrer"
                          download="ai-edited-photo.jpg"
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download HD Photo</span>
                        </a>

                        <button
                          onClick={() => {
                            setMotionPhotoUrl(editedPhotoResult.resultUrl);
                            setActiveTab('img2video');
                            showToast('🎬 Photo transferred to Video Motion Animator!');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
                          title="Animate this edited photo into motion video"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Animate to Video</span>
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
                    <p className="text-xs text-slate-400 max-w-sm">
                      Ready to transform! Select your edit mode and prompt on the left, then click <strong>"Apply AI Prompt Edit"</strong>.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-3xl overflow-hidden bg-slate-950 aspect-square border border-slate-800 flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-pink-400">
                      <ImageIcon className="w-8 h-8 opacity-60" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-300">No Photo Uploaded Yet</h4>
                    <p className="text-xs text-slate-500 max-w-xs">
                      Upload your portrait, selfie, or scenery photo to apply instant AI prompt transformations.
                    </p>
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                    >
                      Browse Device Photo
                    </button>
                  </div>
                )}
              </div>

              {/* History Gallery */}
              {photoHistory.length > 1 && (
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Session Transformations ({photoHistory.length})</span>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {photoHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setEditedPhotoResult(item)}
                        className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-pink-500 cursor-pointer flex-shrink-0 relative group transition-all"
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
      {/* TAB 2: PHOTO-TO-VIDEO MOTION ANIMATOR (UPLOAD PHOTO ➔ VIDEO) */}
      {/* ========================================================================= */}
      {activeTab === 'img2video' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Controls: Upload & Motion Presets */}
            <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
              
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-2.5 text-xs">
                <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-indigo-200 leading-relaxed">
                  <span className="font-bold">Photo to Video Animator: </span>
                  Upload any static photo to generate a living, dynamic 3D camera motion video sequence in real-time.
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

                {motionPhotoUrl || uploadedPhotoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-slate-950 aspect-video group">
                    <img
                      src={motionPhotoUrl || uploadedPhotoUrl!}
                      alt="Motion Source"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => motionInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all"
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
                disabled={isGeneratingMotion || (!motionPhotoUrl && !uploadedPhotoUrl)}
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

                  {motionVideoResult && (
                    <a
                      href={motionVideoResult.resultUrl}
                      target="_blank"
                      rel="noreferrer"
                      download="motion-video.jpg"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download HD Keyframes</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TEXT-TO-IMAGE ARTWORK GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === 'text2img' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            
            {/* Prompt input */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300 flex items-center justify-between">
                <span>Prompt Description</span>
                <span className="text-indigo-400">100% Free Unlimited Pollinations FLUX Engine</span>
              </label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={3}
                placeholder="Describe what you want to create in vivid detail..."
                className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Style Presets */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300">Style Preset</label>
              <div className="flex flex-wrap gap-2">
                {(['Cyberpunk', 'Photorealistic', 'Anime / Manga', '3D Render', 'Oil Painting', 'Cinematic Film', 'Digital Art'] as ImageStylePreset[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedStyle === style
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/20'
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
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
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
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Creation Gallery ({gallery.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/40 shadow-xl group transition-all"
                >
                  <div className="relative overflow-hidden bg-slate-950 aspect-square">
                    <img
                      src={img.imageUrl}
                      alt={img.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
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
                            setUploadedPhotoUrl(img.imageUrl);
                            setActiveTab('img2img');
                            showToast('📸 Loaded into Photo AI Editor!');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-pink-600/30 text-pink-300 text-[11px] font-bold transition-colors"
                          title="Edit this image with photo prompts"
                        >
                          Edit
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
      {/* TAB 4: VIDEO UPLOAD & AI FX STUDIO */}
      {/* ========================================================================= */}
      {activeTab === 'videoEditor' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Controls */}
            <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
              
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-2.5 text-xs">
                <Scissors className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-cyan-200 leading-relaxed">
                  <span className="font-bold">Client-Side Video Studio: </span>
                  Upload your video file (MP4/WebM) to apply instant AI filters, color grades, and subtitle overlays in browser memory.
                </div>
              </div>

              {/* Upload Local Video */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">1. Upload Video File</label>
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoUpload}
                  accept="video/*"
                  className="hidden"
                />

                {uploadedVideoUrl ? (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">✓ Video Loaded in Browser</span>
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
                    className="p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-950/60 hover:bg-slate-950 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Film className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Click to Upload Video (MP4, WebM)</p>
                      <p className="text-[11px] text-slate-500">100% Client-Side Private Processing</p>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Neural Color Filters */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">2. AI Neural Filter & Color Matrix</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Cyber', 'Anime', 'Vintage', 'Noir', 'Warm', 'Vibrant'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setEditorFilter(filter)}
                      className={`p-2 rounded-xl text-center text-xs font-bold border transition-all ${
                        editorFilter === filter
                          ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200 shadow-md'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overlay Captions */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">3. Title / Subtitle Overlay</label>
                <input
                  type="text"
                  value={textOverlay}
                  onChange={(e) => setTextOverlay(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Enter text overlay..."
                />
              </div>

            </div>

            {/* Right Video Player */}
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
