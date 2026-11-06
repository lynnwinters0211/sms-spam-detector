import { PredictionResponse } from '../types';

const STORAGE_KEY_API_URL = 'sms_spam_api_url';
export const DEFAULT_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function getStoredApiUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_API_URL);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch {
    // Ignore localStorage errors
  }
  return DEFAULT_API_URL;
}

export function setStoredApiUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_API_URL, url.trim());
  } catch {
    // Ignore localStorage errors
  }
}

export interface HealthCheckResult {
  isHealthy: boolean;
  ready: boolean;
  modelName?: string;
  errorMessage?: string;
}

/**
 * Kiểm tra kết nối tới backend FastAPI qua endpoint GET /health
 */
export async function checkBackendHealth(customUrl?: string): Promise<HealthCheckResult> {
  const baseUrl = (customUrl || getStoredApiUrl()).replace(/\/+$/, '');
  const url = `${baseUrl}/health`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetail = `Lỗi HTTP ${response.status}`;
      try {
        const body = await response.json();
        if (body.detail || body.message || body.error) {
          errorDetail = body.detail || body.message || body.error;
        }
      } catch {
        // use fallback text
      }
      return {
        isHealthy: false,
        ready: false,
        errorMessage: `Máy chủ trả về mã ${response.status}: ${errorDetail}`,
      };
    }

    const data = await response.json();
    return {
      isHealthy: true,
      ready: data.ready === true,
      modelName: data.model || 'BoW + MultinomialNB',
      errorMessage: data.ready ? undefined : (data.error || 'Mô hình chưa được nạp (selected_model.joblib)'),
    };
  } catch (err: unknown) {
    const isAbort = err instanceof DOMException && err.name === 'AbortError';
    const message = isAbort
      ? 'Hết thời gian chờ kết nối (timeout 4s).'
      : 'Không thể kết nối đến máy chủ backend (kết nối bị từ chối hoặc sai địa chỉ).';
    return {
      isHealthy: false,
      ready: false,
      errorMessage: message,
    };
  }
}

export interface PredictResult {
  success: boolean;
  data?: PredictionResponse;
  errorMessage?: string;
  statusCode?: number;
}

/**
 * Gửi tin nhắn đến backend qua endpoint POST /predict
 */
export async function predictMessage(text: string): Promise<PredictResult> {
  const baseUrl = getStoredApiUrl().replace(/\/+$/, '');
  const url = `${baseUrl}/predict`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      let detail = `Lỗi máy chủ (${response.status})`;
      try {
        const errorBody = await response.json();
        if (errorBody.detail) {
          detail = typeof errorBody.detail === 'string' ? errorBody.detail : JSON.stringify(errorBody.detail);
        }
      } catch {
        // fallback
      }

      if (response.status === 422) {
        return {
          success: false,
          statusCode: 422,
          errorMessage: detail || 'Đầu vào không hợp lệ hoặc bộ trích xuất đặc trưng (CountVectorizer) không nhận diện được từ vựng nào trong tin nhắn.',
        };
      }

      if (response.status === 503) {
        return {
          success: false,
          statusCode: 503,
          errorMessage: 'Mô hình chưa sẵn sàng trên máy chủ backend (thiếu file selected_model.joblib).',
        };
      }

      return {
        success: false,
        statusCode: response.status,
        errorMessage: detail,
      };
    }

    const data: PredictionResponse = await response.json();
    return {
      success: true,
      data,
    };
  } catch (err: unknown) {
    const isAbort = err instanceof DOMException && err.name === 'AbortError';
    return {
      success: false,
      errorMessage: isAbort
        ? 'Thời gian yêu cầu dự đoán quá lâu (timeout 8s).'
        : 'Chưa kết nối mô hình. Vui lòng kiểm tra máy chủ backend đang chạy tại địa chỉ cấu hình.',
    };
  }
}
