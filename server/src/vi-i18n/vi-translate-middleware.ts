/**
 * vi-translate — Server middleware (fork-owned, không thuộc upstream).
 *
 * Bổ sung cho client shim: nhiều chuỗi UI đến từ SERVER qua API
 * (onboarding steps, genres, story modes, style templates...). Middleware này
 * đi sâu vào mọi JSON response và dịch chuỗi tiếng Trung sang tiếng Việt
 * bằng CHUNG một từ điển vi-dict.json với client — nên logic khớp chuỗi
 * giữa client/server vẫn nhất quán.
 *
 * LƯU Ý an toàn dữ liệu: chỉ dịch VALUE là chuỗi; KHÔNG đụng key object,
 * ID, enum ASCII. Nếu sau này có field dữ liệu round-trip (client gửi tên
 * đã dịch ngược lên server làm key lookup) thì phải whitelist path — bản
 * full sẽ xử lý; spike này chấp nhận.
 */
import type { NextFunction, Request, Response } from "express";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";

const DICT_PATH = path.resolve(process.cwd(), "..", "client", "vi-i18n", "vi-dict.json");
let dict: Record<string, string> = JSON.parse(readFileSync(DICT_PATH, "utf8"));
let dictKeysSorted: string[] = Object.keys(dict).sort((a, b) => b.length - a.length);
let dictMtime = statSync(DICT_PATH).mtimeMs;
const HAN_RE = /[\u4e00-\u9fff]/;

function reloadDictIfChanged(): void {
  try {
    const mtime = statSync(DICT_PATH).mtimeMs;
    if (mtime !== dictMtime) {
      dict = JSON.parse(readFileSync(DICT_PATH, "utf8"));
      // bỏ key không chứa chữ Trung (meta field — tránh khớp substring ASCII trong code)
      dictKeysSorted = Object.keys(dict)
        .filter((k) => HAN_RE.test(k))
        .sort((a, b) => b.length - a.length);
      dictMtime = mtime;
    }
  } catch {
    // giữ dict cũ nếu file tạm thời không đọc được
  }
}

function translate(s: string): string {
  reloadDictIfChanged();
  if (!HAN_RE.test(s)) return s;
  let out = s;
  for (const key of dictKeysSorted) {
    if (out.includes(key)) out = out.split(key).join(dict[key]);
  }
  return out;
}

function deepTranslate(value: unknown): unknown {
  if (typeof value === "string") return translate(value);
  if (Array.isArray(value)) return value.map(deepTranslate);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepTranslate(v);
    return out;
  }
  return value;
}

/**
 * SKIP nội dung truyện: nội dung chapter (body) là LLM-generated content —
 * nếu còn tiếng Trung (tạo trước directive) thì dịch bằng key con sẽ thành
 * word-salad ("Xóa者", "Cao频") — TỆ hơn chữ Trung nguyên bản. Các route
 * chapter trả nội dung truyện → bỏ qua dịch toàn bộ response.
 */
const STORY_CONTENT_RE = /\/api\/novels\/[^/]+\/(chapters|short-story)/;

export function viTranslateMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const originalJson = res.json.bind(res);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.json = (body: any) =>
      originalJson(STORY_CONTENT_RE.test(req.path) ? body : deepTranslate(body));
    next();
  };
}
