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
  X,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { SocialPost } from '../../types/superApp';
import confetti from 'canvas-confetti';

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
    }, 600);
  };

  const handlePostComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addComment(postId, commentInput);
    setCommentInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Stories Bar */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-x-auto">
        <div className="flex items-center gap-4 min-w-max">
          {/* User's story add button */}
          <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
            <div className="relative w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-indigo-500 flex items-center justify-center bg-slate-950">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-md">
                +
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-300">Your Story</span>
          </div>

          {/* Other stories */}
          {stories.map((s) => (
            <div
              key={s.id}
              onClick={() => showToast(`Viewing ${s.user.name}'s story...`)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className={`w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center ${s.hasUnseen ? 'animate-pulse' : ''}`}>
                <div className="w-full h-full rounded-full p-0.5 bg-slate-950">
                  <img
                    src={s.user.avatar}
                    alt={s.user.name}
                    className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-300 truncate max-w-[64px]">
                {s.user.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Center: Posts Feed */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Create Post Composer */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <input
                type="text"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's inspiring you today?"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAICaption}
                  disabled={isGeneratingCaption}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 font-bold flex items-center gap-1.5 transition-colors"
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
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Change Image Attachment"
                >
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                </button>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/30 transition-all"
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
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-xs sm:text-sm text-white">{post.author.name}</h4>
                      {post.author.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{post.author.handle} • {post.timestamp}</p>
                  </div>
                </div>

                <button className="p-2 text-slate-400 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Content Text */}
              <div className="px-4 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="px-4 flex flex-wrap gap-1.5">
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
              <div className="p-4 pt-1 flex items-center justify-between border-t border-slate-800 text-xs text-slate-400 font-semibold">
                <div className="flex items-center gap-4">
                  
                  {/* Like Button */}
                  <button
                    onClick={() => {
                      likePost(post.id);
                      if (!post.isLiked) {
                        confetti({ particleCount: 30, spread: 40 });
                      }
                    }}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.isLiked ? 'text-pink-500 font-bold' : 'hover:text-pink-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-pink-500' : ''}`} />
                    <span>{post.likesCount}</span>
                  </button>

                  {/* Comment Toggle */}
                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount}</span>
                  </button>

                  {/* Share */}
                  <button
                    onClick={() => showToast('🔗 Post link copied to clipboard!')}
                    className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{post.sharesCount}</span>
                  </button>
                </div>

                <button
                  onClick={() => showToast('Post bookmarked!')}
                  className="hover:text-amber-400 transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {/* Comments Section Drawer */}
              {activeCommentPostId === post.id && (
                <div className="p-4 bg-slate-950/70 border-t border-slate-800 space-y-3 animate-in fade-in">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {post.comments.length === 0 ? (
                      <p className="text-[11px] text-slate-500 text-center py-2">No comments yet. Be the first!</p>
                    ) : (
                      post.comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2.5 text-xs">
                          <img src={c.avatar} alt={c.author} className="w-6 h-6 rounded-full object-cover mt-0.5" />
                          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="font-bold text-slate-200">{c.author}</span>
                              <span>{c.timestamp}</span>
                            </div>
                            <p className="text-slate-300 mt-0.5">{c.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Comment Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => handlePostComment(post.id)}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}

        </div>

        {/* Right Column: Trending Hashtags & Top Creators */}
        <div className="space-y-6">
          
          {/* Trending Topics */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="font-extrabold text-sm text-white">Trending in Aditi</h3>
            </div>

            <div className="space-y-2.5">
              {[
                { tag: '#AutonomousAI', posts: '42.8k posts', category: 'Technology' },
                { tag: '#LuxuryRealEstate', posts: '18.4k posts', category: 'Architecture' },
                { tag: '#VedicAstrology2026', posts: '12.1k posts', category: 'Lifestyle' },
                { tag: '#PyTorchMastery', posts: '8.9k posts', category: 'Education' },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => showToast(`Filtering feed by ${item.tag}`)}
                  className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition-colors"
                >
                  <p className="text-[10px] text-slate-400 font-medium">{item.category} • Trending</p>
                  <p className="text-xs font-bold text-white hover:text-indigo-300">{item.tag}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.posts}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Creator Spotlight */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/40 to-slate-900 border border-indigo-800/30 shadow-xl space-y-3 text-center">
            <h4 className="font-extrabold text-xs text-indigo-300 uppercase tracking-wider">Creator Community</h4>
            <p className="text-xs text-slate-300">
              Share your AI art, tutoring insights, or property tours with over 250,000 verified users worldwide!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
