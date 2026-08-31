#!/usr/bin/env node
/**
 * extract-untranslated.mjs — Trích xuất toàn bộ chuỗi tiếng Trung CHƯA DỊCH
 * từ client/src + server/src (bỏ node_modules, test, prompts, migrations).
 *
 * Output: vi-i18n/untranslated.json
 *   [{ s: "chuỗi gốc", n: số lần xuất hiện, src: ["file:line", ...] }]
 *
 * Cách chạy:  node vi-i18n/scripts/extract-untranslated.mjs
 * (chạy từ root repo)
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const SCAN_DIRS = [path.join(ROOT, "client", "src"), path.join(ROOT, "server", "src")];
const DICT_PATH = path.join(ROOT, "client", "vi-i18n", "vi-dict.json");
const OUT_PATH = path.join(ROOT, "client", "vi-i18n", "untranslated.json");

const HAN = /[\u4e00-\u9fff]/;

// Regex lấy chuỗi literal (double/single quote) + template literal + JSX text
const RE_DQ = /"((?:[^"\\\n]|\\.)*)"/g;
const RE_SQ = /'((?:[^'\\\n]|\\.)*)'/g;
const RE_TPL = /`([^`]*)`/g;
const RE_JSX = />([^<>]*[\u4e00-\u9fff][^<>]*)</g;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "prompting" || entry.name === "migrations" || entry.name === "migrations.sqlite") continue;
      walk(p, out);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name) && !/\.(test|spec)\.[jt]sx?$/.test(entry.name)) {
      out.push(p);
    }
  }
  return out;
}

const count = new Map(); // s -> { n, src: [] }
function add(s, file, line) {
  const t = s.trim();
  if (!t || !HAN.test(t)) return;
  const rec = count.get(t) ?? { n: 0, src: [] };
  rec.n += 1;
  if (rec.src.length < 3) rec.src.push(`${path.relative(ROOT, file)}:${line}`);
  count.set(t, rec);
}

const files = SCAN_DIRS.flatMap((d) => walk(d));
for (const file of files) {
  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (!HAN.test(src)) continue;
  const lines = src.split("\n");
  const findLine = (idx) => {
    // đếm dòng từ đầu đến idx (xấp xỉ, đủ dùng)
    let line = 1, nl = 0;
    const upTo = Math.min(idx, src.length);
    for (let i = 0; i < upTo; i++) if (src[i] === "\n") line++;
    return line;
  };
  const scan = (re) => {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src)) !== null) {
      add(m[1], file, findLine(m.index));
    }
  };
  scan(RE_DQ);
  scan(RE_SQ);
  scan(RE_TPL);
  scan(RE_JSX);
}

// Trừ các key đã có trong từ điển
const dict = existsSync(DICT_PATH) ? JSON.parse(readFileSync(DICT_PATH, "utf8")) : {};
const existing = new Set(Object.keys(dict));
const untranslated = [...count.entries()]
  .filter(([s]) => !existing.has(s))
  .map(([s, v]) => ({ s, n: v.n, src: v.src }))
  .sort((a, b) => b.n - a.n || a.s.localeCompare(b.s, "zh"));

mkdirSync(path.dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(untranslated, null, 1), "utf8");

const totalOccurrences = untranslated.reduce((acc, x) => acc + x.n, 0);
console.log(`Files quét: ${files.length}`);
console.log(`Chuỗi Trung trong source: ${count.size}`);
console.log(`Đã có trong dict: ${existing.size}`);
console.log(`CHƯA DỊCH: ${untranslated.length} chuỗi (${totalOccurrences} lần xuất hiện)`);
console.log(`Output: ${path.relative(ROOT, OUT_PATH)}`);
console.log("\nTop 15 chuỗi chưa dịch (theo tần suất):");
for (const x of untranslated.slice(0, 15)) {
  console.log(`  x${x.n}: ${x.s.slice(0, 60)}`);
}
