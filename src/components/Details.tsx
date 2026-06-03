import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, ShieldCheck, Mail, MapPin, Layers, Wifi, Wind, Refrigerator, Clipboard, Star, CheckCircle2, MessageSquare, Heart, RefreshCw } from 'lucide-react';
import { Property, Review, UserProfile } from '../types';

interface DetailsProps {
  property: Property;
  reviews: Review[];
  onBack: () => void;
  onNavigateToTab: (tab: 'home' | 'search' | 'favorites' | 'profile' | 'details' | 'comparison' | 'notifications' | 'auth') => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onToggleComparison: (property: Property) => void;
  isInComparison: boolean;
  user: UserProfile | null;
  onAddReview: (content: string, rating: number) => Promise<void>;
}

export default function Details({
  property,
  reviews,
  onBack,
  onNavigateToTab,
  isFavorite,
  onToggleFavorite,
  onToggleComparison,
  isInComparison,
  user,
  onAddReview,
}: DetailsProps) {
  const [copied, setCopied] = useState(false);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  const handleShare = () => {
    setCopied(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe defaults for property variables
  const rent = property.costBreakdown?.rent ?? property.price;
  const electric = property.costBreakdown?.electric ?? 800;
  const water = property.costBreakdown?.water ?? 200;
  const management = property.costBreakdown?.management ?? 300;
  const total = rent + electric + water + management;

  const rentPercent = Math.round((rent / total) * 100);
  const electricPercent = Math.round((electric / total) * 100);
  const otherPercent = 100 - rentPercent - electricPercent;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-28 pt-1"
    >
      {/* Top Gallery Layer */}
      <section className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-150">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-800 hover:bg-slate-101 shadow-sm transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          {/* Share */}
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-800 hover:bg-slate-101 shadow-sm relative"
          >
            {copied ? <span className="text-[10px] font-bold text-green-600">已剪貼</span> : <Share2 className="w-4.5 h-4.5" />}
          </button>
        </div>

        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
          1 / 5
        </div>
      </section>

      {/* Title block with tags & Trust Verification badges */}
      <section className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">
            {property.title}
          </h2>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-[#585595]" />
            <span>台北市文山區 · 鄰近世新大學校區</span>
          </p>
        </div>

        {/* Dynamic badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="px-3 py-1 bg-purple-50 text-[#585595] rounded-lg text-xs font-semibold flex items-center gap-1">
            🛏️ {property.title.includes('套房') ? '獨立套房' : '雅房'}
          </span>
          <span className="px-3 py-1 bg-purple-50 text-[#585595] rounded-lg text-xs font-semibold flex items-center gap-1">
            🏢 電梯大樓
          </span>
          <span className="px-3 py-1 bg-purple-50 text-[#585595] rounded-lg text-xs font-semibold flex items-center gap-1">
            🐾 寵物友善
          </span>
        </div>

        {/* Verification badging from specimen */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl">
          <div className="flex items-center gap-2 text-[#585595]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold tracking-wide">世新租屋平台校方認證</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
            來源來源: 591 租屋網 591_ID: 142019
          </span>
        </div>
      </section>

      {/* Pricing Analysis - Donut Chart Representation matching Screen 4 spec */}
      <section className="bg-gradient-to-br from-[#ffffff] to-[#faf9fc] p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#585595] border-b border-purple-50 pb-2">
          <span className="text-base font-bold flex items-center gap-1.5">
            📊 費用佔比分析
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Custom Conic Gradient design */}
          <div className="relative w-36 h-36 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner"
               style={{
                 background: `conic-gradient(#585595 0% ${rentPercent}%, #706daf ${rentPercent}% ${rentPercent + electricPercent}%, #e0dcfc ${rentPercent + electricPercent}% 100%)`
               }}>
            <div className="absolute w-26 h-26 bg-white rounded-full shadow-xs flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 font-medium">預計總花費</span>
              <span className="font-extrabold text-[#585595] text-lg">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Details breakdown legend */}
          <div className="flex-grow w-full space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-[#585595]" />
                <span className="font-medium text-slate-700">月租金 ({rentPercent}%)</span>
              </div>
              <span className="font-bold text-slate-900">NT$ {rent.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-[#706daf]" />
                <span className="font-medium text-slate-500">預估水電費 ({electricPercent}%)</span>
              </div>
              <span className="font-bold text-slate-900">NT$ {(electric + water).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-[#e0dcfc]" />
                <span className="font-medium text-slate-500">管理費 ({otherPercent}%)</span>
              </div>
              <span className="font-bold text-slate-900">NT$ {management.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
          <span className="italic">包含所有已知固定支出</span>
          <span>總計: NT$ {total.toLocaleString()} / 月</span>
        </div>
      </section>

      {/* Property Details Grid & Amenities */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">房源基礎資訊</h3>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <MapPin className="w-5 h-5 text-[#585595]" />
              <div>
                <p className="text-[10px] text-slate-400">位置與距離</p>
                <p className="text-xs font-bold text-slate-800">{property.distance}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <Layers className="w-5 h-5 text-[#585595]" />
              <div>
                <p className="text-[10px] text-slate-400">房源樓層</p>
                <p className="text-xs font-bold text-slate-800">{property.floor ?? '中樓層'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities List */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">提供設備與服務</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2.5">
            {(property.amenities ?? ['無綫網路', '冷氣', '冰箱', '書桌']).map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-purple-50/20 hover:border-purple-200/50 transition-all text-xs font-medium text-slate-700"
              >
                {item.includes('網路') && <Wifi className="w-4 h-4 text-[#585595]" />}
                {item.includes('冷氣') && <Wind className="w-4 h-4 text-[#585595]" />}
                {item.includes('冰箱') && <Refrigerator className="w-4 h-4 text-[#585595]" />}
                {item.includes('書桌') && <Clipboard className="w-4 h-4 text-[#585595]" />}
                {!item.includes('網路') && !item.includes('冷氣') && !item.includes('冰箱') && !item.includes('書桌') && (
                  <CheckCircle2 className="w-4 h-4 text-[#585595]" />
                )}
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Platform Comparison State */}
      <section className="bg-purple-50/25 p-5 rounded-xl border border-purple-100">
        <h3 className="font-bold text-[#585595] text-sm flex items-center gap-1.5 mb-3">
          <RefreshCw className="w-4 h-4" /> 價格透明度
        </h3>
        
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center p-3 rounded-lg bg-white border border-slate-200/60 shadow-xs">
            <span className="font-medium text-slate-600">591 來源報價</span>
            <span className="font-extrabold text-slate-800">NT$ {property.price.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 rounded-lg bg-white border border-slate-200/60 shadow-xs">
            <span className="font-medium text-slate-600">Facebook 學生租屋社團</span>
            <span className="text-slate-400 italic">無提供此物件報價</span>
          </div>
          
          <p className="text-[10px] text-slate-400 leading-normal">
            價格每 24 小時與外部 API 及各大社群爬蟲進行一次同步，確保資訊透明不對稱。
          </p>
        </div>
      </section>

      {/* Reviews block */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">學生真實評價</h3>
          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 text-[#585595]">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold">{(reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : property.rating)} / 5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-white border border-slate-150 rounded-xl space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#585595] flex items-center justify-center font-bold text-xs uppercase border border-indigo-100">
                    {rev.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{rev.author}</h4>
                    <p className="text-[10px] text-slate-400">{rev.dept} 在校同學</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="text-xs font-bold font-mono">{rev.rating}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "{rev.content}"
              </p>
            </div>
          ))}
        </div>

        {/* Dynamic add review form */}
        <div className="bg-[#faf9fc] p-5 rounded-2xl border border-purple-100 shadow-sm space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 border-b border-purple-50 pb-2">
            ✍️ 新增學生真實評價（加強資訊對稱）
          </h4>
          {user ? (
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newReviewContent.trim()) return;
              setIsSubmittingReview(true);
              try {
                await onAddReview(newReviewContent, newReviewRating);
                setNewReviewContent('');
                setNewReviewRating(5);
              } finally {
                setIsSubmittingReview(false);
              }
            }} className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-500 font-bold">我的評分：</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setNewReviewRating(stars)}
                      className="p-0.5 transition-transform active:scale-110"
                    >
                      <Star className={`w-5 h-5 ${stars <= newReviewRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">居住體驗評論（回饋學弟妹）</label>
                <textarea
                  required
                  rows={3}
                  value={newReviewContent}
                  onChange={(e) => setNewReviewContent(e.target.value)}
                  placeholder="輸入您的居住心得，這能極大幫助在捷運景美、木柵、試院路一帶尋找理想校外住處的世新同學..."
                  className="w-full text-xs font-medium p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#585595]/20 focus:border-[#585595] bg-white outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingReview || !newReviewContent.trim()}
                className="bg-[#585595] text-white py-2 px-5 rounded-lg text-xs font-extrabold shadow-sm hover:bg-[#4b4880] transition-colors disabled:opacity-50"
              >
                {isSubmittingReview ? '正在安全上載中...' : '送出真心評價'}
              </button>
            </form>
          ) : (
            <div className="text-center p-5 bg-white border border-slate-150 rounded-xl space-y-3">
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                🔒 登入以留學長姐真實租賃經驗與評價。幫助更多同學尋找優質好房！
              </p>
              <button
                type="button"
                onClick={() => onNavigateToTab('auth')}
                className="bg-purple-50 hover:bg-purple-100 text-[#585595] font-extrabold text-xs py-2 px-4 rounded-lg transition-colors border border-purple-150 inline-block shadow-xs"
              >
                立即學生信箱認證 / Google 快速登入
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sticky Bottom contextual Action control */}
      <div className="fixed bottom-16 md:bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 shadow-lg z-40">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button className="flex-grow bg-[#585595] text-white py-3 px-6 rounded-xl text-sm font-bold shadow-sm hover:bg-[#4b4880] transition-colors flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" /> 聯絡房東預約
          </button>
          
          <button 
            type="button"
            onClick={() => onToggleComparison(property)}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
              isInComparison 
                ? 'bg-purple-100 border-[#585595] text-[#585595]' 
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title="加入比較分析"
          >
            <span className="text-sm font-bold">🆚</span>
          </button>

          <button 
            type="button"
            onClick={onToggleFavorite}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
              isFavorite 
                ? 'bg-red-50 border-red-200 text-red-500 shadow-xs' 
                : 'border-slate-200 text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
