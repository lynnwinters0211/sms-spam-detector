/**
 * Utilities for SMS input validation and formatting
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export const MAX_SMS_LENGTH = 5000;

export function validateSmsInput(text: string): ValidationResult {
  if (text === undefined || text === null) {
    return {
      isValid: false,
      errorMessage: 'Vui lòng nhập nội dung tin nhắn SMS.',
    };
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      errorMessage: 'Nội dung tin nhắn không được để trống hoặc chỉ chứa khoảng trắng.',
    };
  }

  if (text.length > MAX_SMS_LENGTH) {
    return {
      isValid: false,
      errorMessage: `Nội dung tin nhắn vượt quá giới hạn cho phép (${text.length.toLocaleString('vi-VN')} / ${MAX_SMS_LENGTH.toLocaleString('vi-VN')} ký tự).`,
    };
  }

  return {
    isValid: true,
    errorMessage: null,
  };
}

/**
 * Trả về giải thích tiếng Việt cho nhãn dự đoán
 */
export function getLabelExplanation(label: 0 | 1): {
  title: string;
  badgeText: string;
  description: string;
  badgeColor: 'emerald' | 'rose';
} {
  if (label === 0) {
    return {
      title: 'Tin nhắn thông thường (Ham)',
      badgeText: 'Hợp lệ / Ham',
      description: 'Nội dung giao tiếp bình thường, không mang đặc trưng thư rác, quảng cáo không mong muốn hoặc lừa đảo.',
      badgeColor: 'emerald',
    };
  } else {
    return {
      title: 'Tin nhắn rác (Spam)',
      badgeText: 'Tin rác / Spam',
      description: 'Phát hiện nội dung có đặc trưng spam: thông báo trúng thưởng, kêu gọi gọi điện/nhắn tin khẩn, liên kết mạo danh hoặc quảng cáo thương mại trái phép.',
      badgeColor: 'rose',
    };
  }
}
