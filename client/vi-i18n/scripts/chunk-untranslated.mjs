#!/usr/bin/env node
/**
 * chunk-untranslated.mjs — Chia untranslated.json thành N batch đều nhau
 * (trộn chuỗi ngắn/dài, ưu tiên chuỗi tần suất cao rải đều các batch).
 *
 * Output: client/vi-i18n/translations/chunks/chunk-01.json ... chunk-NN.json
 * Cách chạy: node client/vi-i18n/scripts/chunk-untranslated.mjs [so_batch]
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const SRC = path.join(ROOT, "client", "vi-i18n", "untranslated.json");
const OUT_DIR = path.join(ROOT, "client", "vi-i18n", "translations", "chunks");
const N = Number(process.argv[2] ?? 15);

const all = JSON.parse(readFileSync(SRC, "utf8"));

// Rải đều: xếp chuỗi theo tần suất giảm dần, rồi round-robin vào các batch
// (mỗi batch nhận hỗn hợp chuỗi hot + chuỗi dài hiếm gặp)
const sorted = [...all].sort((a, b) => b.n - a.n || a.s.localeCompare(b.s, "zh"));
const buckets = Array.from({ length: N }, () => []);
sorted.forEach((x, i) => buckets[i % N].push(x));

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });
let total = 0;
buckets.forEach((b, i) => {
  const file = path.join(OUT_DIR, `chunk-${String(i + 1).padStart(2, "0")}.json`);
  writeFileSync(file, JSON.stringify(b, null, 0), "utf8");
  total += b.length;
  console.log(`chunk-${String(i + 1).padStart(2, "0")}: ${b.length} chuỗi`);
});
console.log(`Tổng: ${total} chuỗi → ${N} batch (${OUT_DIR})`);
