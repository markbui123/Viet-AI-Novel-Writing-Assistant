/**
 * vi-translate — Vite plugin (fork-owned, không thuộc upstream).
 *
 * Ý tưởng: mọi chuỗi UI tiếng Trung được hardcode trong source (~5.900 chuỗi,
 * 454 file). Thay vì sửa 454 file (sẽ conflict mỗi lần pull upstream), plugin
 * này thay chuỗi NGAY TẠI BUILD/DEV TIME bằng từ điển vi-dict.json.
 *
 * Thuật toán: khớp chuỗi con chính xác (split/join, không regex) theo thứ tự
 * key dài nhất trước, nên:
 *  - "自动导演写长篇" được dịch trước khi "创作" đụng vào nó
 *  - an toàn với mọi vị trí xuất hiện: JSX text, string literal, template `${}`,
 *    attribute — vì ta thay đúng đoạn chữ Trung bằng bản dịch tương ứng
 *  - code/logic giữ nguyên: chỉ chữ Trung bị thay
 *
 * Phạm vi hiện tại: apply "serve" (dev). Bật cho production build khi cần
 * (desktop app), bằng cách đổi thành apply: undefined + test bản build.
 */
import type { Plugin } from "vite";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";

const HAN_RE = /[\u4e00-\u9fff]/;
const DICT_PATH = path.resolve(process.cwd(), "vi-i18n", "vi-dict.json");

let dictCache: Record<string, string> | null = null;
let dictKeysSorted: string[] = [];
let dictCacheMtime = 0;
function loadDict(): Record<string, string> {
  const stat = (() => {
    try {
      return statSync(DICT_PATH).mtimeMs;
    } catch {
      return 0;
    }
  })();
  if (!dictCache || stat !== dictCacheMtime) {
    const parsed = JSON.parse(readFileSync(DICT_PATH, "utf8")) as Record<string, string>;
    dictCache = parsed;
    dictCacheMtime = stat;
    // key dài nhất trước — khớp ưu tiên dài trước; tính 1 lần, cache lại.
    // BỎ key không chứa chữ Trung (meta field như "_note" — nếu lọt sẽ khớp
    // substring ASCII trong code và VỠ build: "_note" nằm trong "supplement_notes")
    dictKeysSorted = Object.keys(parsed)
      .filter((k) => HAN_RE.test(k))
      .sort((a, b) => b.length - a.length);
  }
  return dictCache;
}

/** Trả về code đã dịch; trả về code gốc nếu không có gì để dịch. */
function translateCode(code: string): string {
  const dict = loadDict();
  const keys = dictKeysSorted.filter((k) => code.includes(k));
  if (keys.length === 0) {
    return code;
  }
  let out = code;
  for (const key of keys) {
    out = out.split(key).join(dict[key]);
  }
  return out;
}

export function viTranslatePlugin(): Plugin {
  return {
    name: "vi-translate",
    enforce: "pre",
    // áp dụng cho CẢ dev lẫn build (production/desktop) — bỏ apply:"serve"
    transform(code, id) {
      // Chỉ xử lý source JS/TS/JSX/TSX của chính client (không node_modules,
      // không file của lớp dịch — tránh tự dịch từ điển của mình)
      if (!/\.[jt]sx?$/.test(id)) return null;
      if (id.includes("node_modules") || id.includes("vi-i18n")) return null;
      if (!HAN_RE.test(code)) return null;

      const translated = translateCode(code);
      return translated === code ? null : translated;
    },
    // index.html đi qua hook riêng của Vite (không qua transform ở trên)
    transformIndexHtml(code: string) {
      if (!HAN_RE.test(code)) return undefined;
      const translated = translateCode(code);
      return translated === code ? undefined : translated;
    },
    // Sửa vi-dict.json → làm mới toàn bộ module + reload trang (workflow dịch nhanh)
    handleHotUpdate(ctx) {
      if (ctx.file.endsWith("vi-dict.json")) {
        try {
          ctx.server.moduleGraph.invalidateAll();
        } catch {
          // phiên bản Vite không hỗ trợ → bỏ qua, chỉ full-reload
        }
        ctx.server.ws.send({ type: "full-reload" });
        return [];
      }
      return undefined;
    },
  };
}
