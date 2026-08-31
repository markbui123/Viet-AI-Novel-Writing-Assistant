# AI 小说创作工作台 / AI Novel Production Engine

> **🇻🇳 Fork tiếng Việt** — bản này là `markbui123/Viet-AI-Novel-Writing-Assistant`, giao diện và tài liệu đã được Việt hoá qua lớp dịch build-time (`client/vi-i18n/`), vẫn có thể kéo bản mới từ upstream `ExplosiveCoderflome/AI-Novel-Writing-Assistant`.
> Bản README gốc tiếng Trung được cập nhật từ upstream; nếu có xung đột khi merge, ưu tiên giữ bản tiếng Việt.

Một dự án mã nguồn mở AI Native dành cho sáng tác tiểu thuyết dài kỳ.

Đường phát triển chính hiện tại:
`Creative Hub + Đạo diễn AI mở sách + Ngữ cảnh thế giới cuốn sách + Chuỗi sản xuất trọn cuốn + Công cụ cách viết`

![Monorepo](https://img.shields.io/badge/Monorepo-pnpm%20workspace-3C873A)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20Prisma-111827)
![LangChain](https://img.shields.io/badge/AI-LangChain-0EA5E9)
![LangGraph](https://img.shields.io/badge/Agent-LangGraph-7C3AED)
![Editor](https://img.shields.io/badge/Editor-Plate-7C3AED)
![Database](https://img.shields.io/badge/Database-SQLite%20%2B%20Prisma-111827)
![Vector DB](https://img.shields.io/badge/RAG-Qdrant-E63946)

## ✨ Giới thiệu dự án

Đây là một **hệ thống sản xuất AI hướng tới hoàn thành tiểu thuyết dài kỳ**, không phải kiểu "bạn viết một câu, AI bổ sung một câu" như các ứng dụng chat thông thường.

Cách tiếp cận cốt lõi:

- 👉 Dùng một câu ý tưởng khởi động kế hoạch cho cả cuốn sách — AI tự đề xuất hướng đi / thế giới / nhân vật / chiến lược tập / nhiệm vụ chương
- 👉 Nối việc sinh chương, hiệu đính, sửa chữa và cập nhật trạng thái thành một chuỗi sản xuất có thể tạm dừng và khôi phục
- 👉 Biến phân tích sách, kho tri thức, công cụ cách viết, sổ cái tài sản nhân vật và sổ tay thế giới thành tài sản dài hạn có thể triệu hồi
- 👉 Cung cấp các xưởng phái sinh (truyện tranh, phim ngắn) để mở rộng hình ảnh và kịch bản từ nội dung tiểu thuyết đã hoàn thành
- 👉 Kèm trang giới thiệu công khai, tài liệu chuyên sâu về chuỗi sản xuất và sổ tay khôi phục theo từng giai đoạn

Phù hợp với **người mới hoàn toàn chưa biết viết lách** muốn hoàn thành một cuốn tiểu thuyết dài, cũng phù hợp với các nhà phát triển muốn nghiên cứu ứng dụng AI Native, Agent Workflow, điều phối LangGraph và các tác vụ chuỗi dài.

## Bản desktop Windows

Nếu bạn chỉ muốn tải về cài đặt và dùng ngay, hãy vào từ bản desktop:

- Tải về: [GitHub Releases](https://github.com/ExplosiveCoderflome/AI-Novel-Writing-Assistant/releases)
- Trang phiên bản mới nhất: [Latest Release](https://github.com/ExplosiveCoderflome/AI-Novel-Writing-Assistant/releases/latest)
- Nên ưu tiên tải bản cài đặt `Setup.exe`; nếu không muốn cài đặt, hoặc muốn chạy trực tiếp từ USB / thư mục tạm, chọn bản `portable`
- Trang giới thiệu công khai: [GitHub Pages](https://explosivecoderflome.github.io/AI-Novel-Writing-Assistant/) cung cấp xem trước tính năng, tài liệu mô-đun và hướng dẫn sử dụng

## Sáng tác dài kỳ bằng Codex: Ani Book Skill

Nếu bạn muốn trực tiếp viết tiểu thuyết trong workspace cục bộ của Codex, có thể dùng [Ani Book Skill](https://github.com/ExplosiveCoderflome/ani-book-skill). Skill này tổ chức phán đoán hướng đi, động cơ câu chuyện, đẩy chương, hiệu đính sửa chữa và quản lý liên tục thành một quy trình sáng tác dài kỳ có thể khôi phục và truy vết.

Đây là một lối vào sáng tác bổ trợ cho dự án này:

- Cần bàn làm việc sáng tác trực quan, cấu hình model, trạng thái chạy thực và quản lý tài sản tiểu thuyết: dùng repo này.
- Muốn trong Codex dùng file cục bộ, artifact theo giai đoạn và Skill để sáng tác liên tục: qua [Ani Book Skill](https://github.com/ExplosiveCoderflome/ani-book-skill).

## Định vị dự án

Nhiều công cụ viết AI cách dùng khá giống nhau: bạn nhập một prompt, nó trả một đoạn văn, không hài lòng thì thử lại. Viết truyện ngắn thì được, viết truyện dài dễ càng viết càng loãng.

Repo này là "hệ thống sản xuất tiểu thuyết dài theo kiểu AI đạo diễn", phán đoán sản phẩm cốt lõi:

- Người dùng mục tiêu ưu tiên là người mới hoàn toàn chưa biết viết, không phải tác giả lão luyện am hiểu cấu trúc
- Ưu tiên giải quyết "làm sao viết xong cả cuốn sách", rồi mới tối ưu "viết tinh xảo đến mức nào"
- AI không chỉ là model bổ sung văn bản, mà là vai trò hệ thống tham gia lập kế hoạch, phán đoán, điều phối, thực thi và truy vết

Nếu bạn đang tìm các dự án kiểu sau, repo này đáng quan tâm hơn:

- Muốn kiểm chứng AI thực sự có thể tham gia sản xuất cả cuốn tiểu thuyết, chứ không chỉ viết từng đoạn
- Muốn nghiên cứu AI Native Product, Agent Workflow, điều phối LangGraph ứng dụng vào nghiệp vụ sáng tác thực tế
- Muốn nối thế giới quan, nhân vật, phân tích sách, kho tri thức, kiểm soát cách viết, sinh chương, sửa chất lượng thành một quy trình ổn định

## Hiện đã làm được gì

### 1. Đạo diễn AI mở sách và bàn giao sản xuất nội dung

- Từ một câu ý tưởng vào thẳng Đạo diễn AI, không cần viết tay thế giới quan, mạch chính, nhân vật và cương tập; hệ thống trước tiên sắp xếp thiết lập dự án, căn chỉnh framing cấp sách, rồi sinh nhiều bộ hướng đi trọn cuốn kèm nhóm tiêu đề tương ứng
- Không hài lòng hướng đi có thể tiếp tục sinh, chỉnh sửa định hướng một bộ phương án, hoặc chỉ làm lại nhóm tiêu đề của một bộ — tránh kiểu "ưng thì xác nhận / không ưng thì làm lại cả lô"
- Đạo diễn AI đẩy hướng cấp sách, nhân vật và kế hoạch tập/chương đến mức có thể bắt đầu viết, rồi người dùng chọn: **sáng tác đơn giản** để AI tự hoàn thành cả cuốn liên tục, **sáng tác chuyên nghiệp** vào bàn làm việc đầy đủ để kiểm tra và điều chỉnh
- Ở chế độ toàn tự động, khi model không khả dụng, hết hạn mức, sửa chữa liên tục thất bại, yêu cầu lập lại kế hoạch... hệ thống chủ động dừng thay vì thử lại vô hạn; mọi trạng thái lưu vào nhật ký theo dõi Đạo diễn, có thể khôi phục từ checkpoint ban đầu
- Ở chế độ toàn tự động, sau mỗi đợt chương hoàn thành sẽ tự xác nhận các nhân vật ứng viên đang chờ; nhân vật vào sổ chính thức và kích hoạt tái cấu trúc động, loại bỏ trôi dạt nhất quán nhân vật ở các chương sau
- Chuỗi phủ: hướng cấp sách, kế hoạch tổng thể câu chuyện, thế giới cuốn sách, chuẩn bị nhân vật, chiến lược tập / khung tập, bảng nhịp, danh sách chương, chi tiết hóa chương, thực thi chương, hiệu đính, sửa chữa — mỗi giai đoạn đều hỗ trợ khôi phục từ checkpoint, tiếp quản và đổi model thử lại

### 2. Creative Hub và Agent Runtime

- Trung tâm sáng tác thống nhất đảm nhiệm hội thoại, hỏi đáp, lập kế hoạch, gọi công cụ, trạng thái nhiệm vụ và tổng kết lượt — không còn là những nút chức năng rời rạc
- Trong hệ thống có Planner, Tool Registry, Runtime, nút phê duyệt, thẻ trạng thái và chuỗi khôi phục khi gián đoạn rõ ràng; ý định ngôn ngữ tự nhiên được route tới giai đoạn Đạo diễn AI hoặc nhiệm vụ chương tương ứng
- Thông báo dừng ở trình duyệt: khi đến checkpoint sẽ bật thông báo hệ thống, yên tâm treo máy cho các tác vụ chuỗi dài

### 3. Chuỗi sản xuất trọn cuốn và thực thi chương

- Runtime chương đơn, thực thi chương và pipeline hàng loạt trọn cuốn hội tụ về cùng một chuỗi chính
- Ngữ cảnh sinh chương lọc chính xác sổ cái tài sản nhân vật theo những người tham gia của chương này, tránh nhồi toàn bộ nhân vật vào prompt; rủi ro cao đã vào sổ và đề xuất đang chờ đi theo các mã kiểm toán khác nhau, nội dung chính không viết tài nguyên đang chờ thành sự thật đã hoàn thành
- Chuỗi thực thi chương phủ: sinh nội dung, hiệu đính AI, xử lý vấn đề sửa được, ghi nợ chất lượng, cập nhật trạng thái nhân vật / sự kiện / điềm báo, lối vào chương tiếp theo
- Sửa rò rỉ bộ nhớ ở bộ giới hạn tốc độ LLM: khi cấu hình provider thay đổi sẽ loại bỏ bộ giới hạn cũ, bộ nhớ ổn định khi chạy lâu

### 4. Bàn làm việc phân tích sách và tiến hóa hình tượng nhân vật

- Hồ sơ nhân vật khi phân tích sách chia **tóm tắt / tiêu chuẩn / chuyên sâu / đầy đủ** bốn cấp; hồ sơ chuyên sâu và đầy đủ truy hồi đoạn gốc để bổ sung chiều dữ liệu
- **Tiến hóa hình tượng nhân vật**: quét tăng dần các chương xuất hiện theo mức phủ 25% / 50% / 75% / 100%, lắng đọng mỏ neo ngoại hình, trang phục, trạng thái và bối cảnh của mỗi chương, đồng thời dựa trên snapshot chương tạo ảnh hình tượng theo giai đoạn của cùng một nhân vật; từ khóa ngoại hình ngắn trích xuất được đưa vào vùng chờ xác nhận, tick chọn để hợp nhất vào hồ sơ nhân vật
- Ảnh hình tượng chương có thể tham chiếu ảnh hình tượng cơ bản của nhân vật, giữ nhất quán khuôn mặt / kiểu tóc / chi tiết nhận diện
- Phân tích sách còn có đọc hai cột, truy hồi bằng chứng chương, phân tích định hướng theo phạm vi, bảo vệ ngân sách token, chế độ chẩn đoán bản thảo

### 5. Công cụ cách viết và quy tắc chống AI

- Cách viết không còn chỉ là một đoạn mô tả trong prompt, mà là tài sản dài hạn có thể lưu, sửa, gắn kết, thử viết, tái sử dụng
- Có thể trích đặc trưng cách viết từ văn bản hiện có + mẫu gốc; đặc trưng lắng đọng thành hồ chứa đặc trưng hiển thị được, bật / tắt / kết hợp từng mục, quy tắc tự biên dịch lại
- Công cụ cách viết tham gia chuỗi sinh, phát hiện và sửa; quy tắc chống AI giảm cảm giác khuôn mẫu, cảm giác giải thích và biểu đạt rỗng tuếch

### 6. Thế giới cuốn sách, nhân vật, kho tri thức liên kết + RAG

- Thế giới quan nâng cấp từ văn bản thiết lập dài dòng thành thế giới cuốn sách có thể sinh / tái sử dụng / đồng bộ; bản đồ, đồ thị thế lực đi vào ngữ cảnh chương
- Kết quả phân tích sách và tài liệu kho tri thức qua RAG được cập nhật ngược vào lập kế hoạch, viết tiếp và sinh nội dung
- Lập chỉ mục RAG song song streaming: concurrency Embedding và ghi Qdrant điều chỉnh được; sản phẩm phân tích sách vào chỉ mục facets để truy hồi gồm cả kết luận phân tích; hash chunk chống trùng lặp ngăn vector lặp khi tái tạo; retrieval trace backend truy vết được vì sao truy hồi trúng

### 7. Xưởng phái sinh truyện tranh và phim ngắn

- **Bàn làm việc truyện tranh**: nhất quán bối cảnh, tài sản hình ảnh nhân vật, kiểm soát mỏ neo hình ảnh; phân cảnh và bảng nhân vật hỗ trợ popup xác nhận khi sinh ảnh, tránh bấm nhầm tốn hạn mức
- **Pipeline sản xuất chuyển thể phim ngắn v3**: từ nội dung tiểu thuyết phái sinh kịch bản phim ngắn và cảnh quay
- Xưởng phái sinh chỉ mở sau khi chuỗi chính chạy thông — chúng tiêu thụ chương, nhân vật và bối cảnh đã sinh của tiểu thuyết

### 8. Trang giới thiệu công khai và hệ thống tài liệu

- **Trang giới thiệu** GitHub Pages (cổng 4173) hiển thị chuỗi chính, ảnh chụp sản phẩm, lối vào tài liệu và link tải
- Trang tài liệu có tìm kiếm toàn văn cục bộ, breadcrumb, mục lục trong bài, điều hướng bài trước / sau, khối gợi ý tip / warn / checkpoint, bảng GFM
- 33 bài tài liệu công khai: giới thiệu dự án, cài đặt và chuẩn bị, FAQ, khắc phục sự cố, lộ trình thực hành cuốn tiểu thuyết đầu tiên, sổ tay khôi phục theo giai đoạn, chuỗi sản xuất đầu cuối, toàn cảnh giai đoạn Đạo diễn AI, chuỗi thực thi chương, chuỗi truy hồi tri thức & RAG + mô tả mô-đun
- Tài liệu mô-đun kèm ảnh chụp sản phẩm thật; tên giai đoạn Đạo diễn AI dùng tiếng Trung, bảng đối chiếu tên kỹ thuật giữ ở cuối bài toàn cảnh để nhà phát triển tra cứu

### 9. Route model và chạy cục bộ

- Hỗ trợ OpenAI, DeepSeek, SiliconFlow, xAI... nhiều nhà cung cấp; lập kế hoạch, nội dung, hiệu đính, phân tích sách... có thể route tách theo từng nhiệm vụ
- SQLite mặc định là đủ chạy chuỗi chính; cần truy hồi RAG mới nối Qdrant
- Số concurrency RAG, giới hạn tốc độ... chuyển từ `.env` sang bảng cài đặt, sửa xong có hiệu lực ngay không cần khởi động lại
- Monorepo (pnpm workspace), desktop / trang giới thiệu / server / client xây dựng độc lập

## Lộ trình sử dụng điển hình

1. Ở trang tạo tiểu thuyết nhập một câu ý tưởng, để AI Đạo diễn đưa ra các ứng viên hướng đi trọn cuốn.
2. Vào `Thiết lập dự án`, chốt đề tài, điểm bán, cảm nhận độc giả mục tiêu và cam kết 30 chương đầu.
3. Dùng `Kế hoạch tổng thể câu chuyện`, `Thế giới cuốn sách` và `Chuẩn bị nhân vật` bổ sung mạch chính trọn cuốn, ranh giới sân khấu và mạng nhân vật đến mức viết được.
4. Vào `Chiến lược tập / khung tập` quyết định chia tập, rồi đến `Nhịp / phân chương` đưa tập hiện tại xuống danh sách chương và chi tiết hóa từng chương.
5. Tùy nhu cầu gắn kết kết quả phân tích sách, tài liệu kho tri thức và tài sản cách viết, để nội dung về sau không chỉ dựa vào prompt một lần.
6. Vào `Thực thi chương` viết từng chương, kiểm toán, sửa chữa; khi cần quay lại bàn làm việc tập để tái cân bằng và lập lại kế hoạch.
7. Muốn đẩy nhanh thì khởi động tác vụ sản xuất trọn cuốn, theo dõi trạng thái, nguyên nhân lỗi và kết quả cập nhật ngược.

## Sơ đồ hỗ trợ năng lực sinh truyện dài hiện tại

![Sơ đồ hỗ trợ năng lực sinh truyện dài](./images/流程图.svg?v=1)

- Mở sách chốt bài chịu trách nhiệm nói rõ "cuốn này muốn viết thành cái gì" trước, tránh càng viết càng loãng.
- Tầng điều khiển trọn cuốn và tầng kế hoạch cấp tập chịu trách nhiệm tách truyện dài thành cấu trúc đẩy được, xem lại được, điều chỉnh được, thay vì viết chết một lần.
- Nhân vật, thế giới quan, cách viết, kho tri thức và kiểm soát chất lượng cùng đỡ việc sinh từng chương, để mỗi chương vẫn nằm trong cùng một cuốn sách.
- Mỗi khi viết xong một chương, hệ thống cập nhật ngược trạng thái mới, tiếp tục ảnh hưởng các chương sau, nhịp cấp tập và việc lập lại kế hoạch khi cần.

## Cập nhật mới nhất

### 2026-08-26

- Radar đề tài nóng phân biệt đề tài đã có trong kho và đề tài cần bổ sung cùng cách đẩy: nội dung có sẵn định vị trực tiếp, hướng thiếu mới ghi vào kho sau khi xác nhận; mở sách từ radar sẽ điền sẵn các nền tảng sáng tác này, đồng thời giữ lựa chọn thủ công của người dùng.
- Khi hiệu đính chương thủ công cần điều chỉnh kế hoạch sau, sẽ giữ nội dung và chờ người dùng xác nhận, không âm thầm lập lại kế hoạch giữa quá trình hiệu đính.
- Kết luận hiệu đính, vấn đề chờ xử lý và tiến độ chương lưu chung thành trạng thái khôi phục được, refresh trang vẫn thấy nguyên nhân xử lý thật.
- Sáng tác tự động trọn cuốn giữ nội dung dùng được, ghi vấn đề chất lượng cục bộ và tiếp tục; ưu tiên chất lượng có thể dừng ở ranh giới đã lưu khi sáng tác thủ công theo giai đoạn, chờ xác nhận.
- Nội dung không xác nhận lưu được thì không tự động sinh lặp; khi tác vụ nền tự khôi phục thất bại sẽ giữ lối vào khôi phục và tiếp tục từ chương chưa xong.

Toàn bộ lịch sử cập nhật xem [docs/releases/release-notes.md](./docs/releases/release-notes.md).

## Xem trước tính năng

### Trên 95% nội dung trong phần tổng quan tính năng do AI viết

Bộ ảnh chụp dưới đây ưu tiên trình bày quy trình một cuốn sách đang được dùng ở phiên bản hiện tại: từ Đạo diễn AI mở sách, đến thiết lập dự án, kế hoạch tổng thể câu chuyện, chuẩn bị nhân vật, chiến lược tập, nhịp phân chương, thực thi chương, rồi sửa chất lượng — đã thu thành một chuỗi đẩy liên tục, không phải một nhóm trang demo rời rạc.

### Trình biên tập prompt

Trình biên tập prompt dùng để debug và bảo trì tài sản prompt của các tác vụ AI cấp sản phẩm. Prompt sinh nội dung hỗ trợ chỉnh sửa template nâng cao trong phạm vi cuốn sách, có thể dùng thẻ tham chiếu trực quan để chèn hợp đồng cấp sách, nhiệm vụ chương, sự kiện nhân vật, dòng thời gian, biến runtime và quy tắc slot, đồng thời xem trước kiểm tra messages cuối và kết quả tiêm ngữ cảnh; khi cần kiểm chứng hiệu quả cũng có thể chọn model để test trực tiếp bản nháp hiện tại.

![Trình biên tập prompt](./images/ScreenShot_2026-07-08_140153_328.png)

### Creative Hub

Trung tâm sáng tác thống nhất đảm nhiệm hội thoại, lập kế hoạch, thực thi công cụ và đẩy tiến độ sáng tác.

![Trung tâm sáng tác](./images/创作中枢.png)

### Bàn tiếp tục viết ở trang chủ

Trang chủ tổ chức lối vào viết tiếp quanh cuốn tiểu thuyết hiện tại, tiến độ thật và bước tiếp theo được gợi ý, để người dùng lần đầu cũng nhanh chóng biết bây giờ nên làm gì.

![Bàn tiếp tục viết trang chủ](./images/v2/微信截图_20260813215131.png)

### Chế độ Đạo diễn AI

Trang tạo Đạo diễn AI gom một câu ý tưởng, tham số khởi đầu đạo diễn, framing cấp sách, cài đặt model và cách chạy vào cùng một bảng; sau khi vào chọn hướng, không chỉ đưa hai bộ phương án trọn cuốn mà còn kèm nhóm tùy chọn tên sách, lý do gợi ý và lối vào làm lại định hướng — phù hợp để chốt "cuốn này nên mở kiểu gì".

![Tạo Đạo diễn AI](./images/导演模式-创建.png)

![Đạo diễn AI chọn hướng](./images/导演模式-选择方向.png)

![Đạo diễn AI đang chạy](./images/导演模式-创建中.png)

![Đạo diễn AI bàn giao và tiếp tục](./images/导演模式-编辑.png)

### Thiết lập dự án

Thiết lập dự án đã gắn vào quy trình liên tục của bàn làm việc một cuốn: bên trái thấy trực tiếp bước hiện tại và tiến độ tổng thể, phía trên thấy trạng thái AI tiếp quản, vùng nội dung tập trung xử lý tiêu đề, giới thiệu, framing cấp sách, xác nhận cách viết và ranh giới thế giới cuốn sách thực sự dùng.

![Thiết lập dự án](./images/write/项目设定.png)

### Kế hoạch tổng thể câu chuyện

Kế hoạch tổng thể câu chuyện không còn chỉ là bản tóm tắt dài, mà trước tiên nén động cơ câu chuyện, tóm tắt đẩy & hiện thực hóa, đối lập dài hạn và cam kết 30 chương đầu thành tầng dẫn dắt cấp sách kế thừa được, đảm bảo mạch chính trọn cuốn đẩy được, rồi mới xây kế hoạch cấp tập và cấp chương trên nền này.

![Kế hoạch tổng thể câu chuyện](./images/write/故事宏观规划.png)

### Chuẩn bị nhân vật

Trang chuẩn bị nhân vật giờ giống bàn làm việc nhân vật hơn là form nhân vật: trước tiên rà soát nhân vật chủ chốt của đoạn mục tiêu, rồi đưa phương án đội hình AI, mạng quan hệ cấu trúc và hệ nhân vật động, giảm tình trạng đứt đoạn nhân vật sau khi mở sách, thiếu vị trí chức năng và trì trệ đẩy quan hệ.

![Chuẩn bị nhân vật](./images/write/角色准备.png)

### Chiến lược tập / khung tập

Giai đoạn chiến lược tập bắt đầu phân biệt rõ mức hoàn thành của bốn giai đoạn "chiến lược tập, khung tập, bảng nhịp, phân chương". Hệ thống trước tiên phán đoán hiện tại đã đủ điều kiện đẩy tiếp chưa, rồi sinh gợi ý chiến lược tập, xét duyệt khung tập, và gom kiểm soát phiên bản với phân tích ảnh hưởng vào cùng một trang.

![Chiến lược tập / khung tập](./images/write/卷战略.png)

### Nhịp / phân chương

Nhịp / phân chương giờ đưa danh sách đoạn nhịp, chi tiết hóa hàng loạt, tiêu đề chương, tóm tắt, mục tiêu chương và phiếu nhiệm vụ vào cùng một khu làm việc; có thể chi tiết hóa liên tục theo chương đang thấy hoặc phạm vi chỉ định, cũng có thể sửa cục bộ bằng AI với tóm tắt và mục tiêu — phù hợp đẩy liên tục kiểu truyện đăng nhiều kỳ.

![Nhịp / phân chương](./images/write/节奏拆章.png)

### Thực thi chương

Trang thực thi chương giờ giống bàn làm việc viết chính: bên trái là thẻ chương và trạng thái bước tiếp theo, giữa là nội dung đã lưu và vùng phiên bản, bên phải gom kế hoạch thực thi, viết nội dung, hiệu đính, sửa chữa, đồng bộ trạng thái và điềm báo vào cùng một bộ bảng hành động — phù hợp đẩy từng chương.

![Thực thi chương](./images/write/章节执行.png)

### Sửa chất lượng

Sửa chất lượng đã từ những nút rời rạc thu thành bàn làm việc độc lập: có thể quanh chương hiện tại thực thi hiệu đính, thực thi sửa, sinh hook, kết hợp lô hiện tại, ngưỡng chất lượng và đầu ra AI để xử lý tiếp — phù hợp đưa "sau khi viết xong thì giữ chất lượng thế nào" vào quy trình chính.

![Sửa chất lượng](./images/write/质量修复.png)

### Sửa nội dung

Khi một chương đã có nội dung, có thể vào trình biên tập nội dung độc lập để viết lại từng phần. Trang sửa nội dung giữ phiếu nhiệm vụ, kết quả kiểm toán và chuỗi sửa chữa gắn với chương này, tránh người dùng đứt ngữ cảnh giữa "khu viết chính" và "khu tinh chỉnh".

![Sửa nội dung](./images/正文修改.jpeg)

### Danh sách tiểu thuyết

Từ đây vào mở sách, quản lý, chỉnh sửa và sản xuất trọn cuốn.

![Danh sách tiểu thuyết](./images/v2/微信截图_20260813220328.png)

### Phân tích sách

Phân tích sách không còn chỉ sinh một bài cảm nhận: tùy chọn ba cấp phân tích nhanh / tiêu chuẩn / đầy đủ, phủ định vị đề tài, cấu trúc cốt truyện, hệ nhân vật, thiết lập thế giới và kỹ thuật cách viết; hồ sơ nhân vật hỗ trợ bốn cấp độ sâu tóm tắt / tiêu chuẩn / chuyên sâu / đầy đủ, còn có thể quét tăng dần tiến hóa hình tượng theo mức phủ 25% / 50% / 75% / 100%, sinh ảnh tham chiếu nhất quán xuyên chương. Kết luận phân tích sách có thể xuất thẳng vào kho tri thức, một chạm chuyển thành tài sản cách viết, hoặc thăng cấp nhân vật vào thư viện nhân vật cơ bản — biến "phân tích một cuốn sách" thành tài sản dài hạn gọi lại được trong sáng tác sau, thay vì ghi chú một lần xem xong quên.

![Phân tích sách](./images/v2/微信截图_20260813220038.png)

Trang kết quả phân tích sách sắp xếp cấu trúc tác phẩm, nhân vật và kinh nghiệm sáng tác thành tài sản phân tích tái sử dụng được.

### Kho tri thức

Quản lý thống nhất tài liệu, chỉ mục, tác vụ tái tạo và năng lực truy hồi.

![Kho tri thức](./images/知识库.png)

### Thế giới quan

Thế giới quan không còn chỉ là văn bản mô tả, mà có thể sinh khung thế giới, bảo trì sổ tay thế giới và gắn làm ngữ cảnh thế giới cuốn sách riêng của từng tiểu thuyết.

![Thư viện mẫu thế giới](./images/v2/微信截图_20260813220219.png)
![Sổ tay thế giới và trực quan hóa](./images/v2/微信截图_20260813220255.png)

### Thư viện nhân vật

Duy trì thống nhất hồ sơ nhân vật cơ bản và thông tin nhân vật trong tiểu thuyết.

![Thư viện nhân vật](./images/角色库.png)

### Quản lý thể loại

Tập trung bảo trì tài sản đề tài và thể loại, để lập kế hoạch câu chuyện, chuẩn bị nhân vật và sinh nội dung dùng chung một hệ ngôn ngữ đề tài.

![Thư viện nền tảng đề tài](./images/v2/微信截图_20260813220110.png)

### Quản lý trường phái

Thu mô hình đẩy truyện, cách hiện thực hóa và ranh giới xung đột thành tài sản trường phái tái sử dụng được, giúp cả cuốn sách dễ giữ đúng kỳ vọng độc giả.

![Thư viện mô hình đẩy truyện](./images/v2/微信截图_20260813220114.png)

### Xưởng tiêu đề

Sinh hàng loạt, lọc và tinh chỉnh tiêu đề sách cùng hướng tên, giảm chi phí thử sai ở giai đoạn đặt tên cho người mới.

![Xưởng tiêu đề](./images/v2/微信截图_20260813220147.png)

### Công cụ cách viết và quy tắc chống AI

Quản lý thống nhất tài sản cách viết, ràng buộc phong cách và quy tắc chống AI, để nội dung giống tác phẩm hơn, không phải văn bản bổ sung theo khuôn mẫu.

![Công cụ cách viết](./images/v2/微信截图_20260813220303.png)
![Quy tắc chống AI](./images/v2/微信截图_20260813220310.png)

### Trung tâm nhiệm vụ

Xem trạng thái xếp hàng, thực thi và thất bại của phân tích sách, tái tạo kho tri thức và các tác vụ nền khác.

![Trung tâm nhiệm vụ](./images/任务中心.png)

### Cấu hình model

Cấu hình model khác nhau cho từng năng lực, giảm chi phí một bộ model chịu hết mọi tác vụ.

![Cấu hình model](./images/模型配置.png)

## Bắt đầu nhanh

### Yêu cầu môi trường

- Node.js `^20.19.0 || ^22.12.0 || >=24.0.0`
  Khuyến nghị dùng `20.19.x LTS`
- pnpm `>= 10.6`
  Khuyến nghị dùng `pnpm@10.6.0` như repo khai báo
- Ít nhất một bộ LLM API Key dùng được
  Cũng có thể chạy dự án trước, rồi cấu hình trong trang
- Nếu muốn trải nghiệm đầy đủ kho tri thức / RAG, chuẩn bị thêm Qdrant dùng được

### 1. Cài đặt phụ thuộc

```bash
pnpm install
```

`pnpm install` mặc định giờ chỉ chuẩn bị phụ thuộc phát triển Web / Server, không ép tải runtime Electron desktop ở lần cài đầu.

- Nếu chỉ chạy luồng phát triển Web / Server hiện có, đến đây là đủ
- Nếu muốn khởi động shell phát triển desktop, lần đầu chạy `pnpm dev:desktop` sẽ tự kéo runtime Electron
- Muốn làm sớm bước này cũng có thể chạy thủ công:

```bash
pnpm run prepare:desktop-runtime
```

Lần đầu tải runtime desktop cần môi trường mạng truy cập được nguồn phân phối Electron; nếu mạng của bạn không vào được GitHub Releases, nên cấu hình proxy hoặc mirror trước khi chạy lệnh desktop.

Nếu trên Windows chạy `pnpm install` kẹt ở `prisma preinstall`, thường kiểm tra hai loại vấn đề:

1. Phiên bản Node quá thấp
   Prisma 7 hiện yêu cầu Node `^20.19.0 || ^22.12.0 || >=24.0.0`. Nếu bạn đang ở `20.0 ~ 20.18`, nên nâng lên `20.19.x LTS` rồi cài lại.
2. `script-shell` bị cấu hình thành shell tương tác
   Nếu `npm/pnpm script-shell` toàn cục bị đặt dạng `cmd.exe /k` giữ lại dấu nhắc, lifecycle script của Prisma có thể không tự thoát, trông như cài "kẹt" ở:
   `node_modules/.../prisma>`

Có thể chạy mấy lệnh sau để tự kiểm tra:

```bash
node -v
pnpm config get script-shell
npm config get script-shell
```

Nếu `script-shell` trả về `cmd.exe` có `/k`, nên xóa cấu hình này rồi mở lại terminal:

```bash
npm config delete script-shell
pnpm config delete script-shell
```

Rồi chạy lại:

```bash
pnpm install
```

### 2. Cấu hình biến môi trường

Repo này dùng pnpm workspace khởi động riêng frontend/backend, nên biến môi trường cũng đọc theo từng sub-package:

- Server chạy trong thư mục làm việc `server/`, mặc định đọc `server/.env`
- Frontend chạy trong thư mục làm việc `client/`, mặc định đọc `client/.env` / `client/.env.local`
- `.env.example` ở gốc phù hợp làm "tham khảo tổng quan", không phải lối vào chính mà `pnpm dev` đọc mặc định

#### 2.1 Biến môi trường server

Đầu tiên copy file mẫu của server:

```bash
# macOS / Linux
cp server/.env.example server/.env

# Windows PowerShell
Copy-Item server/.env.example server/.env
```

Tối thiểu nên xác nhận các mục sau:

- `DATABASE_URL`
  Mặc định là SQLite cục bộ, dùng trực tiếp được
- `RAG_ENABLED`
  Nếu tạm thời chưa nối kho tri thức, nên đặt `false`
- `QDRANT_URL`、`QDRANT_API_KEY`
  Chỉ cần khi bật Qdrant / RAG

Lưu ý:

- Các biến `OPENAI_API_KEY`、`DEEPSEEK_API_KEY`、`SILICONFLOW_API_KEY` có thể để trống
- Sau khi dự án khởi động, cũng có thể cấu hình nhà cung cấp model và model mặc định trong trang

#### 2.2 Biến môi trường frontend

Đa số tình huống phát triển cục bộ không cần tạo riêng env cho frontend.

Vì ở chế độ phát triển, frontend mặc định trỏ API tới:

```text
http(s)://hostname của trang hiện tại:3000/api
```

Bao gồm cả tình huống "cùng máy khởi động server, rồi dùng IP mạng LAN truy cập từ thiết bị khác".
Ví dụ trang mở ở `http://192.168.0.37:5173`, frontend mặc định tự trỏ API tới:

```text
http://192.168.0.37:3000/api
```

Chỉ trong các tình huống sau mới nên tạo `client/.env`:

- Frontend và backend không cùng một máy
- Muốn trỏ frontend tới địa chỉ API khác một cách tường minh
- Cần cố định `VITE_API_BASE_URL`

Nếu bạn đã copy `client/.env.example` mà phát hiện mọi request trình duyệt đều chạy tới `http://localhost:3000/api`, thường là vì bạn đã cố định cứng API. Với truy cập cùng máy / mạng LAN, nên xóa hoặc comment dòng `VITE_API_BASE_URL`.

Ví dụ:

```bash
# macOS / Linux
cp client/.env.example client/.env

# Windows PowerShell
Copy-Item client/.env.example client/.env
```

Nội dung thường chỉ cần:

```env
# Truy cập cùng máy / mạng LAN thường không cần dòng này
# VITE_API_BASE_URL=http://localhost:3000/api
```

#### 2.3 Nhà cung cấp model không nhất thiết phải viết chết trong env

Dự án hiện tại đã hỗ trợ cấu hình các thiết lập liên quan model ngay trong trang:

- `/settings`
  Cấu hình API Key nhà cung cấp, model mặc định, test kết nối
- `/settings/model-routes`
  Gán provider / model khác nhau cho từng nhiệm vụ
- `/knowledge?tab=settings`
  Cấu hình Embedding provider, Embedding model, đặt tên collection và chiến lược tự tái tạo

Nên các biến `OPENAI_MODEL`、`DEEPSEEK_MODEL`、`EMBEDDING_MODEL` trong env phù hợp dùng làm:

- Giá trị mặc định khi khởi động
- Giá trị fallback khi database chưa lưu thiết lập

### 3. Khởi động môi trường phát triển

```bash
pnpm dev
```

Nếu bạn đã copy xong `server/.env` và `client/.env`, mặc định chạy đúng một lệnh này.
Không cần thủ công chạy `prisma generate`、`prisma db push` hoặc `pnpm db:migrate` trước lần khởi động đầu.

Mặc định:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- API: `http://localhost:3000/api`

Lần đầu khởi động server sẽ tự chạy Prisma generate và `db push`.
Chỉ khi bạn tự sửa Prisma schema, hoặc cần xử lý quy trình migration chính thức, mới cần thủ công dùng lệnh Prisma / database.

Sau lần khởi động đầu, nên làm mấy bước:

1. Mở `http://localhost:5173/settings`, cấu hình ít nhất một bộ API Key model dùng được
2. Mở `http://localhost:5173/settings/model-routes`, kiểm tra route model thực tế của từng nhiệm vụ
3. Muốn bật kho tri thức thì mở `http://localhost:5173/knowledge?tab=settings`, lưu thiết lập Embedding / Collection

### 4. Nếu dùng Qdrant Cloud

Nếu chỉ muốn trải nghiệm quy trình chính, có thể bỏ qua Qdrant, đặt thẳng trong `server/.env`:

```env
RAG_ENABLED=false
```

Muốn bật Qdrant Cloud, làm theo quy trình tối thiểu:

1. Đăng ký tài khoản tại [Qdrant Cloud](https://cloud.qdrant.io/).
2. Tạo một cluster ở trang `Clusters`.
   Giai đoạn test dùng Free cluster là đủ.
3. Sau khi tạo cluster xong, vào trang chi tiết cluster copy Cluster URL.
4. Trong `API Keys` của trang chi tiết cluster, tạo và copy một Database API Key.
   Key này thường chỉ hiển thị một lần sau khi tạo, nên lưu ngay.
5. Ghi chúng vào `server/.env`:

```env
QDRANT_URL=https://your-cluster.region.cloud.qdrant.io:6333
QDRANT_API_KEY=your_database_api_key
```

6. Sau khi khởi động dự án, vào trang `Kho tri thức -> Cài đặt vector` chọn Embedding provider / model, và lưu thiết lập collection.

Với dự án này, `QDRANT_URL` nên điền địa chỉ REST, tức địa chỉ có `:6333`.

Muốn thủ công kiểm tra kết nối, dùng:

```bash
curl -X GET "https://your-cluster.region.cloud.qdrant.io:6333" \
  --header "api-key: your_database_api_key"
```

Cũng có thể nối thêm `:6333/dashboard` vào địa chỉ cluster để mở Qdrant Web UI.

Tài liệu chính thức Qdrant:

- [Create a Cluster](https://qdrant.tech/documentation/cloud/create-cluster/)
- [Database Authentication in Qdrant Managed Cloud](https://qdrant.tech/documentation/cloud/authentication/)
- [Cloud Quickstart](https://qdrant.tech/documentation/cloud/quickstart-cloud/)

### 5. Khởi tạo tùy chọn

Những lệnh sau đều không phải bước tiền đề cho lần đầu chạy `pnpm dev`:

```bash
pnpm db:seed
pnpm db:studio
```

## Lệnh thường dùng

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
# Chỉ dùng thủ công khi bạn phát triển/điều chỉnh Prisma schema
pnpm db:migrate
pnpm db:seed
pnpm db:studio
pnpm --filter @ai-novel/server test
pnpm --filter @ai-novel/server test:routes
pnpm --filter @ai-novel/server test:book-analysis
```

## Công nghệ và kiến trúc

### Công nghệ

| Tầng | Công nghệ |
| --- | --- |
| Frontend | React 19、Vite、React Router、TanStack Query、Plate |
| Backend | Express 5、Prisma、Zod |
| Điều phối AI | LangChain、LangGraph |
| Database | SQLite |
| RAG | Qdrant |
| Hình thái | pnpm workspace Monorepo |

### Cấu trúc Monorepo

```text
client/   Frontend React + Vite
server/   Express + Prisma + Agent Runtime + Creative Hub
shared/   Type và protocol dùng chung frontend/backend
images/   Ảnh chụp preview README và sản phẩm
scripts/  Script khởi động và hỗ trợ
docs/     Tài liệu thiết kế, checkpoint giai đoạn, kế hoạch mô-đun và lưu trữ lịch sử
```

Phân vùng tài liệu chi tiết hơn xem [docs/README.md](./docs/README.md).

### Trọng tâm hệ thống hiện tại

- `Creative Hub` đảm nhiệm trung tâm sáng tác thống nhất và trải nghiệm Agent runtime
- `Novel Setup / Director` đảm nhiệm từ một câu ý tưởng đến cả cuốn có thể viết
- `Novel Production` đảm nhiệm chuỗi chính sinh trọn cuốn
- `Style Engine` đảm nhiệm tài sản cách viết, trích đặc trưng, gắn kết và phối hợp chống AI
- `Knowledge / Book Analysis / World` đảm nhiệm lắng đọng và cập nhật ngược ngữ cảnh dài hạn

## Lộ trình hiện tại

Việc quan trọng nhất hiện tại không phải tiếp tục chất thêm tính năng rời rạc, mà nâng tỷ lệ "người mới viết xong cả cuốn sách".

### P0

- Ổn định Đạo diễn AI thực thi liên tục, giảm dừng chuỗi nhầm, hiệu đính lặp và tiêu thụ token bất thường
- Để thế giới cuốn sách, nhân vật, điềm báo, dòng thời gian và nhiệm vụ chương ổn định đi vào ngữ cảnh viết tiếp
- Giảm chi phí phán đoán và chi phí sửa chữa từ một câu ý tưởng đến viết liên tục được cho người mới

### P1

- Nâng chất lượng nhất quán trọn cuốn, ổn định nhịp, tăng trưởng nhân vật và kế thừa trạng thái thế giới
- Để tài sản cách viết, ràng buộc thế giới, lập lại kế hoạch chương, phản hồi đánh giá và nợ chất lượng thành vòng khép kín
- Để hệ thống giỏi hơn "liên tục nắm cả cuốn sách", không chỉ "sinh ra một chương"

### P2

- Tiếp tục tăng cường phối hợp Agent đa giai đoạn và khả năng quan sát runtime
- Hoàn thiện điều phối sản xuất tự động hơn, chiến lược khôi phục, trí nhớ lượt và kiểm soát chất lượng trọn cuốn

## Phản hồi và trao đổi

Nếu bạn muốn phản hồi vấn đề, trao đổi trải nghiệm sử dụng, hoặc thảo luận về Đạo diễn AI, chuỗi sản xuất trọn cuốn, công cụ cách viết..., có thể quét mã QR vào nhóm QQ của upstream.

![Mã QR nhóm QQ](./images/群2.png)

> 🇻🇳 Người dùng Việt Nam: vui lòng mở Issue / PR trực tiếp trên repo fork
> [markbui123/Viet-AI-Novel-Writing-Assistant](https://github.com/markbui123/Viet-AI-Novel-Writing-Assistant).

## Ủng hộ dự án

Nếu dự án này hữu ích với bạn, chào mừng quét mã Alipay để ủng hộ phát triển và bảo trì liên tục.

<p align="center">
  <img src="./images/c838dd8eb412d6fde536b2a43f53e95.jpg" alt="Mã QR ủng hộ Alipay" width="320" />
</p>

## Cách đóng góp

Nếu muốn tham gia dự án này, các hướng đóng góp giá trị nhất:

- Nâng cao ổn định sản xuất trọn cuốn
- Cải thiện trải nghiệm mở sách cho người mới và tỷ lệ thành công Đạo diễn AI
- Tăng cường công cụ cách viết, cập nhật ngược kho tri thức và chuỗi nhất quán thế giới quan
- Bổ sung test, phát lại lỗi và khả năng quan sát runtime

Chào mừng mở Issue hoặc Pull Request trực tiếp.
Gửi Pull Request đồng nghĩa bạn xác nhận có quyền gửi nội dung đó, và đã đọc đồng ý [CLA.md](./CLA.md); nếu chứa mã bên thứ ba, tài liệu, nội dung do AI sinh hoặc nội dung chịu ràng buộc giấy phép khác, hãy nêu rõ nguồn và giấy phép trong PR. Xem [CONTRIBUTING.md](./CONTRIBUTING.md).

## Cảm ơn

Cảm ơn contributor đã gửi Pull Request sửa lỗi [@ystyleb](https://github.com/ystyleb).

## Ghi chú

- Đây là hệ thống sáng tạo AI Native đang lặp nhanh liên tục, ranh giới tính năng vẫn đang tiến hóa.
- README ưu tiên mô tả năng lực đáng trải nghiệm nhất, đại diện cho hướng đi hiện tại, thay vì liệt kê toàn bộ chi tiết triển khai lịch sử.
- Nếu quan tâm mục tiêu giai đoạn, ưu tiên và kế hoạch tối ưu sau, xem thẳng [TASK.md](./TASK.md).

## Giấy phép

Dự án này dùng chế độ cấp phép song song:

- Mặc định, dự án được cấp phép theo GNU Affero General Public License v3.0 (AGPLv3), xem [LICENSE](./LICENSE); quyền sở hữu và ghi chú bổ sung xem [NOTICE](./NOTICE).
- Thương mại dịch vụ: dùng dự án này (hoặc bản sửa đổi) làm backend cung cấp cho bên thứ ba dưới dạng SaaS, lưu trữ hoặc hình thức khác, phải lấy giấy phép thương mại từ tác giả.
- Hãy tuân thủ điều khoản mã nguồn mở và lấy giấy phép tương ứng trong tình huống áp dụng.

Ghi chú đóng góp: đóng góp mới mặc định theo [CLA.md](./CLA.md), có thể phân phối theo AGPL-3.0-only cùng dự án, và có thể được đưa vào giấy phép thương mại riêng do người bảo trì cung cấp; xem [CONTRIBUTING.md](./CONTRIBUTING.md).

## Liên kết

- [LINUX DO](https://linux.do/)
