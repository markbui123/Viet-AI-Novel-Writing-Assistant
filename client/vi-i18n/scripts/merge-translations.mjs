#!/usr/bin/env node
/**
 * merge-translations.mjs — Gộp các batch đã dịch vào vi-dict.json + validate.
 *
 * Kiểm tra:
 *  - mọi key trong batch phải CHỨA chữ Trung (chống key bịa)
 *  - value không rỗng
 *  - placeholder ${...}: tập token ${x} trong value == tập token trong key
 *  - key đã có trong dict (bản cũ đã duyệt) → GIỮ bản cũ, báo conflict
 *
 * Cách chạy: node client/vi-i18n/scripts/merge-translations.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const BATCH_DIR = path.join(ROOT, "client", "vi-i18n", "translations", "batches");
const DICT_PATH = path.join(ROOT, "client", "vi-i18n", "vi-dict.json");

const HAN = /[\u4e00-\u9fff]/;
// placeholder check: đếm số ${...} (agent có thể dịch chuỗi fallback BÊN TRONG
// ${...} — "推进主线" → "đẩy mạch mạch chính" — nên so token nguyên vẹn là false
// positive; so SỐ LƯỢNG ${ là đủ để bắt lỗi rơi mất biến)
const PH_COUNT = (s) => (s.match(/\$\{/g) ?? []).length;

// CODE-FRAGMENT KEY: text segment (ngoài {} và ${}) chứa ký tự code (quote, backtick,
// ngoặc, toán tử...) → key khớp vào vị trí CODE thật trong file khác → VỠ BUILD
// (ví dụ key `0 ? `(${pendingCount}格)` : ""}`}` khớp vào nested template trong
// PanelsGridPanel.tsx). Từ chối key dạng này khi merge.
// CODE-FRAGMENT KEY → VỠ BUILD nếu lọt dict (khớp vào vị trí code thật).
// Heuristic đã kiểm chứng bằng các lần vỡ build thực tế:
//  - Quote/backtick (" ' `) ở depth 0: LUÔN nguy hiểm (vỡ string/template)
//  - Ngoặc/toán tử logic (( ) [ ] ; = < > | & !) chỉ nguy hiểm khi key có
//    NEWLINE THẬT (code fragment đa dòng). Key 1 dòng chứa [label] / ID= /
//    gpt-image-2 là UI text hợp lệ → GIỮ.
const CODE_MARKERS_HARD = /["'`]/;
const CODE_MARKERS_MULTILINE = /[()\[\];=<>|&!{}]/;
function isCodeFragmentKey(k) {
  let depth = 0;
  const hasRealNl = k.includes("\n");
  for (const ch of k) {
    if (ch === "{") depth++;
    else if (ch === "}") depth = Math.max(0, depth - 1);
    else if (depth === 0 && CODE_MARKERS_HARD.test(ch)) return true;
    else if (depth === 0 && hasRealNl && CODE_MARKERS_MULTILINE.test(ch)) return true;
  }
  return false;
}

// SANITIZE: value không được chứa ` " ' ngoài ${...} (vỡ cú pháp code khi shim
// thay thế trong string/template literal). Đổi thành ngoặc cong “ ” ‘ ’.
// NEWLINE: mirror theo KEY — key có newline THẬT (template đa dòng) → giữ newline
// thật; key dùng \n escape (trong "...") → value đổi newline thật thành \n.
function sanitizeValue(v, key) {
  const parts = [];
  let buf = "", i = 0;
  while (i < v.length) {
    if (v[i] === "{") {
      let j = i + 1, depth = 1;
      while (j < v.length && depth > 0) {
        if (v[j] === "{") depth++;
        else if (v[j] === "}") depth--;
        j++;
      }
      if (buf) { parts.push(["t", buf]); buf = ""; }
      parts.push(["e", v.slice(i, j)]);
      i = j;
    } else { buf += v[i]; i++; }
  }
  if (buf) parts.push(["t", buf]);
  const keyHasRealNl = key.includes("\n");
  return parts.map(([typ, seg]) => {
    if (typ === "e") return seg;
    let dq = true, sq = true, bt = true, out = "";
    for (const ch of seg) {
      if (ch === '"') { out += dq ? "“" : "”"; dq = !dq; }
      else if (ch === "'") { out += sq ? "‘" : "’"; sq = !sq; }
      else if (ch === "`") { out += bt ? "“" : "”"; bt = !bt; }
      else if (ch === "\n") out += keyHasRealNl ? "\n" : "\\n";
      else if (ch === "\r") out += keyHasRealNl ? "\r" : "\\r";
      else if (ch === "\t") out += keyHasRealNl ? "\t" : "\\t";
      else out += ch;
    }
    return out;
  }).join("");
}

const dict = existsSync(DICT_PATH) ? JSON.parse(readFileSync(DICT_PATH, "utf8")) : {};
let added = 0, conflicts = 0, skipped = 0, errors = [];

if (!existsSync(BATCH_DIR)) {
  console.error(`Không có thư mục batches: ${BATCH_DIR}`);
  process.exit(1);
}

const batchFiles = readdirSync(BATCH_DIR).filter((f) => f.endsWith(".json")).sort();
console.log(`Batch tìm thấy: ${batchFiles.length}`);
if (batchFiles.length === 0) process.exit(1);

for (const f of batchFiles) {
  const entries = JSON.parse(readFileSync(path.join(BATCH_DIR, f), "utf8"));
  for (const [zh, vi] of Object.entries(entries)) {
    if (!HAN.test(zh)) { errors.push(`${f}: key không chứa chữ Trung: ${JSON.stringify(zh)}`); continue; }
    if (typeof vi !== "string" || !vi.trim()) { errors.push(`${f}: value rỗng cho ${JSON.stringify(zh)}`); continue; }
    if (zh in dict) { conflicts++; continue; } // giữ bản cũ đã duyệt
    if (isCodeFragmentKey(zh)) { errors.push(`${f}: key là code fragment (bỏ qua): ${JSON.stringify(zh.slice(0, 60))}`); continue; }
    // placeholder: số lượng ${...} trong value phải bằng key (bắt lỗi rơi mất biến)
    if (PH_COUNT(zh) !== PH_COUNT(vi)) {
      errors.push(`${f}: số placeholder khác nhau (${PH_COUNT(zh)} vs ${PH_COUNT(vi)}) cho ${JSON.stringify(zh.slice(0, 50))}`); 
      continue;
    }
    dict[zh] = sanitizeValue(vi, zh);
    added++;
  }
}

// Ghi lại: sắp xếp theo độ dài giảm dần (khớp ưu tiên dài trước) + alphabet
const sorted = Object.fromEntries(
  Object.entries(dict).sort((a, b) => b[0].length - a[0].length || a[0].localeCompare(b[0], "zh")),
);
writeFileSync(DICT_PATH, JSON.stringify(sorted, null, 2) + "\n", "utf8");

console.log(`\n✅ Đã thêm: ${added} | Conflict (giữ bản cũ): ${conflicts} | Lỗi: ${errors.length}`);
if (errors.length) {
  console.log("\n--- Lỗi (cần sửa tay) ---");
  for (const e of errors.slice(0, 30)) console.log("  " + e);
}
console.log(`Tổng entry trong vi-dict.json: ${Object.keys(sorted).length}`);
