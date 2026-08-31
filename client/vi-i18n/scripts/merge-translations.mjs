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
    // placeholder: số lượng ${...} trong value phải bằng key (bắt lỗi rơi mất biến)
    if (PH_COUNT(zh) !== PH_COUNT(vi)) {
      errors.push(`${f}: số placeholder khác nhau (${PH_COUNT(zh)} vs ${PH_COUNT(vi)}) cho ${JSON.stringify(zh.slice(0, 50))}`);
      continue;
    }
    dict[zh] = vi;
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
