import { ModelExperimentResult, ConfusionMatrixData, AlgorithmType, RepresentationType } from '../types';

/**
 * Bảng kết quả thực nghiệm 9 cấu hình từ Google Colab notebook (số liệu cố định theo %)
 */
export const EXPERIMENT_RESULTS: ModelExperimentResult[] = [
  {
    representation: 'BoW',
    algorithm: 'Naive Bayes',
    accuracy: 98.55,
    precisionSpam: 97.48,
    recallSpam: 90.62,
    f1Spam: 93.93,
    isMainModel: true,
    notes: 'Mô hình chính — chọn bằng 5-fold CV',
  },
  {
    representation: 'TF-IDF',
    algorithm: 'Naive Bayes',
    accuracy: 98.45,
    precisionSpam: 95.90,
    recallSpam: 91.41,
    f1Spam: 93.60,
  },
  {
    representation: 'Embeddings',
    algorithm: 'KNN',
    accuracy: 97.48,
    precisionSpam: 85.92,
    recallSpam: 95.31,
    f1Spam: 90.37,
  },
  {
    representation: 'TF-IDF',
    algorithm: 'KNN',
    accuracy: 97.58,
    precisionSpam: 95.58,
    recallSpam: 84.38,
    f1Spam: 89.63,
  },
  {
    representation: 'BoW',
    algorithm: 'KNN',
    accuracy: 97.38,
    precisionSpam: 95.50,
    recallSpam: 82.81,
    f1Spam: 88.70,
  },
  {
    representation: 'BoW',
    algorithm: 'Decision Tree',
    accuracy: 97.00,
    precisionSpam: 90.76,
    recallSpam: 84.38,
    f1Spam: 87.45,
  },
  {
    representation: 'Embeddings',
    algorithm: 'Naive Bayes',
    accuracy: 95.74,
    precisionSpam: 79.58,
    recallSpam: 88.28,
    f1Spam: 83.70,
    notes: 'Sử dụng GaussianNB cho đặc trưng Embeddings liên tục',
  },
  {
    representation: 'TF-IDF',
    algorithm: 'Decision Tree',
    accuracy: 95.74,
    precisionSpam: 89.62,
    recallSpam: 74.22,
    f1Spam: 81.20,
  },
  {
    representation: 'Embeddings',
    algorithm: 'Decision Tree',
    accuracy: 96.03,
    precisionSpam: 84.80,
    recallSpam: 82.81,
    f1Spam: 83.79,
  },
];

/**
 * Thông số mô hình chính: BoW + MultinomialNB
 */
export const MAIN_MODEL_SPECS = {
  name: 'BoW + MultinomialNB',
  algorithm: 'Multinomial Naive Bayes (alpha=0.5)',
  vectorizer: 'CountVectorizer(lowercase=True, ngram_range=(1,2), min_df=1)',
  cvF1Spam: 94.03,
  testAccuracy: 98.55,
  testPrecisionSpam: 97.48,
  testRecallSpam: 90.62,
  testF1Spam: 93.93,
  testMacroF1: 96.55,
  pipelinePath: '/content/drive/MyDrive/SMS_SPAM_PROJECT/artifacts/selected_model.joblib',
};

/**
 * Confusion Matrix của mô hình chính trên tập Test:
 * Hàng là nhãn thật, Cột là nhãn dự đoán: [[TN, FP], [FN, TP]]
 * Thứ tự nhãn: 0 = Ham, 1 = Spam
 */
export const MAIN_MODEL_CONFUSION_MATRIX: ConfusionMatrixData = {
  matrix: [
    [901, 3],
    [12, 116],
  ],
  tn: 901, // 901 Ham đúng
  fp: 3,   // 3 Ham bị đánh dấu nhầm thành Spam
  fn: 12,  // 12 Spam bị bỏ sót thành Ham
  tp: 116, // 116 Spam đúng
  total: 1032, // 904 Ham + 128 Spam
};

/**
 * Thống kê bộ dữ liệu thực nghiệm
 */
export const DATASET_STATS = {
  rawCount: 5574,
  duplicateCount: 415,
  cleanedCount: 5159,
  trainCount: 4127,
  testCount: 1032,
  testHamCount: 904,
  testSpamCount: 128,
  trainRatio: '80%',
  testRatio: '20%',
  kaggleUrl: 'https://www.kaggle.com/datasets/thedevastator/sms-spam-collection-a-more-diverse-dataset/data',
  colabUrl: 'https://colab.research.google.com/drive/1EQdq1fgRhMKUJNMVJheyB3Yv_ZJaQvmq?usp=sharing',
};

/**
 * Định dạng số phần trăm theo chuẩn tiếng Việt không bị khoảng trắng thừa (ví dụ: 98,55%)
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

/**
 * Bộ lọc dữ liệu thực nghiệm theo Thuật toán và Biểu diễn
 */
export function filterExperimentResults(
  results: ModelExperimentResult[],
  selectedAlgorithm: AlgorithmType | 'ALL',
  selectedRepresentation: RepresentationType | 'ALL'
): ModelExperimentResult[] {
  return results.filter((item) => {
    const matchAlgo = selectedAlgorithm === 'ALL' || item.algorithm === selectedAlgorithm;
    const matchRep = selectedRepresentation === 'ALL' || item.representation === selectedRepresentation;
    return matchAlgo && matchRep;
  });
}
