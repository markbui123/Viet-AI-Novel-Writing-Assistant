/**
 * vi-output-directive — Chỉ thị ngôn ngữ đầu ra cho MỌI prompt (fork-owned).
 *
 * Prompt gốc (115 file, tiếng Trung) KHÔNG bị sửa — chỉ thị này được chèn vào
 * system message ngay trước khi gửi LLM (qua promptRunner), yêu cầu model viết
 * MỌI nội dung bằng tiếng Việt, giữ nguyên schema/cấu trúc JSON.
 *
 * Chèn tại 2 điểm (xem promptRunner.ts + templateRuntime.ts):
 *  1. preparePromptExecution → messages mặc định (structured/text/stream)
 *  2. resolveAdvancedPromptMessages → messages từ custom template (nếu có)
 *
 * Idempotent: có marker là bỏ qua (tránh trùng khi retry/repair).
 */
import { SystemMessage, type BaseMessage } from "@langchain/core/messages";

const MARKER = "[Quy tắc ngôn ngữ đầu ra]";
const HAN_LANG_RE = /简体中文|中文网文|中文商业网文/;

export const VI_OUTPUT_DIRECTIVE = `${MARKER}
- Quy tắc này là TỐI THƯỢNG, có hiệu lực với TOÀN BỘ phản hồi — bất kể prompt phía trên yêu cầu ngôn ngữ nào (kể cả khi prompt gốc viết bằng tiếng Trung và có yêu cầu \"dùng tiếng Trung\").
- MỌI văn xuôi, phân tích, kế hoạch, đánh giá, đề xuất, tóm tắt, đối thoại nhân vật và nội dung sáng tạo PHẢI viết bằng tiếng Việt tự nhiên, trôi chảy.
- TUYỆT ĐỐI KHÔNG được viết tiếng Trung trong bất kỳ phần nội dung nào.
- Giữ NGUYÊN key JSON, tên trường, mã enum/trạng thái và cấu trúc dữ liệu theo đúng schema trong prompt.
- Giữ nguyên tên riêng, tên nhân vật, thương hiệu và thuật ngữ kỹ thuật (API, JSON, token, prompt...).
- Không thêm giải thích ngoài nội dung được yêu cầu.`;

export function applyViOutputDirective(messages: BaseMessage[]): BaseMessage[] {
  // BƯỚC 1: vô hiệu hóa yêu cầu "dùng tiếng Trung" trong MỌI message —
  // model nghe theo yêu cầu ngôn ngữ CỤ THỂ trong prompt ("所有内容必须使用
  // 简体中文") hơn là chỉ thị ở cuối. Thay trực tiếp vào text prompt.
  const neutralized = messages.map((m) => {
    if (typeof m.content === "string" && HAN_LANG_RE.test(m.content)) {
      const next = { ...m } as BaseMessage;
      next.content = m.content
        .replaceAll("简体中文", "tiếng Việt")
        .replaceAll("中文商业网文", "商业网文")
        .replaceAll("中文网文", "网文");
      return next;
    }
    return m;
  });

  if (neutralized.some((m) => typeof m.content === "string" && m.content.includes(MARKER))) {
    return neutralized;
  }
  // BƯỚC 2: chèn chỉ thị — prepend vào system message đầu tiên (đọc TRƯỚC
  // prompt Trung dài)
  const idx = neutralized.findIndex((m) => m._getType() === "system");
  if (idx >= 0) {
    const first = neutralized[idx];
    if (typeof first.content === "string") {
      const next = [...neutralized];
      next[idx] = new SystemMessage(`${VI_OUTPUT_DIRECTIVE}\n\n${first.content}`);
      return next;
    }
  }
  return [new SystemMessage(VI_OUTPUT_DIRECTIVE), ...neutralized];
}
