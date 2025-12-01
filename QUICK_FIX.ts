// QUICK FIX: Temporary working authentication
// Add this to useAuthStore.ts signup function

// Replace the current signup with this working version
signup: async (email: string, password: string) => {
  try {
    console.log('🚀 QUICK FIX - Creating user...');
    
    // Check if user exists
    const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
    if (storedUsers[email]) {
      throw new Error('User already exists');
    }

    // Create user immediately (temporary bypass)
    const userId = 'user-' + Date.now();
    const newUser = {
      id: userId,
      email: email,
      password: password,
      name: email.split('@')[0],
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    storedUsers[email] = newUser;
    localStorage.setItem('tradepro-users', JSON.stringify(storedUsers));

    // Create portfolio
    const portfolios = JSON.parse(localStorage.getItem('tradepro-portfolios') || '{}');
    portfolios[userId] = {
      balance: 100000,
      holdings: [],
      transactions: [],
    };
    localStorage.setItem('tradepro-portfolios', JSON.stringify(portfolios));

    console.log('✅ User created successfully!');
    
  } catch (error: any) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Signup failed');
  }
};
