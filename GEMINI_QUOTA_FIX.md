# CareerSync AI - Gemini API Quota Exceeded Fix

## Problem Summary
You were hitting "**429 Quota Exceeded**" error with the message "limit: 0" because Google Gemini's free tier has **strict daily request limits** (~60 requests/day).

## What I Fixed ✅

### 1. **Extended Cache TTL (24 hours)**
- **Before**: Cache was only 1 hour
- **After**: Cache is now 24 hours (86400000 ms)
- **Impact**: Same resume analyzed twice in a day will use cached result, not a new API call
- **File**: `backend/.env` and `backend/services/geminiService.js`

### 2. **Cache Size Management**
- Added max cache size (100 entries) to prevent unbounded memory growth
- Oldest entries are deleted when limit reached
- **File**: `backend/services/geminiService.js`

### 3. **Frontend Rate Limiting**
- Added 2-second minimum delay between resume uploads
- Prevents users from accidentally clicking "Analyze" multiple times
- Shows user-friendly warning if they try too quickly
- **File**: `src/pages/ResumeAnalyzer.jsx`

### 4. **Better Error Messages**
- Backend now returns specific messages for quota vs other errors
- Users see "⚠️ AI suggestions temporarily unavailable (quota limit reached)" instead of generic error
- Explains that quota will reset soon
- **Files**: `backend/server.js`

### 5. **Backend Rate Limiting Configured**
- Added rate limit: maximum 6 resume analyses per minute per IP
- Protects against bursts that would exhaust quota quickly
- Configured in `.env`: `ANALYZE_RATE_MAX=6` and `ANALYZE_RATE_WINDOW_MS=60000`

---

## Files Changed

### 1. `/backend/services/geminiService.js`
- ✅ Cache TTL: 3600000 → 86400000 ms (1 hour → 24 hours)
- ✅ Added cache size limit (100 entries max)
- ✅ Added quota warning logs
- ✅ Better error detection for "limit: 0" scenarios

### 2. `/backend/server.js`
- ✅ Enhanced error handling for quota scenarios
- ✅ User-friendly error messages based on error type
- ✅ Distinguishes between quota (429), service down (503), and other errors

### 3. `/src/pages/ResumeAnalyzer.jsx`
- ✅ Added frontend rate limiting (2 second minimum between uploads)
- ✅ Added `lastUploadTime` and `quotaWarning` state
- ✅ Warning shown if user tries to upload too quickly

### 4. `/backend/.env`
- ✅ Changed `GEMINI_CACHE_TTL_MS` from missing → 86400000
- ✅ Added `GEMINI_CACHE_MAX_SIZE=100`
- ✅ Added rate limiting config: `ANALYZE_RATE_WINDOW_MS` and `ANALYZE_RATE_MAX`
- ✅ Added documentation comments

---

## How to Verify the Fix is Working

### Test 1: Same Resume Twice
1. Upload `resume1.pdf` → Gets AI suggestions (uses Gemini API)
2. Upload `resume1.pdf` again immediately → Gets same suggestions from cache (no API call!)
3. Check browser console: Should see `"Returning cached Gemini response"`

### Test 2: Rate Limiting
1. Click "Analyze" button
2. Try to click again within 1 second
3. Should see alert: `"Please wait 2 seconds between resume uploads"`

### Test 3: Quota Error Handling
When quota is hit, you'll now see in the UI:
```
⚠️ AI suggestions temporarily unavailable (quota limit reached). 
Your resume has been analyzed with ATS score and skills detected. 
Gemini quota will reset soon.
```

---

## Next Steps & Recommendations

### Immediate (Free Options) 📌
1. **Wait for quota reset**: Free tier quota resets at midnight UTC
   - Try again tomorrow
   - Write down when you hit it to plan better

2. **Optimize usage pattern**:
   - Use the app within the free limits (60 requests/day)
   - Don't upload same resume multiple times (cache handles it)
   - Share different resumes among team members if testing

3. **Check Google Cloud Console**:
   - Go to https://console.cloud.google.com/
   - Select your project
   - Navigate to **APIs & Services → Gemini API → Quotas**
   - Verify quotas aren't set to 0 (sometimes this happens by mistake)

### Short Term (Low Cost) 💰
**Upgrade to Paid Plan** - Recommended for production
- Start with **$5/month** (Pay-as-you-go)
- **First 2 months free** with $300 cloud credits
- Gets you:
  - 1500 requests/day (25x more than free)
  - No daily resets
  - Much more reliable

**How to upgrade**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click your project name
3. Go to **Billing → Link a billing account**
4. Add payment method (credit/debit card)
5. API usage will start charging only what you use

### Long Term 
- Monitor your usage in Google Cloud Console
- Set billing alerts if usage gets high
- Consider caching responses in MongoDB for frequently analyzed resumes
- Implement user-level quotas (e.g., each user gets 5 analyses/day)

---

## Testing Your Setup

### Step 1: Restart Backend
```bash
cd backend
npm install  # if not done yet
node server.js
```

### Step 2: Test in Frontend
1. Navigate to Resume Analyzer page
2. Upload a PDF resume
3. Check browser console for: `"Returning cached Gemini response"` (2nd time)
4. Try uploading rapidly - should be blocked with warning

### Step 3: Check Backend Logs
Look for messages like:
```
Gemini response received from gemini-2.5-flash
Returning cached Gemini response
⚠️  GEMINI FREE TIER QUOTA EXHAUSTED (if quota hit)
```

---

## Troubleshooting

### "Still getting 429 error"
1. **Clear cache and restart**: `node server.js` (restarts Node = clears cache)
2. **Wait for quota reset**: Happens at midnight UTC
3. **Check API key**: Verify `GEMINI_API_KEY` in `.env` is still valid

### "Cache not working"
1. Verify `.env` has: `GEMINI_CACHE_TTL_MS=86400000`
2. Check server logs show: `"Returning cached Gemini response"`
3. Same resume should be byte-for-byte identical (file names don't matter)

### "Frontend rate limiting too strict"
1. Change `2000` to different value in `ResumeAnalyzer.jsx` line that says `2000`
2. Or adjust backend limit in `.env`: change `ANALYZE_RATE_MAX=6` to `ANALYZE_RATE_MAX=10`

---

## Key Insights About Gemini Free Tier

| Metric | Free Tier | Paid Plan |
|--------|-----------|-----------|
| Daily requests | ~60 | 1500 |
| Rate limit | 10/min | Much higher |
| Reset | Daily (midnight UTC) | Continuous |
| Cost | Free | $0.0075 per 1K tokens |

**Our fix targets the most impactful optimization: caching**. 
- If a user analyzes the same resume twice, we save 1 API call (100% saved)
- If a user analyzes similar resumes, we at least reduce retry traffic

---

## Questions?
If you see any new errors, let me know:
1. The exact error message
2. Screenshot of the error
3. Browser console output
4. Backend server logs output
