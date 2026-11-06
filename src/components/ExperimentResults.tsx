import React, { useState } from 'react';
import {
  Award,
  Target,
  Sparkles,
  BarChart3,
  Grid,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  EXPERIMENT_RESULTS,
  MAIN_MODEL_SPECS,
  MAIN_MODEL_CONFUSION_MATRIX,
  filterExperimentResults,
  formatPercent,
} from '../utils/mlData';
import { AlgorithmType, RepresentationType } from '../types';

export const ExperimentResults: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType | 'ALL'>('ALL');
  const [selectedRep, setSelectedRep] = useState<RepresentationType | 'ALL'>('ALL');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const filteredResults = filterExperimentResults(EXPERIMENT_RESULTS, selectedAlgo, selectedRep);

  // Danh sách các tùy chọn lọc
  const algorithms: (AlgorithmType | 'ALL')[] = ['ALL', 'Naive Bayes', 'KNN', 'Decision Tree'];
  const representations: (RepresentationType | 'ALL')[] = ['ALL', 'BoW', 'TF-IDF', 'Embeddings'];

  return (
    <div className="space-y-8">
      {/* Header Intro */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Đánh giá thực nghiệm cố định</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Kết quả Đánh giá Mô hình & So sánh Cấu hình
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Số liệu đánh giá khách quan trên tập kiểm thử độc lập (Test Set gồm 1.032 mẫu: 904 Ham và 128 Spam) từ 9 cấu hình kết hợp giữa 3 biểu diễn văn bản và 3 thuật toán học máy.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Mô hình chính được chọn bằng tiêu chí F1 Spam cao nhất qua 5-Fold Cross-Validation trước khi đánh giá trên tập Test.</span>
          </div>
        </div>
      </div>

      {/* 4 Top Metric Cards (Mô hình chính) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Accuracy */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wide">Test Accuracy</span>
            <Target className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {formatPercent(MAIN_MODEL_SPECS.testAccuracy)}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Tỷ lệ dự đoán đúng toàn thể (1.017 / 1.032 mẫu test)
          </p>
        </div>

        {/* Card 2: Precision Spam */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wide">Test Precision (Spam)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {formatPercent(MAIN_MODEL_SPECS.testPrecisionSpam)}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Độ chuẩn xác khi dự đoán Spam (chỉ 3 tin Ham bị đánh nhầm)
          </p>
        </div>

        {/* Card 3: Recall Spam */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wide">Test Recall (Spam)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {formatPercent(MAIN_MODEL_SPECS.testRecallSpam)}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Tỷ lệ bắt trúng tin nhắn rác (116 / 128 tin Spam thực tế)
          </p>
        </div>

        {/* Card 4: F1 Spam (Main selection metric) */}
        <div className="bg-white rounded-xl p-5 border-2 border-teal-500/50 shadow-xs relative overflow-hidden bg-gradient-to-br from-white to-teal-50/20">
          <div className="flex items-center justify-between text-xs text-teal-800 mb-2">
            <span className="font-semibold uppercase tracking-wide">Test F1-Score (Spam)</span>
            <Award className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-3xl font-bold text-teal-900 font-mono tabular-nums">
            {formatPercent(MAIN_MODEL_SPECS.testF1Spam)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>CV 5-Fold F1: <strong className="text-slate-800 font-mono">{formatPercent(MAIN_MODEL_SPECS.cvF1Spam)}</strong></span>
            <span>Macro-F1: <strong className="text-slate-800 font-mono">{formatPercent(MAIN_MODEL_SPECS.testMacroF1)}</strong></span>
          </div>
        </div>
      </div>

      {/* Confusion Matrix Section */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
              <Grid className="w-4 h-4" />
              <span>Ma trận nhầm lẫn (Confusion Matrix)</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Chi tiết Dự đoán Mô hình chính: BoW + MultinomialNB
            </h2>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Tập Test: 1.032 mẫu (904 Ham · 128 Spam)
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual Confusion Matrix Grid (7 cols) */}
          <div className="lg:col-span-7">
            <div className="max-w-lg mx-auto">
              {/* Header column labels */}
              <div className="flex items-center mb-2.5">
                <div className="w-28 sm:w-32 shrink-0"></div>
                <div className="grid grid-cols-2 gap-3 flex-1 text-center text-xs font-semibold">
                  <span className="text-emerald-700 bg-emerald-50 py-1.5 px-2 rounded-lg border border-emerald-200">
                    Dự đoán HAM (913)
                  </span>
                  <span className="text-rose-700 bg-rose-50 py-1.5 px-2 rounded-lg border border-rose-200">
                    Dự đoán SPAM (119)
                  </span>
                </div>
              </div>

              {/* Row 1: Thực tế HAM */}
              <div className="flex items-center mb-3">
                <div className="w-28 sm:w-32 shrink-0 pr-3 text-right text-xs font-semibold text-emerald-800 leading-tight">
                  Thực tế HAM
                  <span className="block text-[11px] font-normal text-slate-500 mt-0.5">(904 mẫu)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {/* TN (901) */}
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 text-center transition-transform hover:scale-[1.01] shadow-2xs">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      True Negative (TN)
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-emerald-900 font-mono tabular-nums my-1">
                      {MAIN_MODEL_CONFUSION_MATRIX.tn}
                    </div>
                    <span className="text-xs text-emerald-700 font-semibold block">
                      Ham đúng (99,67%)
                    </span>
                  </div>
                  {/* FP (3) */}
                  <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-4 text-center transition-transform hover:scale-[1.01] shadow-2xs">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                      False Positive (FP)
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-amber-900 font-mono tabular-nums my-1">
                      {MAIN_MODEL_CONFUSION_MATRIX.fp}
                    </div>
                    <span className="text-xs text-amber-700 font-semibold block">
                      Ham bị đánh nhầm
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Thực tế SPAM */}
              <div className="flex items-center">
                <div className="w-28 sm:w-32 shrink-0 pr-3 text-right text-xs font-semibold text-rose-800 leading-tight">
                  Thực tế SPAM
                  <span className="block text-[11px] font-normal text-slate-500 mt-0.5">(128 mẫu)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {/* FN (12) */}
                  <div className="bg-rose-50/70 border border-rose-300 rounded-xl p-4 text-center transition-transform hover:scale-[1.01] shadow-2xs">
                    <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                      False Negative (FN)
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-rose-900 font-mono tabular-nums my-1">
                      {MAIN_MODEL_CONFUSION_MATRIX.fn}
                    </div>
                    <span className="text-xs text-rose-700 font-semibold block">
                      Spam bị bỏ sót
                    </span>
                  </div>
                  {/* TP (116) */}
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 text-center transition-transform hover:scale-[1.01] shadow-2xs">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      True Positive (TP)
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-emerald-900 font-mono tabular-nums my-1">
                      {MAIN_MODEL_CONFUSION_MATRIX.tp}
                    </div>
                    <span className="text-xs text-emerald-700 font-semibold block">
                      Spam đúng (90,62%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Explanatory Notes (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-3">
            <h3 className="font-semibold text-slate-900 text-sm">
              Diễn giải kết quả ma trận nhầm lẫn
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900">901 Ham đúng:</strong> Tin nhắn thông thường được nhận diện chính xác là tin thường, không làm phiền người dùng.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900">3 Ham bị đánh dấu nhầm:</strong> Rất thấp (chỉ 0,33%), giúp hạn chế tối đa nguy cơ bỏ lỡ tin nhắn quan trọng của người dùng.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900">12 Spam bị bỏ sót:</strong> Tin nhắn rác lọt vào hộp thư đến (chiếm 9,38% số tin rác), là đánh đổi để đạt độ chính xác cao cho tin thường.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900">116 Spam đúng:</strong> Chặn thành công 116 tin rác nguy hại, lừa đảo hoặc quảng cáo.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison Bar Chart (F1 Spam across configurations) */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
              <BarChart3 className="w-4 h-4" />
              <span>Biểu đồ so sánh trực quan</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              So sánh F1-Score Spam giữa các Cấu hình (Thang 0 – 100%)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Trục tung: 0% – 100% · Di chuột để xem chi tiết
          </span>
        </div>

        {/* Bar Chart Container */}
        <div className="pt-4 pb-2">
          <div className="space-y-3.5">
            {EXPERIMENT_RESULTS.map((item, index) => {
              const isSelected = item.isMainModel;
              const isHovered = hoveredBarIndex === index;
              return (
                <div
                  key={`${item.representation}-${item.algorithm}`}
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className={`p-2.5 rounded-lg transition-colors ${
                    isHovered ? 'bg-slate-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {item.representation} + {item.algorithm}
                      </span>
                      {isSelected && (
                        <span className="text-[11px] font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          Mô hình chính — chọn bằng CV
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      F1: {item.f1Spam.toLocaleString('vi-VN', { minimumFractionDigits: 2 })}%
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected
                          ? 'bg-teal-600'
                          : item.algorithm === 'Naive Bayes'
                          ? 'bg-teal-400'
                          : item.algorithm === 'KNN'
                          ? 'bg-blue-500'
                          : 'bg-indigo-400'
                      }`}
                      style={{ width: `${item.f1Spam}%` }}
                    />
                  </div>

                  {/* Tooltip / detail row when hovered */}
                  {isHovered && (
                    <div className="mt-2 text-[11px] text-slate-600 flex flex-wrap gap-4 font-mono bg-white p-2 rounded border border-slate-200 animate-in fade-in duration-100">
                      <span>Accuracy: <strong className="text-slate-900">{item.accuracy}%</strong></span>
                      <span>Precision Spam: <strong className="text-slate-900">{item.precisionSpam}%</strong></span>
                      <span>Recall Spam: <strong className="text-slate-900">{item.recallSpam}%</strong></span>
                      <span>F1 Spam: <strong className="text-slate-900">{item.f1Spam}%</strong></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chart Axis reference line */}
          <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-400 font-mono tabular-nums">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Full 9 Configurations Table with Filters */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
              <Filter className="w-4 h-4" />
              <span>Bảng dữ liệu đối chiếu 9 cấu hình</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Bảng Tổng hợp Kết quả Thực nghiệm Chi tiết
            </h2>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Thuật toán Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <span className="text-slate-500 px-2 font-medium">Thuật toán:</span>
              {algorithms.map((algo) => (
                <button
                  key={algo}
                  type="button"
                  onClick={() => setSelectedAlgo(algo)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    selectedAlgo === algo
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {algo === 'ALL' ? 'Tất cả' : algo}
                </button>
              ))}
            </div>

            {/* Biểu diễn Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <span className="text-slate-500 px-2 font-medium">Biểu diễn:</span>
              {representations.map((rep) => (
                <button
                  key={rep}
                  type="button"
                  onClick={() => setSelectedRep(rep)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    selectedRep === rep
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {rep === 'ALL' ? 'Tất cả' : rep}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Biểu diễn</th>
                <th className="py-3 px-4">Thuật toán</th>
                <th className="py-3 px-4 text-right">Accuracy (%)</th>
                <th className="py-3 px-4 text-right">Precision Spam (%)</th>
                <th className="py-3 px-4 text-right">Recall Spam (%)</th>
                <th className="py-3 px-4 text-right">F1 Spam (%)</th>
                <th className="py-3 px-4">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.map((row) => (
                <tr
                  key={`${row.representation}-${row.algorithm}`}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    row.isMainModel ? 'bg-teal-50/40 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                    {row.representation}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 whitespace-nowrap">
                    {row.algorithm}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-900">
                    {formatPercent(row.accuracy)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-900">
                    {formatPercent(row.precisionSpam)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-900">
                    {formatPercent(row.recallSpam)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-teal-800">
                    {formatPercent(row.f1Spam)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {row.isMainModel ? (
                      <span className="text-teal-800 font-semibold inline-flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        Mô hình chính — chọn bằng CV
                      </span>
                    ) : (
                      row.notes || '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredResults.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-500">
            Không tìm thấy cấu hình phù hợp với bộ lọc hiện tại.
          </div>
        )}
      </div>
    </div>
  );
};
