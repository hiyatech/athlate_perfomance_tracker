const authService = require('./auth.service');

// Handle user signup request
async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const result = await authService.signupUser({ name, email, password });
    res.status(201).json({
      message: 'Signup successful',
      token: result.token,
      user: {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Handle user login request
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const result = await authService.loginUser(email, password);
    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Handle user logout request
async function logout(req, res) {
  res.status(200).json({ message: 'Logged out successfully' });
}

// Handle get current logged in user profile
async function getMe(req, res) {
  try {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = {
  signup,
  login,
  logout,
  getMe
};
