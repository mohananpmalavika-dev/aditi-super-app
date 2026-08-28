import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Flame, 
  Clock, 
  Calendar, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  Droplet, 
  Smile, 
  X, 
  Target 
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { TaskItem } from '../../types/superApp';
import confetti from 'canvas-confetti';

export const TasksAndCalendar: React.FC = () => {
  const { tasks, addTask, toggleTaskStatus, deleteTask, habits, toggleHabitDay, showToast } = useSuperApp();
  
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskItem['category']>('Work');
  const [taskPriority, setTaskPriority] = useState<TaskItem['priority']>('medium');
  const [taskDueDate, setTaskDueDate] = useState('Today, 6:00 PM');

  /* ========== POMODORO FOCUS TIMER ========== */
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(false);
  const [pomoMode, setPomoMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPomoRunning && pomoSeconds > 0) {
      interval = setInterval(() => {
        setPomoSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomoSeconds === 0) {
      setIsPomoRunning(false);
      confetti({ particleCount: 80, spread: 70 });
      showToast(pomoMode === 'focus' ? '🎉 Pomodoro Focus Session Complete! Take a 5-min break.' : '⏰ Break over! Ready for another focus round?');
      if (pomoMode === 'focus') {
        setPomoMode('break');
        setPomoSeconds(5 * 60);
      } else {
        setPomoMode('focus');
        setPomoSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isPomoRunning, pomoSeconds, pomoMode]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle,
      category: taskCategory,
      priority: taskPriority,
      dueDate: taskDueDate,
      status: 'todo'
    });
    setTaskTitle('');
    setShowNewTaskModal(false);
    showToast('✨ New task created successfully!');
  };

  /* ========== WELLNESS: WATER & MOOD ========== */
  const [waterGlasses, setWaterGlasses] = useState(6);
  const [todayMood, setTodayMood] = useState('Energetic 🚀');

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 flex-shrink-0">
            <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-extrabold text-white">Daily LifeOS & Productivity</h1>
              <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Kanban & Focus
              </span>
            </div>
            <p className="text-xs text-slate-400">Manage tasks, track habit consistency heatmaps, and run Pomodoro focus sessions.</p>
          </div>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Top Row: Focus Timer + Habit Streaks + Daily Wellness */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* 1. Pomodoro Focus Timer */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40 shadow-xl space-y-3.5 text-center">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Pomodoro Timer</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
              {pomoMode === 'focus' ? 'Deep Work' : 'Rest Break'}
            </span>
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight py-1">
            {Math.floor(pomoSeconds / 60).toString().padStart(2, '0')}:{(pomoSeconds % 60).toString().padStart(2, '0')}
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsPomoRunning(!isPomoRunning)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              {isPomoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPomoRunning ? 'Pause' : 'Start Focus'}</span>
            </button>
            <button
              onClick={() => {
                setIsPomoRunning(false);
                setPomoSeconds(pomoMode === 'focus' ? 25 * 60 : 5 * 60);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-400 hover:text-white transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Habits Streak Checklist */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Habits Streak (7-Day)</span>
            </h3>
          </div>

          <div className="space-y-2.5">
            {habits.map((h) => (
              <div key={h.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1.5">
                  <span className="truncate pr-2">{h.name}</span>
                  <span className="text-orange-400 font-bold flex-shrink-0">{h.streak}d 🔥</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 justify-between">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleHabitDay(h.id, idx)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all active:scale-95 ${
                        h.completedDays[idx]
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/40'
                          : 'bg-slate-900 text-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Daily Wellness Logger */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-cyan-400" />
              <span>Hydration Tracker</span>
            </span>
            <span className="text-cyan-400 font-black">{waterGlasses * 250}ml / 2500ml</span>
          </div>

          {/* Water Glasses */}
          <div className="flex items-center justify-between gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setWaterGlasses(i + 1)}
                className={`flex-1 h-8 sm:h-9 rounded-xl flex items-center justify-center text-xs transition-all active:scale-95 ${
                  i < waterGlasses
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-600 border border-slate-800'
                }`}
              >
                💧
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-yellow-400" />
              <span>Today's Mood:</span>
            </span>
            <select
              value={todayMood}
              onChange={(e) => {
                setTodayMood(e.target.value);
                showToast('Mood logged!');
              }}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
            >
              <option value="Energetic 🚀">Energetic 🚀</option>
              <option value="Focused 🎯">Focused 🎯</option>
              <option value="Calm 🌿">Calm 🌿</option>
              <option value="Grateful ✨">Grateful ✨</option>
            </select>
          </div>
        </div>

      </div>

      {/* Kanban Board (To Do, In Progress, Done) */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-xs sm:text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          <span>Task Board Kanban ({tasks.length} Total)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* 1. To Do Column */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-xs text-slate-300">TO DO ({todoTasks.length})</span>
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            </div>

            <div className="space-y-2.5">
              {todoTasks.map((t) => (
                <div key={t.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 group hover:border-slate-700 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-white truncate">{t.title}</span>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">{t.priority}</span>
                    <span>{t.dueDate}</span>
                  </div>
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-indigo-300 transition-colors active:scale-95"
                  >
                    Start Task →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. In Progress Column */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-xs text-indigo-300">IN PROGRESS ({inProgressTasks.length})</span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            </div>

            <div className="space-y-2.5">
              {inProgressTasks.map((t) => (
                <div key={t.id} className="p-3 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-2 group">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-white truncate">{t.title}</span>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase">{t.priority}</span>
                    <span>{t.dueDate}</span>
                  </div>
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    className="w-full py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-[11px] font-bold text-emerald-300 transition-colors active:scale-95"
                  >
                    Mark Done ✓
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Done Column */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-xs text-emerald-300">COMPLETED ({doneTasks.length})</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>

            <div className="space-y-2.5">
              {doneTasks.map((t) => (
                <div key={t.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/60 space-y-2 opacity-75 group">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-400 line-through truncate">{t.title}</span>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{t.category}</span>
                    <span className="text-emerald-400 font-bold">Done ✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* New Task Modal / Bottom Sheet */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 pb-safe">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white">Create New Task</h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g., Review real estate lease agreement"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Study">Study</option>
                    <option value="Health">Health</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent 🔥</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Due Date / Time</label>
                <input
                  type="text"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  placeholder="e.g., Tomorrow, 4:00 PM"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
