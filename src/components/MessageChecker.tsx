import React, { useState } from 'react';
import {
  Send,
  Trash2,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  History,
  Sparkles,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { MAX_SMS_LENGTH, validateSmsInput, getLabelExplanation } from '../utils/validation';
import { predictMessage } from '../services/api';
import { PredictionResponse, PredictionHistoryItem, HealthStatus } from '../types';

interface MessageCheckerProps {
  healthStatus: HealthStatus;
  onOpenSettings: () => void;
}

export const MessageChecker: React.FC<MessageCheckerProps> = ({
  healthStatus,
  onOpenSettings,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);

  // Các ví dụ mẫu theo đúng yêu cầu đề bài
  const exampleMessages = [
    {
      title: 'Ví dụ 1 (Tin nhắn cá nhân)',
      text: 'Are we still meeting at the library this afternoon?',
    },
    {
      title: 'Ví dụ 2 (Tin nhắn quảng cáo / trúng thưởng)',
      text: 'Congratulations! You have won a cash prize. Call now to claim.',
    },
    {
      title: 'Ví dụ 3 (Cảnh báo tài khoản)',
      text: 'URGENT: Your account access has been limited. Please verify your details at http://secure-bank.example.com to restore service.',
    },
  ];

  // Khi thay đổi nội dung, xóa kết quả cũ để tránh hiểu nhầm
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setValidationError(null);
    setConnectionError(null);
    if (predictionResult !== null) {
      setPredictionResult(null);
    }
  };

  const handleClear = () => {
    setInputText('');
    setValidationError(null);
    setPredictionResult(null);
    setConnectionError(null);
  };

  const handleApplyExample = (text: string) => {
    setInputText(text);
    setValidationError(null);
    setConnectionError(null);
    setPredictionResult(null); // Chỉ điền nội dung, không gán sẵn kết quả
  };

  const handlePredict = async () => {
    setConnectionError(null);

    // 1. Kiểm tra đầu vào phía client
    const validation = validateSmsInput(inputText);
    if (!validation.isValid) {
      setValidationError(validation.errorMessage);
      return;
    }
    setValidationError(null);

    // 2. Gửi yêu cầu tới backend mô hình thật
    setLoading(true);
    const res = await predictMessage(inputText);
    setLoading(false);

    if (res.success && res.data) {
      setPredictionResult(res.data);

      // Lưu vào lịch sử phiên (tối đa 10 dự đoán thành công)
      const newItem: PredictionHistoryItem = {
        id: `${Date.now()}-${Math.random()}`,
        text: inputText,
        label: res.data.label,
        className: res.data.class_name,
        model: res.data.model,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 9)]);
    } else {
      setConnectionError(
        res.errorMessage || 'Không thể nhận kết quả từ mô hình. Vui lòng kiểm tra kết nối API backend.'
      );
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="space-y-8">
      {/* Hero Intro */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Khu vực thử nghiệm suy luận</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Kiểm tra và Phân loại Tin nhắn SMS
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Nhập nội dung tin nhắn tiếng Anh để phân loại thành <span className="font-semibold text-emerald-700">Ham (Tin thường)</span> hoặc <span className="font-semibold text-rose-700">Spam (Tin rác)</span> sử dụng pipeline <span className="font-semibold text-slate-900">BoW + MultinomialNB</span> đã huấn luyện từ bài tập lớn.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Mô hình được huấn luyện trên SMS tiếng Anh. Kết quả chỉ xuất hiện khi kết nối thành công với backend mô hình thật.</span>
          </div>
        </div>
      </div>

      {/* Main Checker Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input and Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            {/* Header & Character Counter */}
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="sms-input" className="font-semibold text-slate-700 uppercase tracking-wide">
                Nội dung tin nhắn SMS
              </label>
              <span
                className={`font-mono text-xs tabular-nums ${
                  inputText.length > MAX_SMS_LENGTH ? 'text-rose-600 font-bold' : 'text-slate-500'
                }`}
              >
                {inputText.length.toLocaleString('vi-VN')} / {MAX_SMS_LENGTH.toLocaleString('vi-VN')} ký tự
              </span>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                id="sms-input"
                rows={6}
                value={inputText}
                onChange={handleTextChange}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    handlePredict();
                  }
                }}
                placeholder="Nhập nội dung tin nhắn SMS tiếng Anh tại đây... (Ví dụ: Congratulations! You have won a cash prize. Call now to claim.)"
                className={`w-full px-4 py-3 text-sm rounded-lg border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all leading-relaxed ${
                  validationError
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500 bg-white'
                }`}
              />
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                disabled={!inputText && !predictionResult && !connectionError}
                className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa nội dung</span>
              </button>

              <button
                type="button"
                onClick={handlePredict}
                disabled={loading}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Đang phân loại...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Phân loại tin nhắn</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sample Prompts (fill content only) */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Tin nhắn mẫu thử nghiệm (chỉ điền văn bản)
            </span>
            <div className="space-y-2">
              {exampleMessages.map((ex, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleApplyExample(ex.text)}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 transition-colors text-xs group flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="font-semibold text-slate-800 block mb-0.5 group-hover:text-teal-900">
                      {ex.title}
                    </span>
                    <p className="text-slate-600 line-clamp-1 italic">
                      "{ex.text}"
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Result & Connection Status (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card Kết quả phân loại */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs min-h-[300px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Kết quả từ mô hình thật
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  selected_model.joblib
                </span>
              </div>

              {/* State 1: Đang tải */}
              {loading && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
                  <p className="text-sm font-medium text-slate-700">Đang gửi tới máy chủ suy luận...</p>
                  <p className="text-xs text-slate-400">Trích xuất đặc trưng BoW và tính toán MultinomialNB</p>
                </div>
              )}

              {/* State 2: Lỗi kết nối hoặc API chưa chạy */}
              {!loading && connectionError && (
                <div className="py-6 space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <h4 className="font-semibold text-sm">Chưa kết nối mô hình</h4>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {connectionError}
                    </p>
                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={onOpenSettings}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium transition-colors"
                      >
                        Mở cấu hình & Hướng dẫn
                      </button>
                      <span className="text-[11px] text-amber-700">
                        FastAPI: localhost:8000
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    Lưu ý: Theo nguyên tắc trung thực của bài tập lớn, ứng dụng không dùng dữ liệu giả hay tự suy đoán kết quả khi backend chưa kết nối.
                  </p>
                </div>
              )}

              {/* State 3: Thành công (Nhận kết quả từ mô hình) */}
              {!loading && !connectionError && predictionResult && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {(() => {
                    const isSpam = predictionResult.label === 1;
                    const info = getLabelExplanation(predictionResult.label);
                    return (
                      <div
                        className={`p-5 rounded-xl border ${
                          isSpam
                            ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                            : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                              isSpam
                                ? 'bg-rose-600 text-white'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {isSpam ? (
                              <AlertOctagon className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            {info.badgeText}
                          </span>
                          <span className="text-xs font-mono text-slate-500 tabular-nums">
                            Nhãn số: {predictionResult.label}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-xs text-slate-700 leading-relaxed mb-4">
                          {info.description}
                        </p>

                        <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                          <span className="font-medium">Mô hình thực thi:</span>
                          <span className="font-mono font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {predictionResult.model}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Layers className="w-3.5 h-3.5 text-teal-600" />
                      <span>Thông tin Pipeline</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Bước 1: <code className="text-slate-700">CountVectorizer(ngram_range=(1,2))</code>
                      <br />
                      Bước 2: <code className="text-slate-700">MultinomialNB(alpha=0.5)</code>
                    </p>
                  </div>
                </div>
              )}

              {/* State 4: Trạng thái ban đầu (Chưa nhập / Chưa phân loại) */}
              {!loading && !connectionError && !predictionResult && (
                <div className="py-12 text-center space-y-3 text-slate-400">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Send className="w-5 h-5 ml-0.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Chưa có kết quả phân loại</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Nhập tin nhắn và nhấn "Phân loại tin nhắn" để gửi tới pipeline mô hình thật.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Trạng thái kết nối chân thẻ */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Trạng thái backend:</span>
              <button
                type="button"
                onClick={onOpenSettings}
                className="font-medium hover:underline text-teal-700 inline-flex items-center gap-1"
              >
                {healthStatus === 'ready' ? (
                  <span className="text-emerald-700">Đã kết nối</span>
                ) : (
                  <span className="text-amber-700">Chưa kết nối</span>
                )}
                <span className="text-slate-400">· Cấu hình</span>
              </button>
            </div>
          </div>

          {/* Session Prediction History (Last 10 items) */}
          {history.length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-teal-600" />
                  Lịch sử phiên ({history.length}/10)
                </span>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-xs text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Xóa lịch sử
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setInputText(item.text);
                      setPredictionResult({
                        label: item.label,
                        class_name: item.className,
                        model: item.model,
                      });
                      setValidationError(null);
                      setConnectionError(null);
                    }}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors text-xs flex items-center justify-between gap-2"
                  >
                    <span className="text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                      {item.text}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        item.label === 1
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.className}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
