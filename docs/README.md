# Quy ước quản lý Docs

`docs/` dùng để tiếp nhận các tài liệu thiết kế, checkpoint giai đoạn, kế hoạch mô-đun và lưu trữ lịch sử ngoài thư mục gốc, tránh tài liệu phương án tiếp tục nằm rải rác ở gốc repo.

## Quy tắc giữ lại ở thư mục gốc

Thư mục gốc chỉ giữ các loại file sau:

- Lối vào dự án và giới thiệu ra ngoài: `README.md`
- Lộ trình và danh sách thực thi chính: `TASK.md`
- Ràng buộc cộng tác và kỹ thuật: `AGENTS.md`
- Cấu hình Monorepo và toolchain: `package.json`、`pnpm-workspace.yaml`、`tsconfig.base.json`、`.env.example`

Các bản thiết kế còn lại, tổng kết giai đoạn, kế hoạch mô-đun, spec lịch sử — thống nhất vào các thư mục con tương ứng trong `docs/`.

## Phân chia thư mục

### `docs/checkpoints`

Dùng để ghi checkpoint giai đoạn, cột mốc di trú kiến trúc, kiểm toán tiến độ và đối chiếu giải thích.

- [Chapter Editor V2 Progress](./checkpoints/chapter-editor-v2-progress.md)
- [Prompt Governance Audit 2026-05-08](./checkpoints/prompt-governance-audit-2026-05-08.md)
- [LLM Schema Refactor Checkpoint](./checkpoints/llm-schema-refactor-checkpoint.md)
- [Windows Desktop Installer Manual Checklist](./checkpoints/windows-desktop-installer-manual-checklist.md)

### `docs/plans`

Dùng để chứa các kế hoạch mô-đun còn giá trị thực thi, phân rã công việc và phương án đẩy sản phẩm.

- [Assistant UI Plan](./plans/assistant-ui-plan.md)
- [Chapter Editor V2 Plan](./plans/chapter-editor-v2-plan.md)
- [Character Resource Ledger Plan](./plans/character-resource-ledger-plan.md)
- [Prompt Workbench, Context and Step Runtime Plan](./plans/prompt-workbench-context-and-step-runtime-plan.md)
- [Auto Director Execution Plane Isolation Plan](./plans/auto-director-execution-plane-isolation-plan.md)
- [Director Mode Module and State Refactor Checklist](./plans/director-mode-module-state-refactor-checklist.md)
- [Vòng khép kín hợp đồng trải nghiệm độc giả: phương án triển khai giai đoạn một](./plans/reader-experience-contract-phase-one.md)
- [Gia cố nền tảng Payoff Ledger: phương án triển khai giai đoạn hai](./plans/payoff-ledger-foundation-phase-two.md)
- [Vòng khép kín an toàn cơ bản P0: lời hứa ma và cổng lập lại kế hoạch](./plans/payoff-ledger-safety-phase-three.md)

### `docs/design`

Dùng để chứa thiết kế hệ thống, interface mô-đun, cơ chế sản phẩm và mô tả mô hình hóa lĩnh vực.

- [Hệ thiết kế UI tổng thể sản phẩm](./design/product-ui-design-system.md)
- [Style Engine v1](./design/style-engine-v1.md)
- [Style Engine Prompt Compiler v1](./design/style-engine-prompt-compiler-v1.md)
- [Style Engine Boundary and PRD v2](./design/style-engine-boundary-prd-v2.md)
- [World Management v2](./design/world-management-v2.md)
- [World Story Interface v1](./design/world-story-interface-v1.md)

### `docs/architecture`

Tiếp nhận mô tả kiến trúc xuyên suốt và quy ước kỹ thuật (không thay đổi lối vào gốc).

- [Backend testing](./architecture/testing.md): cách chạy và quy ước thư mục của script `node:test` phía backend.

### `docs/wiki`

Dùng để lắng đọng kiến thức dự án dài hạn, giúp nhà phát triển tương lai và AI Agent hiểu các quyết định kiến trúc then chốt, ranh giới quy trình, giao thức runtime, kinh nghiệm debug và căn cứ thiết kế sản phẩm.

Wiki không thay thế kế hoạch, checkpoint hay release notes:

- `docs/wiki` ghi các quy tắc ổn định và lý do.
- `docs/plans` ghi các phương án còn giá trị thực thi và phân rã công việc.
- `docs/checkpoints` ghi trạng thái giai đoạn, cột mốc di trú và đối chiếu kiểm toán.
- `docs/design` ghi thiết kế mô-đun, mô hình hóa lĩnh vực và cơ chế sản phẩm.
- `docs/releases` ghi các thay đổi người dùng thấy được.

- [Wiki Index](./wiki/README.md)
- [Wiki Entry Template](./wiki/entry-template.md)
- [Module Boundaries](./wiki/architecture/module-boundaries.md)
- [Auto Director Runtime](./wiki/workflows/auto-director-runtime.md)
- [Chapter Production Chain](./wiki/workflows/chapter-production-chain.md)
- [Prompt Registry and Structured Output](./wiki/prompts/prompt-registry-and-structured-output.md)

### `docs/releases`

Dùng để chứa toàn bộ ghi chú cập nhật phiên bản người dùng thấy được và lịch sử phát hành; `README.md` gốc chỉ giữ bản cập nhật mới nhất, thư mục này tiếp nhận toàn bộ lịch sử.

- [Release Notes](./releases/release-notes.md)

### `docs/archive`

Dùng để chứa các phương án khởi tạo lịch sử, tài liệu không còn là căn cứ thực thi chính nhưng vẫn cần giữ.

- [Project Init Spec](./archive/project-init-spec.md)
- [Outdated Docs Index](./archive/outdated/README.md)

## Quy tắc đặt tên tài liệu mới

- Thống nhất dùng tên file tiếng Anh viết thường, giữa các từ nối bằng `-`.
- Tài liệu dạng kế hoạch ưu tiên đặt `docs/plans/`.
- Điều chỉnh kiến trúc, kiểm tra tiến độ, checkpoint di trú ưu tiên đặt `docs/checkpoints/`.
- Thiết kế mô-đun, mô hình dữ liệu, cơ chế tương tác ưu tiên đặt `docs/design/`.
- Quy tắc kiến trúc dài hạn, ranh giới quy trình, kinh nghiệm debug và căn cứ thiết kế sản phẩm ưu tiên đặt `docs/wiki/`.
- Lịch sử cập nhật phiên bản người dùng thấy được ưu tiên đặt `docs/releases/`.
- Phương án đã bỏ, bị lỗi encoding, bị thực tế phát hành hiện tại thay thế rõ ràng nhưng cần lưu trữ đặt `docs/archive/outdated/`.

## Ràng buộc bảo trì

- Khi thêm tài liệu, trước tiên xác định xem có thực sự cần giữ ở thư mục gốc không; câu trả lời mặc định nên là "không cần".
- Khi thêm hoặc sửa quy trình cốt lõi, Prompt, RAG, trạng thái nhiệm vụ, Đạo diễn AI, sản xuất chương hoặc kết luận debug quan trọng, trước tiên xác định xem có tạo ra giá trị Wiki ổn định không.
- Trang Wiki nên giải thích quy tắc dài hạn và lý do, không viết thành danh sách thay đổi file, TODO tạm thời hay bản sao release notes.
- Sau khi di trú tài liệu, nếu `README.md` gốc hoặc tài liệu lối vào khác có tham chiếu, phải đồng bộ cập nhật đường dẫn.
- `TASK.md` đảm nhiệm "lộ trình chính và ưu tiên hiện tại", không thay thế tài liệu thiết kế; chi tiết thiết kế nên chìm xuống `docs/`.
- Ghi chú cập nhật trong `README.md` gốc chỉ giữ bản mới nhất; toàn bộ lịch sử thống nhất bảo trì ở `docs/releases/release-notes.md`.
