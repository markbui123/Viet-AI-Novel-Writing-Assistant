# Glossary — Thuật ngữ thống nhất cho bản dịch tiếng Việt

Bắt buộc dùng các bản dịch này cho mọi chuỗi chứa các từ dưới đây (dù là
chuỗi dài). Giữ nhất quán giữa các batch.

## Thuật ngữ cốt lõi (đã dịch trong từ điển)

| Tiếng Trung | Tiếng Việt |
|---|---|
| 小说 | tiểu thuyết |
| 创作 | sáng tác |
| 开书 | mở sách |
| 章节 | chương |
| 章 | chương |
| 卷 | tập (book volume) |
| 世界观 | thế giới quan |
| 角色 | nhân vật |
| 主角 | nhân vật chính |
| 配角 | nhân vật phụ |
| 知识库 | kho tri thức |
| 写法引擎 | công cụ cách viết |
| 任务 | nhiệm vụ / tác vụ |
| 任务中心 | trung tâm nhiệm vụ |
| 自动导演 | Đạo diễn AI |
| 导演 | đạo diễn |
| 模型 | model |
| 生成 | tạo / sinh |
| 生成中 | đang tạo |
| 审核 | thẩm định |
| 修复 | sửa chữa |
| 审校 | hiệu đính |
| 拆书 | phân tích sách |
| 灵感 | ý tưởng / cảm hứng |
| 类型 | thể loại |
| 题材 | đề tài |
| 风格 | phong cách |
| 文风 | văn phong |
| 节奏 | nhịp điệu |
| 剧情 | cốt truyện |
| 大纲 | dàn ý |
| 背景 | bối cảnh |
| 设定 | thiết lập |
| 资产 | tài sản |
| 资源 | tài nguyên |
| 素材 | tư liệu |
| 模板 | mẫu |
| 提示词 | prompt (giữ nguyên "prompt") |
| 版本 | phiên bản |
| 状态 | trạng thái |
| 设置 | cài đặt / thiết lập |
| 系统设置 | cài đặt hệ thống |
| 新建 | tạo mới |
| 删除 | xóa |
| 编辑 | chỉnh sửa |
| 保存 | lưu |
| 确认 | xác nhận |
| 取消 | hủy |
| 重试 | thử lại |
| 加载中 | đang tải |
| 加载失败 | tải thất bại |
| 搜索 | tìm kiếm |
| 返回 | quay lại |
| 首页 | trang chủ |
| 列表 | danh sách |
| 详情 | chi tiết |
| 全部 | tất cả |
| 暂无 | chưa có |
| 已完成 | đã hoàn thành |
| 失败 | thất bại |
| 成功 | thành công |
| 排队中 | đang xếp hàng |
| 已取消 | đã hủy |
| 待补全 | chờ bổ sung |
| 未命名 | chưa đặt tên |
| 保存中 | đang lưu |

## Quy tắc dịch

1. **Giữ nguyên `${...}`** (biến trong template) — số lượng và tên biến không đổi.
2. **Giữ nguyên danh từ riêng / thương hiệu / thuật ngữ kỹ thuật**: OpenAI,
   DeepSeek, Ollama, Qdrant, RAG, API, model, prompt, token, URL, SQLite...
3. **Giữ nguyên số, dấu câu**: `0/5 步完成` → `0/5 bước hoàn thành` (giữ dấu câu tiếng Trung như `：` `。` chuyển thành `: ` `.` cho tự nhiên).
4. **Chuỗi ngắn/đơn lẻ** (như "中", "无", "高", "低"): dịch nghĩa phổ biến nhất
   trong ngữ cảnh UI: 中 → "Đang chạy", 无 → "Không có", 高 → "Cao", 低 → "Thấp",
   中(trong 高中低) → "Trung bình".
5. **Chuỗi con**: nhiều chuỗi là cụm ngắn nằm trong cụm dài hơn — dịch đúng
   nghĩa độc lập của cụm đó.
6. **Giọng văn**: tự nhiên, gọn, đúng chuẩn UI tiếng Việt; không dịch word-for-word.
7. **KHÔNG thêm** key mới, KHÔNG bỏ sót chuỗi nào trong batch — mọi chuỗi
   trong file batch phải có entry.
8. **Định dạng output**: JSON object `{ "chuỗi gốc": "bản dịch" }` — key là
   chuỗi gốc NGUYÊN VẸN (không trim), value là bản dịch.
