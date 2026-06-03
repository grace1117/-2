import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, MapPin, Star, Filter, ArrowUpDown, Info, Check, Sparkles } from 'lucide-react';
import { Property } from '../types';

interface SearchProps {
  properties: Property[];
  onSelectProperty: (propertyId: string) => void;
  onNavigateToTab: (tab: 'home' | 'search' | 'favorites' | 'profile' | 'details' | 'comparison' | 'notifications' | 'auth') => void;
  onToggleFavorite: (propertyId: string, event: React.MouseEvent) => void;
  favorites: string[];
}

type SortOption = 'recommended' | 'priceAsc' | 'priceDesc' | 'rating';

export default function Search({ properties, onSelectProperty, onNavigateToTab, onToggleFavorite, favorites }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  
  // Interactive filters list state
  const [showFilterDropdown, setShowFilterDropdown] = useState<string | null>(null);

  // Toggle dynamic filter dropdowns
  const handleToggleDropdown = (type: string) => {
    setShowFilterDropdown(showFilterDropdown === type ? null : type);
  };

  // Filter properties based on user selection
  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop) => {
        const matchesSearch =
          prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prop.distance.toLowerCase().includes(searchQuery.toLowerCase());
          
        const matchesRegion =
          selectedRegion === 'all' ||
          (selectedRegion === 'wenshan' && prop.location.includes('文山區')) ||
          (selectedRegion === 'jingmei' && prop.location.includes('景美'));
          
        const matchesType =
          selectedType === 'all' ||
          (selectedType === 'suite' && prop.title.includes('套房')) ||
          (selectedType === 'room' && prop.title.includes('雅房'));

        const matchesSource =
          selectedSource === 'all' || prop.source === selectedSource;

        return matchesSearch && matchesRegion && matchesType && matchesSource;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // 'recommended': default list order
      });
  }, [properties, searchQuery, selectedRegion, selectedType, selectedSource, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Persistent Sticky-Header Area for Search & Filter Tags */}
      <div className="space-y-3 pt-1 sticky top-16 bg-[#fcf8ff]/95 backdrop-blur-sm z-30 pb-3 border-b border-purple-50">
        <div className="relative">
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋 試院路、木柵路、大坪林..."
            className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#585595]/20 focus:border-[#585595] outline-none text-slate-800 placeholder-slate-400 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded"
            >
              清除
            </button>
          )}
        </div>

        {/* Filter Tag Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none relative">
          {/* Region Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleToggleDropdown('region')}
              className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedRegion !== 'all'
                  ? 'bg-[#585595] text-white border-[#585595] shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>區域: {selectedRegion === 'all' ? '全部' : selectedRegion === 'wenshan' ? '文山' : '景美'}</span>
              <span className="text-[10px]">▼</span>
            </button>
            <AnimatePresence>
              {showFilterDropdown === 'region' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-lg z-50 p-1 space-y-0.5"
                >
                  {[
                    { label: '全部區域', value: 'all' },
                    { label: '文山區', value: 'wenshan' },
                    { label: '景美捷運站周邊', value: 'jingmei' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setSelectedRegion(item.value);
                        setShowFilterDropdown(null);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-purple-50 hover:text-[#585595] flex justify-between items-center"
                    >
                      <span>{item.label}</span>
                      {selectedRegion === item.value && <Check className="w-3.5 h-3.5 text-[#585595]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Room Type Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleToggleDropdown('type')}
              className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedType !== 'all'
                  ? 'bg-[#585595] text-white border-[#585595] shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>房型: {selectedType === 'all' ? '全部' : selectedType === 'suite' ? '套房' : '雅房'}</span>
              <span className="text-[10px]">▼</span>
            </button>
            <AnimatePresence>
              {showFilterDropdown === 'type' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-lg z-50 p-1 space-y-0.5"
                >
                  {[
                    { label: '全部房型', value: 'all' },
                    { label: '獨立套房 🏢', value: 'suite' },
                    { label: '溫馨雅房 🛏️', value: 'room' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setSelectedType(item.value);
                        setShowFilterDropdown(null);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-purple-50 hover:text-[#585595] flex justify-between items-center"
                    >
                      <span>{item.label}</span>
                      {selectedType === item.value && <Check className="w-3.5 h-3.5 text-[#585595]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Source Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleToggleDropdown('source')}
              className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedSource !== 'all'
                  ? 'bg-[#585595] text-white border-[#585595] shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>來源: {selectedSource === 'all' ? '全部' : selectedSource === 'platform' ? '認證自備' : selectedSource}</span>
              <span className="text-[10px]">▼</span>
            </button>
            <AnimatePresence>
              {showFilterDropdown === 'source' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-lg z-50 p-1 space-y-0.5"
                >
                  {[
                    { label: '全部來源', value: 'all' },
                    { label: '世新租屋認證', value: 'platform' },
                    { label: '591 租屋網', value: '591' },
                    { label: 'FB 租屋社團', value: 'FB' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setSelectedSource(item.value);
                        setShowFilterDropdown(null);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-purple-50 hover:text-[#585595] flex justify-between items-center"
                    >
                      <span>{item.label}</span>
                      {selectedSource === item.value && <Check className="w-3.5 h-3.5 text-[#585595]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preset trigger tag */}
          <button
            onClick={() => {
              setSelectedRegion('all');
              setSelectedType('all');
              setSelectedSource('all');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 rounded-full text-xs font-semibold border border-purple-100 bg-purple-50/50 text-[#585595] whitespace-nowrap active:scale-95 transition-transform"
          >
            重置全部 ✖
          </button>
        </div>
      </div>

      {/* Listing Metric Counts and Sorting Dropdown */}
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-500">
          找到 <strong className="text-slate-800 text-sm font-bold">{filteredProperties.length}</strong> 個符合條件的房源
        </span>
        
        {/* Interactive Sort Options */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#585595]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer hover:text-[#585595]"
          >
            <option value="recommended">推薦排序</option>
            <option value="priceAsc">租金：由低到高</option>
            <option value="priceDesc">租金：由高到低</option>
            <option value="rating">學生評分最高</option>
          </select>
        </div>
      </div>

      {/* Property Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((prop) => {
            const isFav = favorites.includes(prop.id);
            return (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                onClick={() => onSelectProperty(prop.id)}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md cursor-pointer group flex flex-col justify-between"
              >
                {/* Visual Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Platform Branding Badge */}
                  {prop.source === 'platform' ? (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#585595] text-white text-[10px] font-bold rounded shadow-md tracking-wider">
                      平台推薦
                    </span>
                  ) : prop.source === 'FB' ? (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#1877F2] text-white text-[10px] font-bold rounded shadow-md tracking-wider">
                      來源: FB 社團
                    </span>
                  ) : (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-[10px] font-bold rounded shadow-md tracking-wider">
                      來源: 591 租屋網
                    </span>
                  )}

                  {/* Favorite Toggle button */}
                  <button
                    onClick={(e) => onToggleFavorite(prop.id, e)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-colors"
                  >
                    <span className={`text-base transition-transform active:scale-125 ${isFav ? 'text-red-500 font-bold' : 'text-slate-300'}`}>
                      ♥
                    </span>
                  </button>
                </div>

                {/* Info and features */}
                <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-slate-900 group-hover:text-[#585595] transition-colors text-base truncate">
                        {prop.title}
                      </h4>
                      <div className="text-right flex-shrink-0">
                        <span className="text-[#585595] font-extrabold text-lg">
                          NT$ {prop.price.toLocaleString()}
                        </span>
                        <p className="text-[9px] text-slate-400">/ 月(租金)</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#585595]" />
                      <span>{prop.location} · {prop.distance}</span>
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {prop.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* PRD Total Budget Estimate block in screen 5 */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-4 px-4 py-2">
                    <span className="text-xs text-slate-500 font-medium">總預算估算</span>
                    <span className="text-slate-800 font-extrabold text-sm">
                      NT$ {prop.totalEstimate.toLocaleString()}
                      <span className="text-[10px] font-normal text-slate-500 ml-1">/月</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center space-y-4">
            <div className="text-slate-350 text-5xl">🔍</div>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">
              找不到符合目前篩選條件的房源。請試著調整條件、搜尋關鍵字或點擊重置按鈕。
            </p>
          </div>
        )}
      </div>

      {/* Explanatory budget card from visual details */}
      <div className="p-5 bg-purple-50/50 rounded-xl border border-purple-100 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-[#585595] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-[#585595] text-sm">關於「總預算估算」</h5>
          <p className="text-xs text-[#585595]/80 leading-relaxed">
            此數值包含<strong>「基本月租金 + 水費(約NT$ 200) + 電費預估 + 管理費」</strong>。由系統根據校園租客實在大數據和生活條件自動計算，方便同學一次掌握完整固定支出，避免合約隱形收費爭議。
          </p>
        </div>
      </div>
    </motion.div>
  );
}
