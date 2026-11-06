# Hướng dẫn Chạy Backend FastAPI (SMS Spam Detector)

Backend này phục vụ suy luận trực tiếp cho ứng dụng web **SMS Spam Detector** bằng pipeline học máy đã huấn luyện trên Google Colab.

---

## 1. Hướng dẫn lấy file mô hình từ Google Drive

Trong Google Colab notebook của nhóm, mô hình tốt nhất (`BoW + MultinomialNB`) đã được lưu tại:
```text
/content/drive/MyDrive/SMS_SPAM_PROJECT/artifacts/selected_model.joblib
```

### Các bước lấy file:
1. Mở Google Drive của tài khoản đã chạy Colab.
2. Điều hướng vào thư mục: `SMS_SPAM_PROJECT` → `artifacts`.
3. Tải file `selected_model.joblib` về máy tính của bạn.
4. Di chuyển file này vào thư mục `backend/artifacts/` của dự án:
   ```text
   backend/artifacts/selected_model.joblib
   ```

*(Nếu đặt file ở vị trí khác, bạn có thể thiết lập biến môi trường `MODEL_PATH` trỏ tới đường dẫn đó).*

---

## 2. Cài đặt môi trường Python và thư viện

Yêu cầu: **Python 3.10+** (khuyến nghị Python 3.11).

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Tạo môi trường ảo (virtual environment)
python3 -m venv venv

# 3. Kích hoạt môi trường ảo:
# Trên Linux/macOS:
source venv/bin/activate
# Trên Windows:
# venv\Scripts\activate

# 4. Cài đặt các gói phụ thuộc
pip install -r requirements.txt
```

---

## 3. Khởi chạy máy chủ Backend

Chạy lệnh sau trong terminal:
```bash
uvicorn main:app --reload --port 8000 --host 0.0.0.0
```

Sau khi chạy thành công:
- API endpoint sẽ lắng nghe tại: `http://localhost:8000`
- Tài liệu Swagger UI tự động: `http://localhost:8000/docs`
- Kiểm tra trạng thái: `GET http://localhost:8000/health`

---

## 4. Kiểm tra API bằng Curl hoặc Postman

### Kiểm tra sức khỏe (Health Check):
```bash
curl http://localhost:8000/health
```
Kết quả khi có file mô hình:
```json
{
  "status": "ok",
  "ready": true,
  "model": "BoW + MultinomialNB",
  "model_path": ".../backend/artifacts/selected_model.joblib"
}
```

### Dự đoán tin nhắn (Predict):
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Congratulations! You have won a cash prize. Call now to claim."}'
```
Kết quả trả về:
```json
{
  "label": 1,
  "class_name": "Spam",
  "model": "BoW + MultinomialNB"
}
```

---

## 5. Kết nối với Ứng dụng Web

Trên giao diện web:
1. Nhấn vào nút trạng thái kết nối ở thanh điều hướng trên cùng ("Chưa kết nối mô hình").
2. Kiểm tra địa chỉ API Backend (mặc định là `http://localhost:8000`).
3. Nhấn **"Kiểm tra kết nối"** để ứng dụng xác thực trực tiếp qua endpoint `/health`.
4. Sau khi kết nối thành công, bạn có thể nhập tin nhắn bất kỳ để kiểm tra phân loại tức thì!
