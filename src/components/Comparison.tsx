import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Star, Map, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { Property } from '../types';

interface ComparisonProps {
  properties: Property[];
  comparedIds: string[];
  onBackToFavorites: () => void;
}

export default function Comparison({ properties, comparedIds, onBackToFavorites }: ComparisonProps) {
  // Extract compared entities
  const comparedProperties = properties.filter((p) => comparedIds.includes(p.id));

  // Safe fallback to first three items if none chose (so visual representation is pristine)
  const displayProperties = comparedProperties.length > 0 ? comparedProperties : properties.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-12"
    >
      {/* Visual top bar header with back trigger */}
      <div className="flex items-center gap-3 border-b border-purple-50 pb-3">
        <button
          onClick={onBackToFavorites}
          className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-800"
          title="返回我的收藏"
        >
          <ArrowLeft className="w-5 h-5 text-[#585595]" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-none mb-1">比較分析報告</h2>
          <p className="text-xs text-slate-500">對比分析您的精選房源</p>
        </div>
      </div>

      {/* Summary metric block */}
      <section className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-[#585595]">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 text-base">
            {displayProperties.length} 處精選物件深度分析
          </h3>
          <p className="text-xs text-slate-500">
            基於您的預算佔比額度、公共配套、通勤距離進行之全能對比。
          </p>
        </div>
      </section>

      {/* Monthly predicted budgets bars */}
      <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-slate-900 text-sm">每月預估支出對比</h4>
          <span className="bg-purple-150 text-[#585595] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            包含基本水電預估
          </span>
        </div>

        <div className="space-y-3.5">
          {displayProperties.map((prop, index) => {
            // Find max dynamically to draw percent width correctly
            const maxPrice = Math.max(...displayProperties.map((p) => p.totalEstimate));
            const barWidthPercent = Math.max(45, Math.min(100, (prop.totalEstimate / maxPrice) * 100));

            return (
              <div key={prop.id} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-800 truncate max-w-[150px]">{prop.title}</span>
                    {index === 0 && (
                      <span className="bg-amber-50 text-amber-600 border border-amber-100 px-1 rounded text-[9px] font-bold">
                        ★ CP值最高
                      </span>
                    )}
                  </div>
                  <span className="font-extrabold text-[#585595]">
                    NT$ {prop.totalEstimate.toLocaleString()}
                  </span>
                </div>
                
                {/* Visual bar tracker */}
                <div className="w-full bg-slate-100 h-5 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidthPercent}%` }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`h-full rounded-lg ${
                      index === 0
                        ? 'bg-gradient-to-r from-[#585595] to-[#7370b3]'
                        : index === 1
                        ? 'bg-[#706daf]'
                        : 'bg-[#a39fd8]'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Structured compare matrix table */}
      <section className="space-y-3">
        <h4 className="font-bold text-slate-900 text-sm">設施與地理矩陣對比</h4>
        
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full border-collapse text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3.5 font-bold text-slate-500 w-24">指標項目</th>
                {displayProperties.map((prop) => (
                  <th key={prop.id} className="p-3.5 font-extrabold text-[#585595] text-center min-w-[100px]">
                    {prop.title.substring(0, 4)}...
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3.5 font-medium text-slate-500 bg-slate-50/50">交通距離</td>
                {displayProperties.map((prop) => (
                  <td key={prop.id} className="p-3.5 text-center font-bold text-slate-700">
                    {prop.distance.replace('步行至校門 ', '')}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-medium text-slate-500 bg-slate-50/50">公共設施</td>
                {displayProperties.map((prop) => (
                  <td key={prop.id} className="p-3.5 text-center text-slate-600 leading-normal">
                    <div className="flex flex-col gap-0.5 items-center">
                      {(prop.amenities ?? ['電梯', '洗烘']).slice(0, 3).map((am, i) => (
                        <span key={i} className="bg-purple-50/50 text-[#585595] px-1.5 py-0.5 rounded text-[10px]">
                          {am}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-medium text-slate-500 bg-slate-50/50">學生評分</td>
                {displayProperties.map((prop) => (
                  <td key={prop.id} className="p-3.5 text-center">
                    <div className="inline-flex items-center gap-0.5 font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{prop.rating}</span>
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-medium text-slate-500 bg-slate-50/50">基本月租</td>
                {displayProperties.map((prop) => (
                  <td key={prop.id} className="p-3.5 text-center font-bold text-slate-800">
                    ${prop.price.toLocaleString()}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Map visual pinning area (Screen 2 Context) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80"
            alt="地理分步圖"
            className="w-full h-full object-cover brightness-95 contrast-95 saturate-75"
            referrerPolicy="no-referrer"
          />
          {/* Mock locator pins */}
          <div className="absolute top-[30%] left-[45%] text-[#585595] animate-bounce">
            📍 <span className="bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-extrabold shadow-sm">對比A</span>
          </div>
          <div className="absolute top-[60%] left-[65%] text-indigo-700 animate-bounce delay-150">
            📍 <span className="bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-extrabold shadow-sm">對比B</span>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
            <span className="text-xs font-semibold flex items-center gap-1">
              🗺️ 景美 & 文山地理區位分佈
            </span>
          </div>
        </div>

        {/* Conclusion textual review */}
        <div className="bg-[#f0ecf3] p-5 rounded-xl border border-slate-200/50 flex flex-col justify-center space-y-2">
          <div className="flex items-center gap-1.5 text-[#585595]">
            <Sparkles className="w-5 h-5" />
            <h5 className="font-bold text-sm">世新平台分析總評</h5>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            綜合對比 12 項關鍵預算及配套指標，我們強烈推薦預算充足之在校學友優先考量<strong>「文山精品獨立套房」</strong>，其步行僅需3分鐘即可進校，並附帶優質電梯等完整設備，能極大減省通勤耗能，提升考研或專題寫作的休憩品質。
          </p>
        </div>
      </section>
    </motion.div>
  );
}
