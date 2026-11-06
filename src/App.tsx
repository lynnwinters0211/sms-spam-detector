import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MessageChecker } from './components/MessageChecker';
import { ExperimentResults } from './components/ExperimentResults';
import { Methodology } from './components/Methodology';
import { BackendGuideModal } from './components/BackendGuideModal';
import { checkBackendHealth } from './services/api';
import { HealthStatus } from './types';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { DATASET_STATS } from './utils/mlData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'checker' | 'results' | 'methodology'>('checker');
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('checking');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Kiểm tra sức khỏe của backend mô hình khi ứng dụng khởi động
  useEffect(() => {
    let isMounted = true;
    const verifyHealth = async () => {
      setHealthStatus('checking');
      const res = await checkBackendHealth();
      if (isMounted) {
        if (res.ready) {
          setHealthStatus('ready');
        } else if (res.isHealthy) {
          setHealthStatus('not_ready');
        } else {
          setHealthStatus('error');
        }
      }
    };
    verifyHealth();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        healthStatus={healthStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'checker' && (
          <MessageChecker
            healthStatus={healthStatus}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}
        {activeTab === 'results' && <ExperimentResults />}
        {activeTab === 'methodology' && <Methodology />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-800">SMS Spam Detector</span>
            <span className="text-slate-400">·</span>
            <span>Bài tập lớn Nhập môn Học máy</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>BoW + MultinomialNB (F1 Test: 93,93%)</span>
            <span className="text-slate-400">·</span>
            <a
              href={DATASET_STATS.colabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-700 transition-colors inline-flex items-center gap-1"
            >
              Google Colab <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-400">·</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-teal-700 transition-colors"
            >
              Cấu hình Backend
            </button>
          </div>
        </div>
      </footer>

      {/* Backend Configuration & Setup Guide Modal */}
      <BackendGuideModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onHealthUpdated={setHealthStatus}
      />
    </div>
  );
}
