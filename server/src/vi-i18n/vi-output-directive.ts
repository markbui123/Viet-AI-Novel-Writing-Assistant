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

export const VI_OUTPUT_DIRECTIVE = `${MARKER}
- MỌI văn xuôi, phân tích, kế hoạch, đánh giá và đề xuất PHẢI viết bằng tiếng Việt tự nhiên.
- Giữ NGUYÊN key JSON, tên trường, mã enum/trạng thái và cấu trúc dữ liệu theo đúng schema trong prompt.
- Giữ nguyên tên riêng, tên nhân vật, thương hiệu và thuật ngữ kỹ thuật (API, JSON, token, prompt...).
- Không thêm giải thích ngoài nội dung được yêu cầu; nội dung chính không dùng tiếng Trung hay tiếng Anh trừ thuật ngữ chuyên môn.`;

export function applyViOutputDirective(messages: BaseMessage[]): BaseMessage[] {
  if (messages.some((m) => typeof m.content === "string" && m.content.includes(MARKER))) {
    return messages;
  }
  // Ưu tiên ghép vào system message đầu tiên (quyền lực cao nhất)
  const idx = messages.findIndex((m) => m._getType() === "system");
  if (idx >= 0) {
    const first = messages[idx];
    if (typeof first.content === "string") {
      const next = [...messages];
      next[idx] = new SystemMessage(`${first.content}\n\n${VI_OUTPUT_DIRECTIVE}`);
      return next;
    }
  }
  return [new SystemMessage(VI_OUTPUT_DIRECTIVE), ...messages];
}
