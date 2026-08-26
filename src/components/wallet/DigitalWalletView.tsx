import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  QrCode, 
  Zap, 
  Plus, 
  TrendingUp, 
  ShieldCheck, 
  X,
  PieChart as PieIcon,
  Receipt
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useSuperApp } from '../../context/SuperAppContext';
import { WalletTransaction } from '../../types/superApp';
import confetti from 'canvas-confetti';

export const DigitalWalletView: React.FC = () => {
  const { walletBalance, transactions, sendMoney, addMoneyToWallet, showToast, user } = useSuperApp();
  
  const [showSendModal, setShowSendModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendCategory, setSendCategory] = useState<WalletTransaction['category']>('Transfer');
  const [addAmount, setAddAmount] = useState('250');

  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(sendAmount);
    if (!amountNum || amountNum <= 0) return;
    const success = await sendMoney(recipient, amountNum, sendCategory);
    if (success) {
      setShowSendModal(false);
      setRecipient('');
      setSendAmount('');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(addAmount);
    if (!amountNum || amountNum <= 0) return;
    addMoneyToWallet(amountNum);
    setShowAddFundsModal(false);
  };

  // Spending breakdown for chart
  const categoryData = [
    { name: 'Tutor & Edu', value: 240, color: '#10b981' },
    { name: 'Services', value: 180, color: '#6366f1' },
    { name: 'Food & Dining', value: 130, color: '#f59e0b' },
    { name: 'Utilities', value: 90, color: '#ec4899' },
    { name: 'Transfers', value: 120, color: '#06b6d4' }
  ];

  return (
    <div className="space-y-6 pb-20">
      
      {/* Wallet Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Digital Wallet & Finance</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                P2P & Instant Pay
              </span>
            </div>
            <p className="text-xs text-slate-400">Zero-fee instant peer-to-peer transfers, service checkouts & spend analytics.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddFundsModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Top-Up</span>
          </button>
          <button
            onClick={() => setShowSendModal(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/25 flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Send Money</span>
          </button>
        </div>
      </div>

      {/* Virtual Debit Card & Quick Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Virtual Cyber Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-950 p-6 border border-indigo-500/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-indigo-300 tracking-wider">ADITI BLACK</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <CreditCard className="w-6 h-6 text-white/60" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Available Balance</span>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ${walletBalance.toFixed(2)}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-300 font-mono">
            <span>•••• •••• •••• 8842</span>
            <span>08/29</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-200 font-bold">
            <span className="tracking-wide">{user.name.toUpperCase()}</span>
            <span className="text-indigo-400 font-black">VISA PLATINUM</span>
          </div>

          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>
        </div>

        {/* Quick Payment Hub & Bill Payment */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Instant Services & Recharge Utilities</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { title: 'Electricity Bill', desc: 'Auto-Pay', icon: '⚡', action: () => showToast('Simulated Electricity Bill ($45.00) paid!') },
              { title: 'Mobile Recharge', desc: 'Instant 5G', icon: '📱', action: () => showToast('Simulated Mobile 5G Plan renewed!') },
              { title: 'Scan & Pay QR', desc: 'POS Payment', icon: '📷', action: () => showToast('QR Camera simulator ready!') },
              { title: 'Fiber Internet', desc: 'Monthly Bill', icon: '🌐', action: () => showToast('Gigabit Internet ($70.00) paid!') },
            ].map((bill, i) => (
              <button
                key={i}
                onClick={bill.action}
                className="p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
              >
                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">{bill.icon}</span>
                <h4 className="font-bold text-xs text-white group-hover:text-emerald-300">{bill.title}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{bill.desc}</p>
              </button>
            ))}
          </div>

          {/* Spend Analytics Visual Graph */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                <span>Monthly Category Spend Distribution</span>
              </span>
              <span className="text-emerald-400">$760 Total Spent This Month</span>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={90} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(val) => [`$${val}`, 'Spent']}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Transaction History Log */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <h3 className="font-extrabold text-sm text-white">Recent Transactions</h3>
          </div>
          <span className="text-xs text-slate-400">{transactions.length} Total Records</span>
        </div>

        <div className="space-y-2">
          {transactions.map((tx) => {
            const isDebit = tx.type === 'debit';
            return (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isDebit
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {isDebit ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white">{tx.title}</h4>
                    <p className="text-[11px] text-slate-400">{tx.recipientOrSender} • {tx.timestamp}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs sm:text-sm font-black ${isDebit ? 'text-slate-200' : 'text-emerald-400'}`}>
                    {isDebit ? '-' : '+'}${tx.amount.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 block mt-0.5">
                    {tx.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Send Money Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span>Send Money (Instant Transfer)</span>
              </h3>
              <button onClick={() => setShowSendModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Recipient Name / Handle / Phone</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Sarah Chen, @alex, +14155551234"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  max={walletBalance}
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder={`Max $${walletBalance.toFixed(2)}`}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Category Tag</label>
                <select
                  value={sendCategory}
                  onChange={(e) => setSendCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="Transfer">P2P Transfer</option>
                  <option value="Food">Food & Dining</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Services">Services</option>
                  <option value="Rent">Rent Payment</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Top-Up Digital Wallet</span>
              </h3>
              <button onClick={() => setShowAddFundsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Amount to Top-Up ($)</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['50', '100', '250', '500'].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setAddAmount(amt)}
                      className={`p-2 rounded-xl font-bold border transition-colors ${
                        addAmount === amt
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="font-bold text-slate-200">Linked Payment Method</p>
                <p>Chase Bank Checking (•••• 9012) • 0% Transaction Fee</p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFundsModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Add Funds Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
