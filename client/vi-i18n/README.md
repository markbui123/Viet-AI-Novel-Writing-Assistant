# 🌏 Viet-AI-Novel-Writing-Assistant — Lớp dịch tiếng Việt (fork-owned)

Fork của [AI-Novel-Writing-Assistant](https://github.com/ExplosiveCoderflome/AI-Novel-Writing-Assistant)
với mục tiêu: **giao diện tiếng Việt** trong khi vẫn kéo được bản mới nhất từ
upstream mà **không vỡ bản dịch**.

## Vì sao làm theo cách này

App gốc **không có hệ thống i18n**: ~5.190 chuỗi tĩnh + 680 chuỗi template
tiếng Trung hardcode trong **454 file** `client/src`, cộng thêm nhiều chuỗi
server gửi qua API. Dịch thẳng vào 454 file đó → mỗi lần `git pull upstream`
(upstream đổi UI copy liên tục) sẽ conflict tràn lan.

Giải pháp: **lớp dịch build-time/runtime** — toàn bộ bản dịch nằm trong file
riêng của fork, KHÔNG đụng file source gốc (trừ 2 file mount nhỏ).

## Kiến trúc (2 lớp)

```
client/vi-i18n/
├── vi-dict.json                        ← TỪ ĐIỂN Trung→Việt (file duy nhất cần dịch)
└── vite-plugin-vi-translate.ts         ← Vite plugin: thay chuỗi Trung→Việt lúc build/dev

server/src/vi-i18n/
└── vi-translate-middleware.ts          ← Express middleware: dịch JSON response từ API
```

Chỉ 2 file upstream bị sửa (tổng ~7 dòng):
- `client/vite.config.ts` — import + đăng ký `viTranslatePlugin()`
- `server/src/app.ts` — import + mount `viTranslateMiddleware()` sau `express.json`

## Cách thêm/dịch chuỗi

1. Mở `client/vi-i18n/vi-dict.json`, thêm entry: `"chuỗi tiếng Trung": "bản dịch tiếng Việt"`
2. Key dài hơn tự được ưu tiên khớp trước (tránh key ngắn phá key dài)
3. **Server**: tự nạp lại từ điển theo mtime mỗi request — không cần restart
4. **Client**: thay đổi file `vite.config.ts`/plugin → Vite tự restart; sửa dict
   → thêm entry xong nếu chưa thấy đổi, restart client dev (`pnpm dev` trong `client/`)
5. Chuỗi chưa dịch vẫn hiện tiếng Trung — đó là báo hiệu "thiếu entry", không phải lỗi

## Workflow kéo bản mới từ upstream

```bash
git fetch upstream
git merge upstream/main        # hầu như không conflict (chỉ 2 file mount nhỏ)
# chuỗi Trung mới của upstream hiện ra → thêm entry vào vi-dict.json → commit
git push origin main
```

## Các lưu ý đã biết

- **Template có biến** (`${count} 项...`): key = đúng chuỗi source (kể cả `${...}`),
  phần `${...}` giữ nguyên trong bản dịch
- **Chuỗi con chung** (ví dụ "创作"): nên thêm cả cụm dài hơn vào dict để tránh
  bản dịch trộn nửa Trung nửa Việt ("Sáng tác环境")
- **⚠️ KHÔNG dùng ASCII quote/backtick trong bản dịch**: `"` `'` `` ` `` làm VỠ
  cú pháp source (chuỗi string literal / template literal). Bản dịch phải dùng
  ngoặc cong `“ ”` `‘ ’`. Script `sanitize` đã chạy 1 lần toàn dict; khi thêm
  entry mới tự kiểm tra
- **Mojibake**: vài chuỗi trong source bị hỏng encoding (ví dụ `绔犺妭` = "章节")
  — đã dịch theo nghĩa khôi phục; 3 biến thể còn lại là lỗi source, không dịch
- **Extractor bắt cả code fragments**: template literal chứa code + chữ Trung
  (prompt hệ thống, regex...) bị capture thành key khổng lồ. **ĐÃ XÓA 503 key
  này khỏi dict** — chúng khớp vào vị trí CODE thật trong file khác và làm vỡ
  build (ví dụ key `: ""}${structured...}` khớp vào ternary trong SettingsPage).
  Chỉ giữ key "thuần text" (chữ Trung + `${...}` + dấu câu); từ Trung bên trong
  code fragments vẫn được key ngắn riêng dịch
- **KHÔNG thêm key không chứa chữ Trung** (meta field như `_note`): khớp substring
  ASCII trong code → vỡ build (`_note` nằm trong `supplement_notes`). Plugin +
  middleware đã có guard lọc key không chứa chữ Hán
- **Server round-trip**: nếu sau này field dữ liệu bị client gửi NGƯỢC lên server
  làm key lookup (tên đã dịch), phải whitelist path trong middleware
- **Prompts AI** (115 file, `server/src/prompting/prompts/`) — KHÔNG dịch text prompt gốc
  (giữ nguyên để pull upstream không conflict). Thay vào đó, **chỉ thị ngôn ngữ đầu ra**
  (`server/src/vi-i18n/vi-output-directive.ts`) được chèn vào system message của MỌI
  prompt qua promptRunner → AI viết nội dung bằng tiếng Việt, giữ nguyên schema JSON
- Plugin áp dụng cho **CẢ dev lẫn production build** (desktop)
- **Dịch hàng loạt bằng MiniMax** (`scripts/translate-batch-minimax.mjs`):
  - Proxy hatinhcogi trả JSON + `\ndata: [DONE]` chèn sau → script strip dòng `data:`
  - Batch 25 chuỗi/request (lớn hơn bị 504), concurrency thấp (2-8) tránh 429 rate-limit
  - Script ghi tiến độ sau mỗi sub-batch + resume → timeout/429 không mất công
  - M2.5 tiết kiệm quota hơn M2.7; dùng env `MINIMAX_MODEL` để đổi
- **Hiệu năng**: dict 1.6MB/14K entries — plugin/middleware cache sorted keys
  (không sort lại mỗi lần); lần đầu load dev có thể chậm vài chục giây (transform
  toàn bộ module), sau đó cache nhanh

## Trạng thái dịch (2026-08-31)

- **14.092/14.112 chuỗi** (~99.9%) đã dịch trong `vi-dict.json`
- Nguồn: 4 batch subagent (chunk 02, 06-08) + 11 batch MiniMax M2.7/M2.5 (còn lại)
  + 45 entry dịch tay (chuỗi khó/đa dòng/mojibake)
- Còn 20 chuỗi = code fragments (cố ý bỏ) — xem `untranslated.json`

## Dev server

```bash
cd server && pnpm dev   # backend :3005 (KHÔNG chạy pnpm dev ở root — bị treo do shared watcher)
cd client && pnpm dev   # frontend :5173
```
