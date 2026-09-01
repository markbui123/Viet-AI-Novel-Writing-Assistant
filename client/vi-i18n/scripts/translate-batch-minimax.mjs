#!/usr/bin/env node
/**
 * translate-batch-minimax.mjs — Dịch các chunk chưa có batch bằng MiniMax M2.7
 * qua proxy nội bộ (api2ai.apps.hatinhcogi.com). Rẻ + nhanh + nhất quán.
 *
 * Yêu cầu env: MINIMAX_API_KEY, MINIMAX_BASE_URL (lấy từ TopHop/spike/.env)
 *   cd ~/Documents/Dev/TopHop/spike && export $(grep -E '^(MINIMAX_API_KEY|MINIMAX_BASE_URL)=' .env | xargs)
 *
 * Cách chạy:
 *   node client/vi-i18n/scripts/translate-batch-minimax.mjs 1 2 3 ...   (chunk cụ thể)
 *   node client/vi-i18n/scripts/translate-batch-minimax.mjs all          (mọi chunk chưa có batch)
 *   --force: dịch lại kể cả đã có batch
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const CHUNK_DIR = path.join(ROOT, "client", "vi-i18n", "translations", "chunks");
const BATCH_DIR = path.join(ROOT, "client", "vi-i18n", "translations", "batches");

const BASE = process.env.MINIMAX_BASE_URL;
const KEY = process.env.MINIMAX_API_KEY;
const MODEL = process.env.MINIMAX_MODEL ?? "minimax/MiniMax-M2.5"; // 2.5 tiết kiệm quota hơn 2.7
if (!BASE || !KEY) {
  console.error("Thiếu MINIMAX_BASE_URL / MINIMAX_API_KEY. Load env từ TopHop/spike/.env trước.");
  process.exit(1);
}

const SUBSIZE = 25; // chuỗi mỗi request
const CONCURRENCY = 3; // MiniMax M2.5 vừa reset quota — chạy vừa phải, 429 backoff 45s phòng hờ
const FORCE = process.argv.includes("--force");
const FETCH_TIMEOUT_MS = 150000;

const SYSTEM = `Bạn là chuyên gia dịch UI của app AI viết tiểu thuyết (tiếng Trung → tiếng Việt). Người dùng gửi một JSON array các chuỗi giao diện. Trả về CHỈ MỘT JSON object: key = chuỗi gốc NGUYÊN VẸN (không trim, không sửa), value = bản dịch tiếng Việt tự nhiên. Không markdown fence, không giải thích, không <think>.

Quy tắc bắt buộc:
1. Giữ nguyên \${...} placeholder (tên biến và số lượng không đổi).
2. Nếu chuỗi chứa biểu thức JSX dạng {tenBien} hoặc {dieuKien ? "a" : "b"} (dấu ngoặc nhọn đơn), giữ NGUYÊN cả biểu thức bên trong {} — chỉ dịch phần chữ tiếng Trung bên ngoài.
3. Giữ nguyên thương hiệu/thuật ngữ kỹ thuật: OpenAI, DeepSeek, Ollama, Qdrant, RAG, API, model, prompt, token, URL, SQLite, JSON, AI.
4. Thuật ngữ cố định: 小说=tiểu thuyết, 创作=sáng tác, 章节=chương, 卷=tập, 世界观=thế giới quan, 角色=nhân vật, 主角=nhân vật chính, 知识库=kho tri thức, 写法引擎=công cụ cách viết, 任务=nhiệm vụ, 自动导演=Đạo diễn AI, 模型=model, 生成=tạo, 审核=thẩm định, 修复=sửa chữa, 拆书=phân tích sách, 灵感=ý tưởng, 类型=thể loại, 题材=đề tài, 风格=phong cách, 文风=văn phong, 节奏=nhịp điệu, 剧情=cốt truyện, 大纲=dàn ý, 背景=bối cảnh, 设定=thiết lập, 资产=tài sản, 资源=tài nguyên, 模板=mẫu, 版本=phiên bản, 状态=trạng thái, 设置=cài đặt, 新建=tạo mới, 删除=xóa, 编辑=chỉnh sửa, 保存=lưu, 确认=xác nhận, 取消=hủy, 重试=thử lại, 加载中=đang tải, 搜索=tìm kiếm, 返回=quay lại, 首页=trang chủ, 列表=danh sách, 详情=chi tiết, 全部=tất cả, 暂无=chưa có, 已完成=đã hoàn thành, 失败=thất bại, 成功=thành công, 排队中=đang xếp hàng, 已取消=đã hủy, 待补全=chờ bổ sung, 保存中=đang lưu, 生成中=đang tạo.
5. Chuỗi ngắn đơn lẻ: 无=Không có, 中=Đang chạy (hoặc "Trung bình" trong cụm 高中低), 高=Cao, 低=Thấp, 新=Mới.
6. Dịch tự nhiên, gọn, chuẩn UI tiếng Việt, không word-for-word; chuỗi là cụm con thì dịch nghĩa độc lập của cụm đó.
7. MỌI chuỗi trong request phải có mặt trong response (không bỏ sót chuỗi nào).
8. Output PHẢI là JSON hợp lệ, UTF-8.`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseContent(raw) {
  let c = raw;
  // bỏ các dòng SSE nếu proxy trả kiểu data: ...
  c = c.split("\n").filter((l) => !l.trim().startsWith("data:")).join("\n");
  c = c.replace(/<think>[\s\S]*?<\/think>/g, "");
  c = c.replace(/```json|```/g, "").trim();
  let obj = null;
  try { obj = JSON.parse(c); } catch { /* thử cách khác */ }
  if (!obj) {
    const s = c.indexOf("{"), e = c.lastIndexOf("}");
    if (s !== -1 && e > s) { try { obj = JSON.parse(c.slice(s, e + 1)); } catch { /* vẫn chưa được */ } }
  }
  if (!obj) throw new Error("Không parse được JSON từ response");
  // Nếu là wrapper chat.completion → lấy message.content (có thể là JSON bị escape)
  if (obj.choices && Array.isArray(obj.choices) && obj.choices[0]?.message && typeof obj.choices[0].message.content === "string") {
    const inner = obj.choices[0].message.content;
    let innerObj = null;
    try { innerObj = JSON.parse(inner); } catch { }
    if (!innerObj) {
      try { innerObj = JSON.parse(extractJsonObject(inner)); } catch { }
    }
    if (innerObj) return innerObj;
    throw new Error("message.content không phải JSON");
  }
  return obj;
}

// Trích JSON object ĐẦU TIÊN cân bằng ngoặc — chịu được trailing text sau JSON
function extractJsonObject(c) {
  const start = c.indexOf("{");
  if (start === -1) throw new Error("Không tìm thấy JSON trong response");
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < c.length; i++) {
    const ch = c[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
    } else {
      if (ch === '"') inStr = true;
      else if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) return c.slice(start, i + 1);
      }
    }
  }
  throw new Error("JSON không cân bằng ngoặc");
}

async function callLLM(strings) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: JSON.stringify(strings, null, 0) },
        ],
        temperature: 0.2,
        max_tokens: 6000,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
    }
    // QUIRK proxy hatinhcogi: body = JSON hợp lệ + "\ndata: [DONE]\n" chèn sau
    // → không dùng res.json() trực tiếp; strip dòng "data:" rồi parse
    const text = await res.text();
    // QUIRK proxy hatinhcogi: "data: [DONE]" chèn NGAY SAU "}" (cùng dòng) — xóa bằng regex
    const cleaned = text
      .replace(/data: \[DONE\]/g, "")
      .split("\n")
      .filter((l) => !l.trim().startsWith("data:"))
      .join("\n");
    const data = JSON.parse(cleaned);
    const content = data?.choices?.[0]?.message?.content ?? "";
    if (!content) throw new Error("Response rỗng content");
    return parseContent(content);
  } finally {
    clearTimeout(timer);
  }
}

// Model có thể trả object {key:value} hoặc array [v0, v1...] — lookup theo cả 2
function lookupValue(parsed, s, idx) {
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && typeof parsed[s] === "string") return parsed[s];
  if (Array.isArray(parsed) && typeof parsed[idx] === "string") return parsed[idx];
  return undefined;
}

async function translateChunk(n) {
  const chunkFile = path.join(CHUNK_DIR, `chunk-${String(n).padStart(2, "0")}.json`);
  const batchFile = path.join(BATCH_DIR, `batch-${String(n).padStart(2, "0")}.json`);
  if (!existsSync(chunkFile)) {
    console.log(`[${n}] chunk không tồn tại, bỏ qua`);
    return 0;
  }
  // RESUME: nạp batch đã có (nếu không --force) — chỉ dịch phần còn thiếu
  const result = !FORCE && existsSync(batchFile) ? JSON.parse(readFileSync(batchFile, "utf8")) : {};
  const chunk = JSON.parse(readFileSync(chunkFile, "utf8"));
  const allStrings = chunk.map((x) => x.s);
  const strings = allStrings.filter((s) => !(s in result));
  if (strings.length === 0) {
    console.log(`[${n}] đã đủ ${allStrings.length}/${allStrings.length}, bỏ qua`);
    return allStrings.length;
  }
  console.log(`[${n}] cần dịch ${strings.length}/${allStrings.length} chuỗi (resume từ ${Object.keys(result).length})`);
  const missing = [];

  for (let i = 0; i < strings.length; i += SUBSIZE) {
    const sub = strings.slice(i, i + SUBSIZE);
    let parsed = null;
    for (let attempt = 1; attempt <= 3 && !parsed; attempt++) {
      try {
        parsed = await callLLM(sub);
      } catch (e) {
        console.warn(`  [${n}] sub ${i} lần ${attempt} lỗi: ${e.message.slice(0, 100)}`);
        // 429 (rate-limit) cần chờ lâu hơn hẳn — 45s cho cửa sổ reset token/phút
        await sleep(e.message.includes("429") ? 45000 : 3000 * attempt);
      }
    }
    if (!parsed) {
      missing.push(...sub);
      continue;
    }
    for (let idx = 0; idx < sub.length; idx++) {
      const s = sub[idx];
      const v = lookupValue(parsed, s, idx);
      if (typeof v === "string" && v.trim()) result[s] = v;
      else missing.push(s);
    }
    // GHI TIẾN ĐỘ SAU MỖI SUB-BATCH — timeout/treo không mất công
    writeFileSync(batchFile, JSON.stringify(result, null, 0), "utf8");
    process.stdout.write(`  [${n}] ${Object.keys(result).length}/${allStrings.length}\r`);
  }

  // retry các chuỗi còn thiếu — xử lý TẤT CẢ (tối đa 2 lượt, mỗi lượt chia theo SUBSIZE)
  let round = 0;
  while (missing.length && round < 2) {
    round++;
    const toRetry = missing.splice(0);
    console.log(`  [${n}] retry lần ${round}: ${toRetry.length} chuỗi thiếu`);
    for (let i = 0; i < toRetry.length; i += SUBSIZE) {
      const sub = toRetry.slice(i, i + SUBSIZE);
      try {
        const parsed = await callLLM(sub);
        for (let idx = 0; idx < sub.length; idx++) {
          const s = sub[idx];
          const v = lookupValue(parsed, s, idx);
          if (typeof v === "string" && v.trim()) result[s] = v;
          else missing.push(s);
        }
      } catch (e) {
        missing.push(...sub);
        console.warn(`  [${n}] retry lỗi: ${e.message.slice(0, 100)}`);
      }
      writeFileSync(batchFile, JSON.stringify(result, null, 0), "utf8");
    }
  }

  writeFileSync(batchFile, JSON.stringify(result, null, 0), "utf8");
  const pct = Math.round((Object.keys(result).length / allStrings.length) * 100);
  console.log(`  [${n}] XONG: ${Object.keys(result).length}/${allStrings.length} (${pct}%)${missing.length ? ` — còn thiếu ${missing.length}` : ""}`);
  return Object.keys(result).length;
}

// ---------- main ----------
const args = process.argv.slice(2).filter((a) => a !== "--force");
let nums;
if (args.includes("all") || args.length === 0) {
  nums = readdirSync(CHUNK_DIR)
    .filter((f) => f.startsWith("chunk-") && f.endsWith(".json"))
    .map((f) => Number(f.match(/chunk-(\d+)/)[1]))
    .sort((a, b) => a - b);
} else {
  nums = args.map(Number).sort((a, b) => a - b);
}

console.log(`Model: ${MODEL} | chunks: ${nums.join(", ")} | sub-size: ${SUBSIZE} | concurrency: ${CONCURRENCY}`);
const started = Date.now();
let done = 0, total = 0;
for (let i = 0; i < nums.length; i += CONCURRENCY) {
  const batch = nums.slice(i, i + CONCURRENCY);
  const results = await Promise.all(batch.map((n) => translateChunk(n).catch((e) => { console.error(`[${n}] FALLO: ${e.message}`); return 0; })));
  done += results.filter((r) => r > 0).length;
  total += results.reduce((a, b) => a + b, 0);
}
console.log(`\nHoàn tất: ${total} chuỗi đã dịch trong ${Math.round((Date.now() - started) / 1000)}s`);
