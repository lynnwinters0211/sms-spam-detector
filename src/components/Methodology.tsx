import React from 'react';
import {
  BookOpen,
  ArrowRight,
  Database,
  Cpu,
  GitBranch,
  AlertTriangle,
  ExternalLink,
  Code2,
  CheckCircle,
} from 'lucide-react';
import { DATASET_STATS, MAIN_MODEL_SPECS } from '../utils/mlData';

export const Methodology: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Intro */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Phương pháp nghiên cứu & Thực nghiệm</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Giới thiệu Bài toán, Quy trình & Thuật toán
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Tổng quan kiến trúc phân loại tin nhắn rác (SMS Spam Classification) trong khuôn khổ bài tập lớn môn Nhập môn Học máy. Báo cáo đối chiếu 3 kỹ thuật trích xuất đặc trưng và 3 thuật toán học máy giám sát.
          </p>
        </div>
      </div>

      {/* 1. Luồng xử lý Pipeline Mô hình chính (Visual Pipeline Flow) */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
            <GitBranch className="w-4 h-4" />
            <span>Kiến trúc Pipeline thực thi</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Luồng xử lý từ Tin nhắn thô đến Nhãn dự đoán
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
          {/* Step 1 */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 relative flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block mb-1">
                Bước 1 · Đầu vào
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-2">
                Tin nhắn SMS thô
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chuỗi văn bản tiếng Anh người dùng gửi đến cần xác thực nhãn.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-mono text-slate-500">
              Kiểu dữ liệu: String
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 relative flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block mb-1">
                Bước 2 · Biểu diễn
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-2">
                Bag of Words (BoW)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trích xuất n-gram tần số từ vựng:
                <br />
                <code className="text-slate-800 text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                  ngram_range=(1,2)
                </code>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-mono text-slate-500">
              CountVectorizer
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 relative flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block mb-1">
                Bước 3 · Phân loại
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-2">
                Multinomial Naive Bayes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Định lý xác suất Bayes với hệ số làm mịn Laplace / Lidstone:
                <br />
                <code className="text-slate-800 text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                  alpha = 0.5
                </code>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-mono text-slate-500">
              MultinomialNB
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-teal-50/60 p-5 rounded-xl border-2 border-teal-500/50 relative flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
                Bước 4 · Đầu ra
              </span>
              <h3 className="font-bold text-teal-950 text-sm mb-2">
                Dự đoán Nhãn nhị phân
              </h3>
              <p className="text-xs text-teal-900 leading-relaxed">
                Phân lớp rõ ràng:
                <br />
                <span className="font-semibold text-emerald-800">0: Ham</span> (Tin nhắn thường)
                <br />
                <span className="font-semibold text-rose-800">1: Spam</span> (Tin nhắn rác)
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-teal-200/60 text-[11px] font-mono text-teal-800">
              {MAIN_MODEL_SPECS.name}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dữ liệu và Tiền xử lý */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
            <Database className="w-4 h-4" />
            <span>Bộ dữ liệu thực nghiệm</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Quy trình Làm sạch & Phân chia Dữ liệu Huấn luyện / Kiểm thử
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Dữ liệu gốc ban đầu</span>
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums block mt-1">
              {DATASET_STATS.rawCount.toLocaleString('vi-VN')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">SMS Spam Collection dataset</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Loại bỏ dòng trùng nội dung</span>
            <span className="text-2xl font-bold text-amber-700 font-mono tabular-nums block mt-1">
              - {DATASET_STATS.duplicateCount.toLocaleString('vi-VN')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">Sau khi chuẩn hóa chuỗi</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Tập huấn luyện (Train)</span>
            <span className="text-2xl font-bold text-teal-800 font-mono tabular-nums block mt-1">
              {DATASET_STATS.trainCount.toLocaleString('vi-VN')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">80% tổng mẫu độc nhất</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Tập kiểm thử (Test)</span>
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums block mt-1">
              {DATASET_STATS.testCount.toLocaleString('vi-VN')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Gồm 904 Ham và 128 Spam
            </span>
          </div>
        </div>
      </div>

      {/* 3. So sánh 3 Biểu diễn & 3 Thuật toán */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3 Kỹ thuật Biểu diễn */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block mb-0.5">
              Kỹ thuật trích xuất đặc trưng
            </span>
            <h3 className="text-base font-bold text-slate-900">
              3 Kỹ thuật Biểu diễn Văn bản
            </h3>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <strong className="text-slate-900 text-sm block">1. Bag-of-Words (BoW)</strong>
              <p className="text-slate-600">
                Đếm số lần xuất hiện của các từ đơn và cụm 2 từ (unigram + bigram) thông qua <code className="text-slate-800">CountVectorizer(ngram_range=(1,2))</code>. Giữ được các cụm từ đặc trưng như "cash prize", "call now".
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <strong className="text-slate-900 text-sm block">2. TF-IDF</strong>
              <p className="text-slate-600">
                Đánh trọng số dựa trên tần số từ trong tin nhắn và nghịch đảo tần số xuất hiện trong toàn bộ tài liệu (Term Frequency - Inverse Document Frequency), giảm tầm ảnh hưởng của các từ ngữ xuất hiện quá phổ biến.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <strong className="text-slate-900 text-sm block">3. Sentence Embeddings</strong>
              <p className="text-slate-600">
                Sử dụng mô hình tiền huấn luyện <code className="text-slate-800 font-mono">sentence-transformers/all-MiniLM-L6-v2</code> để ánh xạ tin nhắn thành vector ngữ nghĩa dày đặc 384 chiều, giữ nguyên trọng số gốc không fine-tune.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Thuật toán Học máy */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block mb-0.5">
              Mô hình học máy giám sát
            </span>
            <h3 className="text-base font-bold text-slate-900">
              3 Thuật toán Phân loại
            </h3>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3.5 bg-teal-50/50 rounded-lg border border-teal-200 space-y-1">
              <strong className="text-slate-900 text-sm block flex items-center justify-between">
                <span>1. Naive Bayes (Thuật toán chính)</span>
                <span className="text-[11px] text-teal-800 font-medium">Hiệu năng tốt nhất</span>
              </strong>
              <p className="text-slate-600">
                Dựa trên định lý Bayes với giả định độc lập có điều kiện giữa các đặc trưng. Sử dụng <strong className="text-slate-900">MultinomialNB</strong> cho dữ liệu đếm/tần số (BoW, TF-IDF). Đối với đặc trưng liên tục từ Sentence Embeddings, nhóm sử dụng <strong className="text-slate-900">GaussianNB</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <strong className="text-slate-900 text-sm block">2. K-Nearest Neighbors (KNN)</strong>
              <p className="text-slate-600">
                Phân loại tin nhắn dựa trên khoảng cách (ví dụ Cosine / Euclidean) tới k láng giềng gần nhất trong không gian đặc trưng. Đạt Recall Spam rất cao trên nhánh Embeddings (95,31%).
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <strong className="text-slate-900 text-sm block">3. Decision Tree</strong>
              <p className="text-slate-600">
                Cây quyết định học các quy tắc phân tách nhị phân dựa trên chỉ số vẩn đục (Gini Impurity / Information Gain). Dễ giải thích nhưng dễ overfit trên dữ liệu văn bản thưa thớt nhiều chiều.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Giới hạn & Khuyến cáo (Limitations) */}
      <div className="bg-amber-50/60 rounded-xl p-6 sm:p-8 border border-amber-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <h2 className="text-base font-bold">
            Hạn chế của Mô hình & Phạm vi Áp dụng Thực tế
          </h2>
        </div>

        <ul className="text-xs text-amber-950 space-y-2.5 leading-relaxed pl-5 list-disc">
          <li>
            <strong>Ngôn ngữ:</strong> Mô hình được huấn luyện hoàn toàn trên tập dữ liệu SMS tiếng Anh. Với các tin nhắn tiếng Việt hoặc ngôn ngữ khác, các từ vựng ngoài từ điển sẽ không được trích xuất chính xác.
          </li>
          <li>
            <strong>Độ dài và cách viết đặc thù:</strong> Các tin nhắn quá ngắn (dưới 3-5 từ), từ ngữ viết tắt, tiếng lóng (slang), hoặc cách viết cố tình chèn ký tự đặc biệt để lách bộ lọc (obfuscation) có thể làm giảm độ tin cậy của mô hình.
          </li>
          <li>
            <strong>Độ suy rộng thực tế:</strong> Kết quả trên tập Test của bộ dữ liệu này (Test F1 93,93%) rất khả quan nhưng không bảo đảm chất lượng tương đương tuyệt đối cho mọi dạng tin nhắn rác thế hệ mới trong thực tế (drift phân phối dữ liệu theo thời gian).
          </li>
        </ul>
      </div>

      {/* 5. Tài liệu nguồn và Liên kết ngoài */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-teal-600 shrink-0" />
          <div>
            <span className="font-semibold text-slate-900 block">
              Tài nguyên tham chiếu của Bài tập lớn
            </span>
            <span className="text-slate-500">
              Mã nguồn huấn luyện trên Google Colab và tập dữ liệu SMS Spam Collection trên Kaggle.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={DATASET_STATS.kaggleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <span>Kaggle Dataset</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={DATASET_STATS.colabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <span>Notebook Google Colab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
