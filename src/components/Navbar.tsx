import React from 'react';
import { ShieldCheck, Server, AlertCircle, CheckCircle2, Settings } from 'lucide-react';
import { HealthStatus } from '../types';

interface NavbarProps {
  activeTab: 'checker' | 'results' | 'methodology';
  onSelectTab: (tab: 'checker' | 'results' | 'methodology') => void;
  healthStatus: HealthStatus;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  healthStatus,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
                SMS Spam Detector
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                Nhập môn Học máy · Phân loại tin nhắn rác
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectTab('checker')}
              className={`px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'checker'
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="sm:hidden">Kiểm tra</span>
              <span className="hidden sm:inline">Kiểm tra tin nhắn</span>
            </button>
            <button
              onClick={() => onSelectTab('results')}
              className={`px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'results'
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="sm:hidden">Kết quả</span>
              <span className="hidden sm:inline">Kết quả thực nghiệm</span>
            </button>
            <button
              onClick={() => onSelectTab('methodology')}
              className={`px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'methodology'
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="sm:hidden">Phương pháp</span>
              <span className="hidden sm:inline">Giới thiệu phương pháp</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action / Backend Connection Status */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenSettings}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
                healthStatus === 'ready'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : healthStatus === 'checking'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Nhấn để cấu hình và kiểm tra kết nối API backend"
              aria-label="Cấu hình kết nối API backend"
            >
              {healthStatus === 'ready' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden md:inline">Mô hình: Sẵn sàng</span>
                  <span className="md:hidden">Sẵn sàng</span>
                </>
              ) : healthStatus === 'checking' ? (
                <>
                  <Server className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Đang kết nối...</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="hidden md:inline">Chưa kết nối mô hình</span>
                  <span className="md:hidden">Chưa kết nối</span>
                </>
              )}
              <Settings className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
