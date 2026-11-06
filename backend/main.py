"""
FastAPI Backend cho SMS Spam Detector
Nạp pipeline mô hình BoW + MultinomialNB đã lưu từ Google Colab (selected_model.joblib).
"""

import os
import sys
from typing import Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Đường dẫn file mô hình pipeline được cấu hình qua biến môi trường
DEFAULT_MODEL_PATH = os.path.join(os.path.dirname(__file__), "artifacts", "selected_model.joblib")
MODEL_PATH = os.environ.get("MODEL_PATH", DEFAULT_MODEL_PATH)

app = FastAPI(
    title="SMS Spam Detector API",
    description="API dự đoán tin nhắn rác (SMS Spam) sử dụng mô hình học máy BoW + MultinomialNB",
    version="1.0.0"
)

# Cấu hình CORS để cho phép ứng dụng web kết nối
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả origins trong môi trường học tập/phát triển
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Biến toàn cục lưu pipeline mô hình sau khi nạp một lần duy nhất lúc khởi động
pipeline = None
model_load_error: Optional[str] = None


def load_model_pipeline():
    global pipeline, model_load_error
    if os.path.exists(MODEL_PATH):
        try:
            import joblib
            pipeline = joblib.load(MODEL_PATH)
            print(f"[*] Đã nạp thành công pipeline mô hình từ: {MODEL_PATH}")
            model_load_error = None
        except Exception as e:
            model_load_error = f"Lỗi khi nạp file mô hình: {str(e)}"
            print(f"[!] {model_load_error}", file=sys.stderr)
            pipeline = None
    else:
        model_load_error = f"Không tìm thấy file mô hình tại '{MODEL_PATH}'. Vui lòng tải 'selected_model.joblib' từ Google Drive và đặt vào thư mục artifacts/."
        print(f"[!] {model_load_error}", file=sys.stderr)
        pipeline = None


@app.on_event("startup")
def on_startup():
    load_model_pipeline()


class PredictRequest(BaseModel):
    text: str = Field(..., description="Nội dung tin nhắn SMS cần phân loại")


class PredictResponse(BaseModel):
    label: int = Field(..., description="Nhãn dự đoán: 0 = Ham, 1 = Spam")
    class_name: str = Field(..., description="Tên phân lớp: 'Ham' hoặc 'Spam'")
    model: str = Field(..., description="Tên cấu hình mô hình")


@app.get("/health", summary="Kiểm tra trạng thái sẵn sàng của mô hình")
def health_check():
    """
    Kiểm tra trạng thái kết nối và khả năng phục vụ dự đoán của mô hình.
    """
    if pipeline is not None:
        return {
            "status": "ok",
            "ready": True,
            "model": "BoW + MultinomialNB",
            "model_path": MODEL_PATH,
        }
    return {
        "status": "not_ready",
        "ready": False,
        "error": model_load_error or "Mô hình chưa được nạp",
        "expected_path": MODEL_PATH,
    }


@app.post("/predict", response_model=PredictResponse, summary="Dự đoán tin nhắn Ham/Spam")
def predict_sms(request: PredictRequest):
    """
    Phân loại nội dung tin nhắn SMS:
    - 0 / Ham: Tin nhắn thông thường
    - 1 / Spam: Tin nhắn rác
    """
    raw_text = request.text
    if raw_text is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Nội dung tin nhắn không được rỗng."
        )

    cleaned_text = raw_text.strip()
    if len(cleaned_text) == 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Nội dung tin nhắn không được để trống hoặc chỉ chứa khoảng trắng."
        )

    if len(raw_text) > 5000:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Nội dung tin nhắn vượt quá giới hạn 5.000 ký tự (hiện có {len(raw_text)} ký tự)."
        )

    if pipeline is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Mô hình chưa sẵn sàng trên máy chủ (thiếu file selected_model.joblib). Vui lòng đặt file mô hình vào thư mục artifacts/ và khởi động lại."
        )

    try:
        # Kiểm tra bước vectorizer để xác minh có từ vựng nào được nhận diện không
        vectorizer = None
        if hasattr(pipeline, "named_steps") and "vectorizer" in pipeline.named_steps:
            vectorizer = pipeline.named_steps["vectorizer"]
        elif hasattr(pipeline, "steps") and len(pipeline.steps) > 0:
            vectorizer = pipeline.steps[0][1]

        if vectorizer is not None and hasattr(vectorizer, "transform"):
            vec_matrix = vectorizer.transform([cleaned_text])
            # Nếu toàn bộ đặc trưng đều bằng 0 (out-of-vocabulary)
            if hasattr(vec_matrix, "nnz") and vec_matrix.nnz == 0:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Bộ trích xuất đặc trưng (CountVectorizer) không nhận diện được bất kỳ từ vựng nào trong tin nhắn so với từ điển đã học. Vui lòng nhập nội dung có từ ngữ rõ ràng."
                )

        # Sử dụng nguyên vẹn pipeline đã lưu từ Colab, không fit lại
        prediction = pipeline.predict([cleaned_text])[0]
        label_int = int(prediction)
        class_name = "Spam" if label_int == 1 else "Ham"

        return PredictResponse(
            label=label_int,
            class_name=class_name,
            model="BoW + MultinomialNB"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi trong quá trình suy luận mô hình: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
