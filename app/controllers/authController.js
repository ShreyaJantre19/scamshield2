/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    console.log(`[Auth Register] Registering new user: ${email}`);

    // Create a mock token
    const mockToken = `mock-jwt-token-for-${Buffer.from(email).toString('base64')}`;

    return res.status(201).json({
      success: true,
      token: mockToken,
      user: {
        id: 'user_101',
        name,
        email,
        role: 'user'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    console.log(`[Auth Login] Login attempt for: ${email}`);

    // Simple password mock check
    if (password.length < 6) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Create a mock token
    const mockToken = `mock-jwt-token-for-${Buffer.from(email).toString('base64')}`;

    return res.status(200).json({
      success: true,
      token: mockToken,
      user: {
        id: 'user_101',
        name: email.split('@')[0],
        email,
        role: 'user'
      }
    });
  } catch (error) {
    next(error);
  }
};
