import React, { useState } from 'react';
import { 
  Share2, 
  Heart, 
  MessageCircle, 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  TrendingUp, 
  CheckCircle2, 
  Bookmark, 
  MoreHorizontal 
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import confetti from 'canvas-confetti';
import { getSafeAvatarUrl, handleAvatarError } from '../../utils/avatarUtils';

export const SocialFeedView: React.FC = () => {
  const { user, posts, stories, likePost, addComment, createPost, showToast } = useSuperApp();
  
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    createPost(newPostContent, newPostMedia);
    setNewPostContent('');
    showToast('🚀 Post published to the global feed!');
  };

  const handleAICaption = () => {
    setIsGeneratingCaption(true);
    showToast('✨ AI Copilot generating viral caption...');
    setTimeout(() => {
      const suggestions = [
        'Building the future with Aditi Boundless Super App! 🌐 Everything in one place. #Productivity #AI',
        'Exploring new horizons and creating timeless ideas today with Aditi! ✨ #LifeOS #CreativeVibes',
        'Just wrapped up an incredible deep learning session! 🧠 Knowledge is compounding. #TechInnovation'
      ];
      setNewPostContent(suggestions[Math.floor(Math.random() * suggestions.length)]);
      setIsGeneratingCaption(false);
      showToast('Caption generated!');
    }, 500);
  };

  const handlePostComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addComment(postId, commentInput);
    setCommentInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-6">
      
      {/* Stories Bar */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 sm:gap-4 min-w-max">
          {/* User's story add button */}
          <div className="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 border-2 border-dashed border-indigo-500 flex items-center justify-center bg-slate-950">
              <img
                src={getSafeAvatarUrl(user.avatar, user.name)}
                alt={user.name}
                onError={(e) => handleAvatarError(e, user.name)}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-md">
                +
              </div>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-300">Your Story</span>
          </div>

          {/* Other stories */}
          {stories.map((s) => (
            <div
              key={s.id}
              onClick={() => showToast(`Viewing ${s.user.name}'s story...`)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0"
            >
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center ${s.hasUnseen ? 'animate-pulse' : ''}`}>
                <div className="w-full h-full rounded-full p-0.5 bg-slate-950">
                  <img
                    src={getSafeAvatarUrl(s.user.avatar, s.user.name)}
                    alt={s.user.name}
                    onError={(e) => handleAvatarError(e, s.user.name)}
                    className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-300 truncate max-w-[60px] sm:max-w-[64px]">
                {s.user.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Left/Center: Posts Feed */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          
          {/* Create Post Composer */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <img
                src={getSafeAvatarUrl(user.avatar, user.name)}
                alt={user.name}
                onError={(e) => handleAvatarError(e, user.name)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-indigo-500/30 flex-shrink-0"
              />
              <input
                type="text"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's inspiring you today?"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleAICaption}
                  disabled={isGeneratingCaption}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 active:scale-95 border border-indigo-500/30 text-indigo-300 font-bold flex items-center gap-1.5 transition-all text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>AI Caption</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const sampleImages = [
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
                    ];
                    setNewPostMedia(sampleImages[Math.floor(Math.random() * sampleImages.length)]);
                    showToast('Media attachment updated!');
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-colors"
                  title="Change Image Attachment"
                >
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                </button>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="px-4 sm:px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/30 transition-all active:scale-95 text-xs"
              >
                <span>Publish</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Posts Stream */}
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden space-y-3"
            >
              {/* Post Author Header */}
              <div className="p-3.5 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <img
                    src={getSafeAvatarUrl(post.author.avatar, post.author.name)}
                    alt={post.author.name}
                    onError={(e) => handleAvatarError(e, post.author.name)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-indigo-500/20 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-xs sm:text-sm text-white">{post.author.name}</h4>
                      {post.author.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-400">{post.author.handle} • {post.timestamp}</p>
                  </div>
                </div>

                <button className="p-2 text-slate-400 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Content Text */}
              <div className="px-3.5 sm:px-4 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="px-3.5 sm:px-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] font-bold text-indigo-400 hover:underline cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Media Preview */}
              {post.mediaUrl && (
                <div className="relative aspect-video sm:aspect-[16/9] bg-slate-950 overflow-hidden">
                  <img
                    src={post.mediaUrl}
                    alt="Post media"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Engagement Buttons */}
              <div className="p-3.5 sm:p-4 pt-1 flex items-center justify-between border-t border-slate-800 text-xs text-slate-400 font-semibold">
                <div className="flex items-center gap-4">
                  
                  {/* Like Button */}
                  <button
                    onClick={() => {
                      likePost(post.id);
                      if (!post.isLiked) {
                        confetti({ particleCount: 30, spread: 40 });
                      }
                    }}
                    className={`flex items-center gap-1.5 transition-colors active:scale-95 ${
                      post.isLiked ? 'text-pink-500 font-bold' : 'hover:text-pink-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-pink-500' : ''}`} />
                    <span>{post.likesCount}</span>
                  </button>

                  {/* Comment Toggle */}
                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount}</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `Post by ${post.author.name}`,
                          text: post.content,
                          url: window.location.href
                        });
                      } else {
                        showToast('Link copied to clipboard!');
                      }
                    }}
                    className="flex items-center gap-1.5 hover:text-slate-200 transition-colors active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                </div>

                <button
                  onClick={() => showToast('Post saved to your bookmarks!')}
                  className="hover:text-amber-400 transition-colors p-1"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {/* Comments Accordion */}
              {activeCommentPostId === post.id && (
                <div className="p-3.5 sm:p-4 bg-slate-950/60 border-t border-slate-800 space-y-3 animate-in fade-in">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {post.comments.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic text-center py-2">No comments yet. Start the conversation!</p>
                    ) : (
                      post.comments.map((c) => (
                        <div key={c.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-start gap-2.5">
                          <img
                            src={getSafeAvatarUrl(c.avatar, c.author)}
                            alt={c.author}
                            onError={(e) => handleAvatarError(e, c.author)}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[11px] text-white">{c.author}</span>
                              <span className="text-[9px] text-slate-500">{c.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-300 mt-0.5">{c.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePostComment(post.id)}
                      placeholder="Write a thoughtful comment..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => handlePostComment(post.id)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 active:scale-95"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}

        </div>

        {/* Right Column: Trending Topics & Suggestions */}
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pink-400" />
              <h3 className="font-bold text-sm text-white">Trending in Kerala & Tech</h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { tag: '#AditiSuperApp', posts: '14.2k posts' },
                { tag: '#KeralaKasavuAI', posts: '9.8k posts' },
                { tag: '#KochiTechCorridor', posts: '6.4k posts' },
                { tag: '#VedicAstrology2026', posts: '4.1k posts' }
              ].map((t) => (
                <div key={t.tag} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <span className="font-bold text-indigo-300">{t.tag}</span>
                  <span className="text-[10px] text-slate-500">{t.posts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
