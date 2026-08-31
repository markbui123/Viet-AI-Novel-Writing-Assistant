# Trang giới thiệu GitHub Pages

Thư mục này là trang giới thiệu công khai của dự án, dùng React + Vite build thành file tĩnh, có thể lưu trữ bằng GitHub Pages.

## Xem trước cục bộ

```bash
pnpm --filter @ai-novel/site dev
```

Mặc định lắng nghe `http://localhost:4173` (tách với cổng 3000 của client dự án chính, tránh xung đột với cổng 5173 mặc định của các dự án vite khác).

## Build

```bash
pnpm --filter @ai-novel/site build
```

Sản phẩm build xuất ra `site/dist`.

## Kiểm tra đăng ký tài liệu

Lối vào tài liệu công khai do `src/docsManifest.ts` bảo trì. Sau khi thêm tài liệu công khai, chạy:

```bash
pnpm check:docs-manifest
```

Kiểm tra sẽ quét `docs/public/**/*.md` và `docs/releases/release-notes.md`, xác nhận mọi tài liệu công khai đã đăng ký vào manifest, và không có đăng ký file không tồn tại.

Kiểm tra cũng đọc `DirectorProgressItemKey` trong `server/src/services/novel/director/projections/novelDirectorProgress.ts`, và xác nhận `DIRECTOR_PROGRESS_ITEM_KEYS` ở đầu `docs/public/flow/auto-director-pipeline.md` phủ hết mọi giai đoạn tiến độ Đạo diễn AI.

## GitHub Pages

`.github/workflows/site-pages.yml` sẽ build `@ai-novel/site` khi push lên `main` hoặc trigger thủ công, và phát hành `site/dist` lên GitHub Pages.

## Lối vào tài liệu

Trang có sẵn lối vào tài liệu `#/docs`. Tài liệu công khai được bảo trì bằng whitelist `src/docsManifest.ts`, nguồn giới hạn ở tài liệu hướng người dùng trong `docs/public/`, giới thiệu mô-đun sidebar trong `docs/public/modules/`, và `docs/releases/release-notes.md`.

Không tự động gắn toàn bộ thư mục `docs/` vào trang công khai; wiki nội bộ, `archive`, `checkpoints`, `plans` và các kế hoạch thực thi chưa gọn không hiển thị mặc định.

Quy trình đề xuất khi thêm tài liệu mô-đun:

1. Thêm file Markdown trong `docs/public/` hoặc `docs/public/modules/`.
2. Đăng ký `id`, tiêu đề, mô tả và `sourcePath` trong `site/src/docsManifest.ts`.
3. Cần tăng cường lối vào ở trang chủ thì cập nhật thêm copy hoặc teaser trong `site/src/App.tsx`.
4. Chạy `pnpm check:docs-manifest`.
5. Chạy `pnpm --filter @ai-novel/site build`.

Nội dung tài liệu do `src/docsContent.ts` dùng Vite glob tự tải, không cần viết tay import cho từng bài Markdown.

Sơ đồ trong tài liệu chuyên sâu đặt ở `docs/public/flow/diagrams/`. Trang dùng `src/docsAssets.ts` phân giải các SVG/PNG đó thành URL sản phẩm build, Markdown có thể tham chiếu bằng đường dẫn tương đối, ví dụ `![Chuỗi sản xuất ba tầng đầu cuối](./diagrams/end-to-end-production.svg)`.
