const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require('path');
let mammoth;
try { mammoth = require('mammoth'); } catch (e) { mammoth = null; }
// Try the installed package normally; if the backend-local package is ESM-only
// and blocks subpath access, fall back to the workspace root implementation.
let pdfParseImpl;
// Prefer the workspace root implementation (older CJS-friendly release)
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
  // Function-style export (older versions)
  if (typeof pdfParseImpl === 'function') {
    return await pdfParseImpl(dataBuffer, options);
  }

  // ESM/CJS package that exposes a PDFParse class
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

  // Common fallback: try default export
  if (pdfParseImpl && typeof pdfParseImpl.default === 'function') {
    return await pdfParseImpl.default(dataBuffer, options);
  }

  throw new Error('Unsupported pdf-parse module shape');
}

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Backend Working");
});

app.post("/api/resume/analyze", upload.single("resume"), async (req, res) => {

  console.log(req.file);

  const dataBuffer = fs.readFileSync(req.file.path);

  // Determine file type by inspecting file bytes and extension/mimetype
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
    return res.status(500).json({ message: 'Failed to parse uploaded file.' });
  } finally {
    // cleanup uploaded file
    try { fs.unlinkSync(req.file.path); } catch (e) { }
  }

  console.log("resumeText =", resumeText);
  // more robust skill matching with common variants
  const skillsMap = {
    html: ["html"],
    css: ["css"],
    javascript: ["javascript", "js"],
    react: ["react"],
    "node.js": ["node.js", "node", "nodejs"],
    express: ["express"],
    mongodb: ["mongodb", "mongo"],
    git: ["git"],
    github: ["github"],
    python: ["python"],
    java: ["java"],
    sql: ["sql", "mysql", "postgres", "postgresql"]
  };

  const detectedSkills = Object.keys(skillsMap).filter((skill) =>
    skillsMap[skill].some((variant) => resumeText.includes(variant))
  );

  const missingSkills = Object.keys(skillsMap).filter(
    (skill) => !detectedSkills.includes(skill)
  );

  const totalSkills = Object.keys(skillsMap).length || 1;
  const score = Math.round((detectedSkills.length / totalSkills) * 100);

  res.json({
    score,
    detectedSkills,
    missingSkills
  });

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});