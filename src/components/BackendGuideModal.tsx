import React, { useState } from 'react';
import { X, Server, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink, HardDrive } from 'lucide-react';
import { getStoredApiUrl, setStoredApiUrl, checkBackendHealth, HealthCheckResult } from '../services/api';
import { HealthStatus } from '../types';

interface BackendGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHealthUpdated: (status: HealthStatus) => void;
}

export const BackendGuideModal: React.FC<BackendGuideModalProps> = ({
  isOpen,
  onClose,
  onHealthUpdated,
}) => {
  const [apiUrl, setApiUrl] = useState<string>(getStoredApiUrl());
  const [checking, setChecking] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<HealthCheckResult | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setChecking(true);
    setTestResult(null);
    setStoredApiUrl(apiUrl);
    const result = await checkBackendHealth(apiUrl);
    setTestResult(result);
    setChecking(false);
    onHealthUpdated(result.ready ? 'ready' : result.isHealthy ? 'not_ready' : 'error');
  };

  const handleResetDefault = () => {
    const defaultUrl = 'http://localhost:8000';
    setApiUrl(defaultUrl);
    setStoredApiUrl(defaultUrl);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-semibold text-slate-900">
              Cấu hình & Kết nối Backend Mô hình
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors"
            aria-label="Đóng hộp thoại"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-sm text-slate-600">
          {/* Section 1: Endpoint Input */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              ĐỊA CHỈ API BACKEND (FASTAPI)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={checking}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                  {checking ? 'Đang thử...' : 'Kiểm tra kết nối'}
                </button>
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg text-xs transition-colors"
                  title="Đặt lại http://localhost:8000"
                >
                  Mặc định
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Endpoint kiểm tra sức khỏe: <code className="text-slate-700 font-mono">GET {apiUrl.replace(/\/+$/, '')}/health</code>
            </p>

            {/* Test Connection Feedback */}
            {testResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                  testResult.ready
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                {testResult.ready ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">
                    {testResult.ready
                      ? 'Kết nối thành công!'
                      : testResult.isHealthy
                      ? 'Máy chủ phản hồi nhưng mô hình chưa sẵn sàng'
                      : 'Không thể kết nối đến máy chủ'}
                  </p>
                  <p className="mt-1">
                    {testResult.ready
                      ? `Mô hình: ${testResult.modelName}. Backend đã sẵn sàng nhận yêu cầu phân loại.`
                      : testResult.errorMessage}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: How to obtain model & run backend */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <h3 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-teal-600" />
              HƯỚNG DẪN LẤY FILE MÔ HÌNH VÀ CHẠY BACKEND
            </h3>

            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700">
              <p className="font-medium text-slate-900">
                1. Lấy file mô hình từ Google Drive đã lưu trong Colab:
              </p>
              <p className="text-slate-600">
                Trong Google Colab notebook, mô hình tốt nhất (<span className="font-semibold text-slate-900">BoW + MultinomialNB</span>) đã được xuất lưu tại đường dẫn:
              </p>
              <div className="p-2 bg-white rounded border border-slate-300 font-mono text-[11px] text-slate-800 break-all select-all">
                /content/drive/MyDrive/SMS_SPAM_PROJECT/artifacts/selected_model.joblib
              </div>
              <p className="text-slate-600">
                Hãy mở Google Drive của tài khoản Colab, tải file <code className="font-semibold text-slate-800">selected_model.joblib</code> về và sao chép vào thư mục:
              </p>
              <div className="p-2 bg-white rounded border border-slate-300 font-mono text-[11px] text-slate-800">
                backend/artifacts/selected_model.joblib
              </div>

              <p className="font-medium text-slate-900 pt-2">
                2. Khởi chạy máy chủ FastAPI trên máy tính:
              </p>
              <div className="p-2.5 bg-slate-900 text-slate-100 rounded font-mono text-[11px] space-y-1">
                <div>cd backend</div>
                <div>python3 -m venv venv</div>
                <div>source venv/bin/activate  # Hoặc venv\Scripts\activate trên Windows</div>
                <div>pip install -r requirements.txt</div>
                <div className="text-emerald-400">uvicorn main:app --reload --port 8000</div>
              </div>

              <p className="text-slate-500 pt-1">
                * Mã nguồn FastAPI đầy đủ đã được chuẩn bị sẵn trong thư mục <code className="font-mono text-slate-700">/backend</code> của dự án này kèm theo file <code className="font-mono text-slate-700">README.md</code> chi tiết.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <a
            href="https://colab.research.google.com/drive/1EQdq1fgRhMKUJNMVJheyB3Yv_ZJaQvmq?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-1"
          >
            Mở Colab nguồn <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
