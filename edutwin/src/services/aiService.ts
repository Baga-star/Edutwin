import { AgentType, StudentProfile } from "../types";

// ════════════════════════════════════════════════════════════════════════════════
// 🔑  КОНФИГУРАЦИЯ
// ════════════════════════════════════════════════════════════════════════════════

const QWEN_BASE  = (import.meta.env.VITE_QWEN_API_BASE  || "").replace(/\/chat\/completions$/, "").replace(/\/$/, "");
const QWEN_KEY   = import.meta.env.VITE_QWEN_API_KEY   || "";
const QWEN_MODEL_FAST  = import.meta.env.VITE_QWEN_MODEL_FAST || "";
const QWEN_MODEL_HEAVY = import.meta.env.VITE_QWEN_MODEL      || "qwen3-235b-a22b";

// Список fallback-моделей — пробуем по очереди если основная упала
const FALLBACK_MODELS: string[] = [
  QWEN_MODEL_HEAVY,
  ...(QWEN_MODEL_FAST && QWEN_MODEL_FAST !== QWEN_MODEL_HEAVY ? [QWEN_MODEL_FAST] : []),
  "qwen3-72b",
  "qwen3-14b",
  "qwen3-8b",
];

const ALEM_BASE  = (import.meta.env.VITE_ALEMLLM_API_BASE || "").replace(/\/chat\/completions$/, "").replace(/\/$/, "");
const ALEM_KEY   = import.meta.env.VITE_ALEMLLM_API_KEY   || "";
const ALEM_MODEL = import.meta.env.VITE_ALEMLLM_MODEL      || "alem-llm-247b";

const BACKEND_URL     = import.meta.env.VITE_BACKEND_URL      || "http://localhost:4000";
const NOCODB_URL      = import.meta.env.VITE_NOCODB_URL       || "";
const NOCODB_TOKEN    = import.meta.env.VITE_NOCODB_TOKEN     || "";
const NOCODB_TABLE_ID = import.meta.env.VITE_NOCODB_TABLE_ID  || "";
const FORMBRICKS_URL  = (import.meta.env.VITE_FORMBRICKS_API_URL || "").replace(/^VITE_FORMBRICKS_API_URL=/, "");
const FORMBRICKS_KEY  = import.meta.env.VITE_FORMBRICKS_API_KEY     || "";
const FORMBRICKS_SID  = import.meta.env.VITE_FORMBRICKS_SURVEY_ID   || "";
const FORMBRICKS_ENV  = import.meta.env.VITE_FORMBRICKS_ENVIRONMENT  || "";
const MINIO_BUCKET    = import.meta.env.VITE_MINIO_BUCKET    || "aleemstudenttwin";

// ════════════════════════════════════════════════════════════════════════════════
// 🛡️  УРОВЕНЬ 3: Circuit Breaker — после N ошибок пауза перед попытками
// ════════════════════════════════════════════════════════════════════════════════
const CIRCUIT = {
  failures: 0,
  openUntil: 0,          // timestamp до которого не пробуем
  THRESHOLD: 3,          // сколько ошибок подряд открывают circuit
  COOLDOWN_MS: 60_000,   // пауза 60 секунд
};

function circuitIsOpen(): boolean {
  if (CIRCUIT.failures >= CIRCUIT.THRESHOLD && Date.now() < CIRCUIT.openUntil) return true;
  if (Date.now() >= CIRCUIT.openUntil) CIRCUIT.failures = 0; // cooldown прошёл — сброс
  return false;
}

function circuitOnSuccess(): void {
  CIRCUIT.failures = 0;
  CIRCUIT.openUntil = 0;
}

function circuitOnFailure(): void {
  CIRCUIT.failures++;
  if (CIRCUIT.failures >= CIRCUIT.THRESHOLD) {
    CIRCUIT.openUntil = Date.now() + CIRCUIT.COOLDOWN_MS;
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// 🛡️  УРОВЕНЬ 4: Health Check — статус API в реальном времени
// ════════════════════════════════════════════════════════════════════════════════
export type ApiStatus = "ok" | "degraded" | "down" | "unknown";

let _apiStatus: ApiStatus = "unknown";
let _healthListeners: ((s: ApiStatus) => void)[] = [];

export function onApiStatusChange(cb: (s: ApiStatus) => void): () => void {
  _healthListeners.push(cb);
  cb(_apiStatus); // сразу отдаём текущий статус
  return () => { _healthListeners = _healthListeners.filter(l => l !== cb); };
}

function setApiStatus(s: ApiStatus) {
  if (_apiStatus === s) return;
  _apiStatus = s;
  _healthListeners.forEach(l => l(s));
}

async function pingApi(): Promise<void> {
  if (!QWEN_BASE || !QWEN_KEY) { setApiStatus("unknown"); return; }
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 5_000);
    const res = await fetch(`${QWEN_BASE}/models`, {
      headers: { Authorization: `Bearer ${QWEN_KEY}` },
      signal: controller.signal,
    });
    clearTimeout(tid);
    setApiStatus(res.ok ? "ok" : "degraded");
  } catch {
    setApiStatus("down");
  }
}

// Пингуем сразу и потом каждые 30 секунд
pingApi();
setInterval(pingApi, 30_000);

// ════════════════════════════════════════════════════════════════════════════════
// In-memory кэш
// ════════════════════════════════════════════════════════════════════════════════
interface CacheEntry { value: string; expiresAt: number; }
const memCache = new Map<string, CacheEntry>();

function memGet(key: string): string | null {
  const entry = memCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { memCache.delete(key); return null; }
  return entry.value;
}

function memSet(key: string, value: string, ttlSec = 3600): void {
  memCache.set(key, { value, expiresAt: Date.now() + ttlSec * 1000 });
  redisSetBackground(key, value, ttlSec);
}

const profileCache = new Map<string, StudentProfile>();

// ════════════════════════════════════════════════════════════════════════════════
// 🛡️  УРОВЕНЬ 1: Retry с exponential backoff
// ════════════════════════════════════════════════════════════════════════════════
async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries = 3,
  timeoutMs = 15_000
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt++) {
    // Circuit breaker — если слишком много ошибок, сразу бросаем
    if (circuitIsOpen()) {
      const waitSec = Math.ceil((CIRCUIT.openUntil - Date.now()) / 1000);
      throw new Error(`API временно недоступна. Повтор через ${waitSec} сек.`);
    }

    // Таймаут на каждый запрос
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(tid);

      // 429 Too Many Requests — ждём дольше
      if (res.status === 429) {
        const retryAfter = Number(res.headers.get("retry-after") || "5") * 1000;
        await sleep(retryAfter);
        continue;
      }

      // 5xx — серверная ошибка, стоит повторить
      if (res.status >= 500 && attempt < retries - 1) {
        circuitOnFailure();
        await sleep(1000 * Math.pow(2, attempt)); // 1s, 2s, 4s
        continue;
      }

      circuitOnSuccess();
      setApiStatus("ok");
      return res;
    } catch (err) {
      clearTimeout(tid);
      lastError = err;
      circuitOnFailure();
      setApiStatus(attempt === retries - 1 ? "down" : "degraded");

      if (attempt < retries - 1) {
        await sleep(1000 * Math.pow(2, attempt)); // exponential backoff
      }
    }
  }

  throw lastError ?? new Error("Не удалось выполнить запрос");
}

// ════════════════════════════════════════════════════════════════════════════════
// 🤖  СИСТЕМНЫЕ ПРОМПТЫ АГЕНТОВ (ЕНТ 2024-2025)
// ════════════════════════════════════════════════════════════════════════════════
const AGENT_PROMPTS: Record<AgentType, string> = {
  Diagnostic:
    "Ты — Диагностический агент EduTwin.kz для подготовки к ЕНТ (Казахстан, 2024–2025). " +
    "Формат ЕНТ: 120 заданий, максимальный балл — 140. " +
    "Обязательные предметы: Мат. грамотность, Грамотность чтения, История Казахстана. " +
    "Профильные предметы (2 на выбор): Математика, Физика, Химия, Биология, " +
    "География, Информатика, Английский, Русский, Всемирная история. " +
    "\n\nТвоя задача — выявить пробелы в знаниях ученика по каждому предмету. " +
    "Алгоритм диагностики: " +
    "1) Задавай вопросы по ключевым темам предмета (от лёгких к сложным). " +
    "2) Анализируй паттерны ошибок — какие темы западают чаще всего. " +
    "3) Определи уровень по каждому предмету: Beginner (0–40%), Intermediate (40–70%), Advanced (70–100%). " +
    "\nПо итогам выдай структурированный отчёт: " +
    "— Сильные темы, — Слабые темы, — Уровень по предмету, — Краткая мотивация. " +
    "Пиши по-русски, кратко, дружелюбно, без лишнего текста.",

  CognitiveModel:
    "Ты — Агент Когнитивной Модели EduTwin.kz (ЕНТ 2024–2025). " +
    "Ты ведёшь долгосрочный профиль знаний ученика по всем предметам ЕНТ. " +
    "\nОбновляй профиль на основе верных/неверных ответов и паттернов ошибок. " +
    "\nФормат ответа (2–3 предложения): " +
    "«В теме [X] ученик показал [результат]. Рекомендуется повторить [тему]. Следующий шаг: [действие].» " +
    "Стиль — мотивирующий, конкретный. По-русски.",

  Tutor:
    "Ты — ИИ-репетитор EduTwin.kz для подготовки к ЕНТ Казахстана (2024–2025). " +
    "Работаешь по ГОСО 2022 и спецификациям ЕНТ (НАО «НИШ», МОН РК). " +
    "\nПринципы: разбивай решение на шаги, приводи аналогии, давай краткое правило в конце. " +
    "При ошибке — не критикуй, мягко объясни. Предложи похожий вопрос после объяснения. " +
    "Язык — русский, простой и понятный.",

  Assessment:
    "Ты — Агент Оценки EduTwin.kz (ЕНТ 2024–2025, Казахстан). " +
    "При ВЕРНОМ ответе: подтверди кратко, напомни правило. " +
    "При НЕВЕРНОМ ответе: скажи «Почти верно» или «Давай разберём», " +
    "объясни почему неверно, разбери правильный ответ пошагово. " +
    "Стиль — дружелюбный. По-русски, кратко.",

  Prediction:
    "Ты — Агент Прогнозирования ЕНТ EduTwin.kz (Казахстан, 2024–2025). " +
    "Прогнозируешь итоговый балл ЕНТ по шкале 0–140 баллов. " +
    "Формат: «Прогнозируемый балл: [X]–[Y] из 140. Приоритетные темы: [...]. При подготовке можно набрать ещё [Z] баллов.» " +
    "По-русски, 3–5 предложений, мотивирующе.",

  Analytics:
    "Ты — Агент Аналитики EduTwin.kz (ЕНТ 2024–2025, Казахстан). " +
    "Составляешь подробный отчёт: общий результат, сильные стороны, слабые места, динамика, план действий. " +
    "Стиль — структурированный, конкретный, деловой. По-русски.",
};

const ALEM_KZ_PROMPT =
  "Сен — EduTwin.kz білім платформасының қазақ тіліндегі AI-репетиторысың. " +
  "ҰБТ-2024/2025 барлық пәндері бойынша қазақша қарапайым тілмен түсіндір. " +
  "Мысалдармен, қадамдарымен нақты жауап бер.";

function modelForAgent(agent: AgentType): string {
  if (agent === "Analytics" || agent === "Prediction") return QWEN_MODEL_HEAVY;
  return QWEN_MODEL_FAST || QWEN_MODEL_HEAVY;
}

// ════════════════════════════════════════════════════════════════════════════════
// 🛡️  УРОВЕНЬ 2: Fallback по моделям + Стриминг с авто-fallback
// ════════════════════════════════════════════════════════════════════════════════
async function callApiNonStream(
  model: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const res = await fetchWithRetry(
    `${QWEN_BASE}/chat/completions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8", Authorization: `Bearer ${QWEN_KEY}` },
      body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 1024, stream: false, enable_thinking: false }),
    },
    3,     // 3 попытки
    15_000 // таймаут 15 секунд
  );

  if (!res.ok) {
    let detail = "";
    try { const e = await res.json(); detail = e?.error?.message || e?.message || ""; } catch {}
    throw new Error(detail || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const msg = data?.choices?.[0]?.message;
  // qwen3 возвращает reasoning_content когда content пустой
  const text = msg?.content || msg?.reasoning_content || "";
  return text.trim() || "Нет ответа от модели.";
}

export async function getAgentResponseStream(
  agent: AgentType,
  userMessage: string,
  profile: StudentProfile | undefined,
  onChunk: (chunk: string) => void,
  onDone: (full: string) => void
): Promise<void> {
  // Из кэша — мгновенно
  const cacheKey = `agent:${agent}:${btoa(encodeURIComponent(userMessage)).slice(0, 40)}`;
  const cached = memGet(cacheKey);
  if (cached) {
    const words = cached.split(" ");
    let i = 0;
    const tick = setInterval(() => {
      if (i >= words.length) { clearInterval(tick); onDone(cached); return; }
      onChunk((i === 0 ? "" : " ") + words[i++]);
    }, 12);
    return;
  }

  // Circuit breaker
  if (circuitIsOpen()) {
    const waitSec = Math.ceil((CIRCUIT.openUntil - Date.now()) / 1000);
    const msg = `ИИ временно перегружен. Повтор через ${waitSec} сек. Попробуй ещё раз.`;
    onChunk(msg); onDone(msg); return;
  }

  const system =
    AGENT_PROMPTS[agent] +
    (profile
      ? `\n\nПрофиль ученика: имя=${profile.name}, уровень=${profile.level}, ` +
        `предметы=${profile.selectedSubjects.join(", ")}, ` +
        `точность=${profile.accuracy}%, прогноз ЕНТ=${profile.predictedENT} баллов, ` +
        `слабые темы=${profile.weakTopics.slice(0, 5).join(", ")}.`
      : "");

  const messages = [
    { role: "system", content: system },
    { role: "user",   content: userMessage },
  ];

  // ── Попытка 1: стриминг с основной моделью ───────────────────────────────
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 15_000);

    const res = await fetch(`${QWEN_BASE}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8", Authorization: `Bearer ${QWEN_KEY}` },
      body: JSON.stringify({ model: modelForAgent(agent), messages, temperature: 0.7, max_tokens: 1024, stream: true, enable_thinking: false }),
      signal: controller.signal,
    });

    clearTimeout(tid);

    if (res.ok && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";
      let gotContent = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const json = JSON.parse(data);
            const delta = json?.choices?.[0]?.delta?.content;
            if (delta) { fullText += delta; onChunk(delta); gotContent = true; }
          } catch { /* skip */ }
        }
      }

      if (gotContent) {
        circuitOnSuccess();
        setApiStatus("ok");
        memSet(cacheKey, fullText);
        onDone(fullText);
        return;
      }
    }
  } catch { /* стриминг недоступен — идём дальше */ }

  // ── Попытка 2: non-stream + fallback по моделям ──────────────────────────
  const primaryModel = modelForAgent(agent);
  const modelsToTry = [primaryModel, ...FALLBACK_MODELS.filter(m => m !== primaryModel)];
  let lastErr = "";

  for (const model of modelsToTry) {
    try {
      const text = await callApiNonStream(model, messages);
      memSet(cacheKey, text);
      circuitOnSuccess();
      setApiStatus("ok");

      // Симулируем стриминг для плавности UI
      const words = text.split(" ");
      let i = 0;
      await new Promise<void>((resolve) => {
        const tick = setInterval(() => {
          if (i >= words.length) { clearInterval(tick); resolve(); return; }
          onChunk((i === 0 ? "" : " ") + words[i++]);
        }, 10);
      });
      onDone(text);
      return;
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
      // Продолжаем пробовать следующую модель
    }
  }

  // Все модели недоступны
  setApiStatus("down");
  const errMsg = circuitIsOpen()
    ? `ИИ временно недоступен. Попробуй через минуту.`
    : `Не удалось получить ответ: ${lastErr}. Проверь VITE_QWEN_API_KEY в .env`;
  onChunk(errMsg);
  onDone(errMsg);
}

// Обёртка без стриминга (для обратной совместимости)
export async function getAgentResponse(
  agent: AgentType,
  userMessage: string,
  profile?: StudentProfile
): Promise<string> {
  return new Promise((resolve) => {
    let full = "";
    getAgentResponseStream(agent, userMessage, profile,
      (chunk) => { full += chunk; },
      (done) => resolve(done || full)
    );
  });
}

// ════════════════════════════════════════════════════════════════════════════════
// AlemLLM — казахский язык (с retry)
// ════════════════════════════════════════════════════════════════════════════════
export async function getAlemKZResponse(
  userMessage: string,
  profile?: StudentProfile
): Promise<string> {
  const cacheKey = `alem:${btoa(encodeURIComponent(userMessage)).slice(0, 40)}`;
  const cached = memGet(cacheKey);
  if (cached) return cached;

  const system =
    ALEM_KZ_PROMPT +
    (profile
      ? `\n\nОқушы: аты=${profile.name}, деңгей=${profile.level}, дәлдік=${profile.accuracy}%.`
      : "");

  try {
    const res = await fetchWithRetry(
      `${ALEM_BASE}/chat/completions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", Authorization: `Bearer ${ALEM_KEY}` },
        body: JSON.stringify({
          model: ALEM_MODEL,
          messages: [{ role: "system", content: system }, { role: "user", content: userMessage }],
          temperature: 0.7,
          max_tokens: 1024,
          stream: false,
        }),
      },
      2,
      12_000
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const text: string = data.choices?.[0]?.message?.content ?? "Жауап жоқ";
    memSet(cacheKey, text);
    return text;
  } catch {
    return "AlemLLM қазір қолжетімді емес. Кейінірек көріңіз.";
  }
}

export async function getKazakhExplanation(
  _agent: AgentType,
  text: string,
  profile?: StudentProfile
): Promise<string> {
  return getAlemKZResponse(`Мына мәтінді қазақша түсіндір:\n\n${text}`, profile);
}

// ════════════════════════════════════════════════════════════════════════════════
// Профиль — in-memory + фоновый Redis
// ════════════════════════════════════════════════════════════════════════════════
export function saveProfileToMemory(userId: string, profile: StudentProfile): void {
  profileCache.set(userId, profile);
  redisSaveProfileBackground(userId, profile);
}

export async function loadProfileFromRedis(userId: string): Promise<StudentProfile | null> {
  const mem = profileCache.get(userId);
  if (mem) return mem;
  try {
    const res = await fetch(`${BACKEND_URL}/cache/get`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ key: `profile:${userId}` }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.value) return null;
    const profile: StudentProfile = JSON.parse(data.value);
    profileCache.set(userId, profile);
    return profile;
  } catch { return null; }
}

// ════════════════════════════════════════════════════════════════════════════════
// Логирование — fire-and-forget
// ════════════════════════════════════════════════════════════════════════════════
export function logProgressToNocoDB(
  userId: string,
  topic: string,
  isCorrect: boolean,
  agent: AgentType
): Promise<void> {
  saveToNocoDB({ userId, topic, isCorrect, agent, timestamp: new Date().toISOString() }).catch(() => {});
  return Promise.resolve();
}

export async function saveProgressReport(userId: string, profile: StudentProfile): Promise<boolean> {
  try {
    saveProfileToMemory(userId, profile);
    return true;
  } catch {
    return false;
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// Redis helpers — все фоновые
// ════════════════════════════════════════════════════════════════════════════════
function redisSetBackground(key: string, value: string, ttl = 3600): void {
  fetch(`${BACKEND_URL}/cache/set`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ key, value, ttl }),
  }).catch(() => {});
}

function redisSaveProfileBackground(userId: string, profile: StudentProfile): void {
  fetch(`${BACKEND_URL}/cache/set`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ key: `profile:${userId}`, value: JSON.stringify(profile), ttl: 86400 }),
  }).catch(() => {});
}

// ════════════════════════════════════════════════════════════════════════════════
// NocoDB
// ════════════════════════════════════════════════════════════════════════════════
export async function saveToNocoDB(payload: Record<string, unknown>): Promise<void> {
  if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_TABLE_ID) return;
  try {
    await fetch(`${NOCODB_URL}/api/v1/db/data/noco/${NOCODB_TABLE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8", "xc-token": NOCODB_TOKEN },
      body: JSON.stringify(payload),
    });
  } catch { /* silent */ }
}

export async function getTopicStatsFromNocoDB(
  userId: string
): Promise<Record<string, { correct: number; total: number }>> {
  if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_TABLE_ID) return {};
  try {
    const res = await fetch(
      `${NOCODB_URL}/api/v1/db/data/noco/${NOCODB_TABLE_ID}?where=(userId,eq,${encodeURIComponent(userId)})&limit=100`,
      { headers: { "xc-token": NOCODB_TOKEN } }
    );
    if (!res.ok) return {};
    const data = await res.json();
    const rows: { topic?: string; isCorrect?: boolean }[] = data?.list ?? [];
    const stats: Record<string, { correct: number; total: number }> = {};
    for (const row of rows) {
      const topic = row.topic ?? "Общее";
      if (!stats[topic]) stats[topic] = { correct: 0, total: 0 };
      stats[topic].total++;
      if (row.isCorrect) stats[topic].correct++;
    }
    return stats;
  } catch { return {}; }
}

// ════════════════════════════════════════════════════════════════════════════════
// Formbricks
// ════════════════════════════════════════════════════════════════════════════════
export async function sendFeedback(userId: string, answers: Record<string, string>): Promise<void> {
  if (!FORMBRICKS_URL || !FORMBRICKS_KEY || !FORMBRICKS_SID) return;
  try {
    await fetch(`${FORMBRICKS_URL}/api/v1/client/${FORMBRICKS_ENV}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8", "x-api-key": FORMBRICKS_KEY },
      body: JSON.stringify({ surveyId: FORMBRICKS_SID, userId, finished: true, data: answers }),
    });
  } catch { /* silent */ }
}

export async function submitFeedbackToFormbricks(
  userId: string, rating: number, comment: string, topic: string
): Promise<void> {
  return sendFeedback(userId, { rating: String(rating), comment, topic });
}

// ════════════════════════════════════════════════════════════════════════════════
// MinIO
// ════════════════════════════════════════════════════════════════════════════════
export async function uploadToMinIO(file: File, fileName: string): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", MINIO_BUCKET);
    formData.append("fileName", fileName);
    const res = await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: formData });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url ?? null;
  } catch { return null; }
}
