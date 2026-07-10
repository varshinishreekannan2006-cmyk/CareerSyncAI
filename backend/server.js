const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");
const Resume = require("./models/Resume");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const morgan = require("morgan");
const NodeCache = require("node-cache");
const authMiddleware = require("./middleware/authMiddleware");
const ResumeHistory = require("./models/ResumeHistory");
const fs = require("fs");
const path = require('path');

const { getCareerSuggestions } = require("./services/geminiService");
const rateLimit = require('express-rate-limit');

require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");

let mammoth;
try { mammoth = require('mammoth'); } catch (e) { mammoth = null; }
let pdfParseImpl;
try {
  pdfParseImpl = require('../node_modules/pdf-parse/index.js');
} catch (e) {
  try {
    pdfParseImpl = require('pdf-parse');
  } catch (err) {
    throw err;
  }
}

console.log('pdfParseImpl type:', typeof pdfParseImpl);
try { console.log('pdfParseImpl keys:', Object.keys(pdfParseImpl)); } catch(e) { console.log('pdfParseImpl keys error', e && e.message);} 

async function parsePdf(dataBuffer, options) {
  if (typeof pdfParseImpl === 'function') {
    return await pdfParseImpl(dataBuffer, options);
  }

  if (pdfParseImpl && typeof pdfParseImpl.PDFParse === 'function') {
    const Candidate = pdfParseImpl.PDFParse;
    const inst = new Candidate(dataBuffer, options);
    if (inst && typeof inst.parse === 'function') {
      return await inst.parse();
    }
    if (inst && typeof inst.then === 'function') {
      return await inst;
    }
    return inst;
  }

  if (pdfParseImpl && typeof pdfParseImpl.default === 'function') {
    return await pdfParseImpl.default(dataBuffer, options);
  }

  throw new Error('Unsupported pdf-parse module shape');
}

connectDB();
const cache = new NodeCache({
  stdTTL: 300, // Cache for 5 minutes
});
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Backend Working");
});

app.use((req, res, next) => {
  console.log("Request:", req.method, req.url);
  next();
});

app.post(
  "/api/resume/analyze",
  authMiddleware,
  // Protect endpoint from bursts per IP
  rateLimit({
    windowMs: parseInt(process.env.ANALYZE_RATE_WINDOW_MS || '60000', 10), // 1 minute
    max: parseInt(process.env.ANALYZE_RATE_MAX || '6', 10), // limit each IP to 6 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  }),
  upload.single("resume"),
  async (req, res) => {

  console.log(req.file);

  const dataBuffer = fs.readFileSync(req.file.path);

  const ext = path.extname(req.file.originalname || '').toLowerCase();
  const header = dataBuffer.slice(0,4).toString();
  const isPdf = header === '%PDF';
  let resumeText = '';

  try {
    if (isPdf || ext === '.pdf' || req.file.mimetype === 'application/pdf') {
      const pdfData = await parsePdf(dataBuffer);
      console.log("pdfData =", pdfData);
      resumeText = (pdfData && pdfData.text) ? pdfData.text.toLowerCase() : '';
    } else if (ext === '.docx' || req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      if (!mammoth) {
        return res.status(500).json({ message: 'DOCX parsing not available; install mammoth.' });
      }
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      resumeText = (result && result.value) ? result.value.toLowerCase() : '';
      console.log('docx text length:', resumeText.length);
    } else {
      return res.status(400).json({ message: 'Unsupported file type. Please upload PDF or DOCX.' });
    }
  } catch (err) {
    console.error('Error parsing uploaded file:', err && (err.stack || err.message || err));
    return res.status(500).json({
  success: false,
  message: "Failed to parse uploaded file."
});
  } finally {
    try { fs.unlinkSync(req.file.path); } catch (e) { }
  }

  console.log("resumeText =", resumeText);

const cacheKey = resumeText;

const cachedResult = cache.get(cacheKey);

if (cachedResult) {
  console.log("Serving from cache...");
  return res.json(cachedResult);
}
  const skillsMap = {
  html: ["html"],
  css: ["css"],
  javascript: ["javascript", "java script", "js"],
  typescript: ["typescript", "ts"],
  react: ["react"],
  angular: ["angular"],
  vue: ["vue"],
  "node.js": ["node.js", "node", "nodejs"],
  express: ["express"],
  mongodb: ["mongodb", "mongo"],
  mysql: ["mysql"],
  postgresql: ["postgresql", "postgres"],
  sql: ["sql"],
  python: ["python"],
  java: ["java"],
  c: [" c ", "c language"],
  "c++": ["c++"],
  csharp: ["c#", "csharp"],
  django: ["django"],
  flask: ["flask"],
  git: ["git"],
  github: ["github"],
  docker: ["docker"],
  aws: ["aws", "amazon web services"],
  firebase: ["firebase"],
  bootstrap: ["bootstrap"],
  tailwind: ["tailwind"],
  figma: ["figma"],
  communication: ["communication"],
  leadership: ["leadership"],
  teamwork: ["teamwork"],
  problemSolving: ["problem solving", "problem-solving"]
};

  const detectedSkills = Object.keys(skillsMap).filter((skill) =>
    skillsMap[skill].some((variant) => resumeText.includes(variant))
  );

  const missingSkills = Object.keys(skillsMap).filter(
    (skill) => !detectedSkills.includes(skill)
  );

  const totalSkills = Object.keys(skillsMap).length || 1;
  const score = Math.round((detectedSkills.length / totalSkills) * 100);

  let aiSuggestions = "";

try {
  aiSuggestions = await getCareerSuggestions(resumeText);

// Remove ```json and ``` if Gemini returns them
aiSuggestions = aiSuggestions
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

} catch (error) {
  console.log("Gemini Error:", error.message);
  // User-friendly message based on error type
  if (error.message.includes("429") || error.message.includes("quota")) {
    aiSuggestions = "⚠️ AI suggestions temporarily unavailable (quota limit reached). Your resume has been analyzed with ATS score and skills detected. Gemini quota will reset soon.";
  } else if (error.message.includes("503")) {
    aiSuggestions = "⚠️ AI service temporarily down. Please try again in a moment.";
  } else {
    aiSuggestions = "⚠️ AI suggestions unavailable. Your resume analysis is complete.";
  }
}

  const history = new ResumeHistory({
  userId: req.user.id,
  fileName: req.file.originalname,
  score,
  detectedSkills,
  missingSkills,
});

await history.save();

  const resume = new Resume({
  userId: "687000000000000000000001", // Temporary value
  fileName: req.file.originalname,
  score,
  detectedSkills,
  missingSkills
});

await resume.save();

const result = {
  success: true,
  message: "Resume analyzed successfully",
  score,
  detectedSkills,
  missingSkills,
  aiSuggestions
};

cache.set(cacheKey, result);

res.json(result);

});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Internal Server Error"
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});