// Mock database for reported scams in memory (will be connected to actual DB later)
const mockReports = [
  {
    id: '1',
    url: 'http://scammy-bank-update.xyz/login',
    description: 'Phishing website mimicking bank login page.',
    type: 'phishing',
    riskScore: 0.95,
    status: 'verified',
    reportedAt: new Date(Date.now() - 3600000 * 24).toISOString() // 24 hours ago
  },
  {
    id: '2',
    url: 'http://free-lottery-gift.com',
    description: 'Suspicious lottery win page requesting credit card information.',
    type: 'lottery_fraud',
    riskScore: 0.88,
    status: 'verified',
    reportedAt: new Date(Date.now() - 3600000 * 6).toISOString() // 6 hours ago
  }
];

/**
 * @desc    Check if a text, URL, or image is a scam
 * @route   POST /api/scams/check
 * @access  Public
 */
export const checkScam = async (req, res, next) => {
  try {
    const { type, content } = req.body;

    if (!type || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both type (url, text, image) and content.'
      });
    }

    console.log(`[Scam Check] Analyzing content of type '${type}'`);

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/predict';
    let prediction = null;
    let usedFallback = false;

    // Attempt to request predictions from Parth & Pushkar's AI service
    try {
      const response = await fetch(aiServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content }),
        signal: AbortSignal.timeout(4000) // 4s timeout
      });

      if (response.ok) {
        const data = await response.json();
        prediction = data;
        console.log('[Scam Check] AI Integration response received.');
      } else {
        throw new Error(`AI Service returned status ${response.status}`);
      }
    } catch (err) {
      console.warn(`[Scam Check] AI service is unreachable or returned error: ${err.message}. Using rule-based fallback.`);
      usedFallback = true;
      
      // Rule-based mock model fallback
      let riskScore = 0.1;
      let reasons = ['No obvious scam indicators found.'];
      const contentLower = String(content).toLowerCase();

      if (type === 'url') {
        if (contentLower.includes('free-') || contentLower.includes('win-') || contentLower.includes('lottery') || contentLower.includes('verify-account') || contentLower.includes('update-bank')) {
          riskScore = 0.85;
          reasons = ['URL contains common scam keywords (e.g. free, lottery, verify-account).'];
        } else if (!contentLower.startsWith('https://')) {
          riskScore = 0.5;
          reasons = ['URL does not use HTTPS encryption.'];
        }
      } else if (type === 'text') {
        if (contentLower.includes('lottery') || contentLower.includes('won') || contentLower.includes('claim prize') || contentLower.includes('credit card') || contentLower.includes('bank details') || contentLower.includes('otp')) {
          riskScore = 0.9;
          reasons = ['Text contains keywords asking for sensitive details (OTP, lottery, won, credit card).'];
        }
      }

      prediction = {
        riskScore,
        isScam: riskScore >= 0.7,
        confidence: 0.8,
        classification: riskScore >= 0.7 ? 'scam' : 'safe',
        reasons
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        type,
        content,
        analysis: prediction,
        usedFallback
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit a new scam report
 * @route   POST /api/scams/report
 * @access  Public (or Protected later)
 */
export const reportScam = async (req, res, next) => {
  try {
    const { url, description, type } = req.body;

    if (!url || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide url, description, and type of the scam.'
      });
    }

    // Determine initial risk score using a basic check or mock
    const riskScore = url.includes('free') || description.includes('fake') ? 0.9 : 0.75;

    const newReport = {
      id: String(mockReports.length + 1),
      url,
      description,
      type,
      riskScore,
      status: 'pending',
      reportedAt: new Date().toISOString()
    };

    mockReports.unshift(newReport); // Add to the top of list
    console.log(`[Scam Report] New scam report added for URL: ${url}`);

    return res.status(201).json({
      success: true,
      message: 'Scam report submitted successfully.',
      data: newReport
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all scam reports
 * @route   GET /api/scams/reports
 * @access  Public
 */
export const getScamReports = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      count: mockReports.length,
      data: mockReports
    });
  } catch (error) {
    next(error);
  }
};
