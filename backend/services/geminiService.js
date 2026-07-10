const path = require("path");
const crypto = require("crypto");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

function getGenAIInstance() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Check backend/.env.");
  }

  return new GoogleGenerativeAI(apiKey);
}

function getModelNames() {
  const configuredModels = [
    process.env.GEMINI_MODEL?.trim(),
    process.env.GEMINI_FALLBACK_MODEL?.trim(),
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
  ].filter(Boolean);

  return [...new Set(configuredModels)];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simple in-memory cache to avoid repeated identical requests
// Default: 24 hours (86400000 ms) - cache results for a full day to minimize API calls
const CACHE_TTL_MS = Math.max(0, parseInt(process.env.GEMINI_CACHE_TTL_MS || "86400000", 10));
const responseCache = new Map();
const maxCacheSize = parseInt(process.env.GEMINI_CACHE_MAX_SIZE || "100", 10); // Prevent unbounded cache growth

function cacheKey(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function getCached(key) {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return entry.value;
}

function setCached(key, value) {
  // Prevent cache from growing unbounded
  if (responseCache.size >= maxCacheSize) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey) responseCache.delete(firstKey);
  }
  const expiresAt = CACHE_TTL_MS > 0 ? Date.now() + CACHE_TTL_MS : null;
  responseCache.set(key, { value, expiresAt });
}

// Simple in-process concurrency limiter
const MAX_CONCURRENT = Math.max(1, parseInt(process.env.GEMINI_MAX_CONCURRENT || "3", 10));
let activeRequests = 0;
const pendingResolvers = [];

function acquireSlot() {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests += 1;
    return Promise.resolve();
  }

  return new Promise((resolve) => pendingResolvers.push(resolve));
}

function releaseSlot() {
  activeRequests = Math.max(0, activeRequests - 1);
  if (pendingResolvers.length > 0) {
    const next = pendingResolvers.shift();
    activeRequests += 1;
    next();
  }
}

function parseRetryAfter(error) {
  try {
    const headers = error?.response?.headers || error?.headers;
    if (!headers) return null;

    // Common shapes: headers.get('retry-after') or headers['retry-after']
    const getHeader = (h) => (typeof h.get === "function" ? h.get("retry-after") : h["retry-after"] || h["Retry-After"]);
    const raw = getHeader(headers);
    if (!raw) return null;

    // If numeric seconds
    const secs = parseInt(String(raw).trim(), 10);
    if (!Number.isNaN(secs)) return secs * 1000;

    // Try parse date
    const then = Date.parse(raw);
    if (!Number.isNaN(then)) return Math.max(0, then - Date.now());
  } catch (e) {
    // ignore
  }

  return null;
}

function backoffDelay(attempt, base = 1000, max = 30000) {
  const expo = Math.min(max, base * Math.pow(2, attempt - 1));
  const jitter = Math.floor(Math.random() * 500);
  return Math.min(max, expo + jitter);
}

async function getCareerSuggestions(resumeText) {
  await acquireSlot();
  try {
    // Normalize and check cache first
    const normalized = String(resumeText || "").trim();
    const key = cacheKey(normalized);
    const cached = getCached(key);
    if (cached) {
      console.log("Returning cached Gemini response");
      return cached;
    }
    const genAI = getGenAIInstance();
    const prompt = `
You are an AI Career Coach.

Based on this resume:

${resumeText}

Return ONLY valid JSON in this format:

{
  "careerPath": "",
  "strengths": [],
  "weaknesses": [],
  "recommendedSkills": [],
  "jobRoles": [],
  "interviewQuestions": []
}
`;

    const modelNames = getModelNames();
    let lastError;

    const maxAttemptsPerModel = Math.max(1, parseInt(process.env.GEMINI_MAX_RETRIES || "3", 10));

    for (const modelName of modelNames) {
      for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt += 1) {
        try {
          console.log(`Calling Gemini API with ${modelName} (attempt ${attempt})...`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          console.log(`Gemini response received from ${modelName}`);
          try { setCached(key, text); } catch (e) { /* ignore cache errors */ }
          return text;
        } catch (error) {
          lastError = error;
          const message = error?.message || "";
          const isTemporaryFailure = /429|503|quota|overload|temporarily|rate limit|unavailable/i.test(message) || (error?.status === 429 || error?.status === 503);
          
          // Special handling for quota exceeded
          if ((error?.status === 429 || message.includes('quota')) && message.includes('limit')) {
            console.error("⚠️  GEMINI FREE TIER QUOTA EXHAUSTED");
            console.error("   This typically happens when you've used all free requests for the day.");
            console.error("   Quota may reset tomorrow, or upgrade to a paid plan for unlimited access.");
          }

          // If server supplied Retry-After header, respect it
          const retryAfterMs = parseRetryAfter(error);
          if (isTemporaryFailure && attempt < maxAttemptsPerModel) {
            const delayMs = retryAfterMs ?? backoffDelay(attempt, 1000, 30000);
            console.warn(`Gemini ${modelName} temporary failure: ${message}. Waiting ${delayMs}ms before retry (attempt ${attempt + 1})`);
            await wait(delayMs);
            continue;
          }

          console.warn(`Gemini ${modelName} failed: ${message}`);
          break; // stop retrying this model on non-temporary failure
        }
      }
    }

    throw lastError || new Error("Gemini request failed.");
  } finally {
    releaseSlot();
  }
}

module.exports = { getCareerSuggestions };