import app from './app.js';
import env from './env.js';
import { validateEnv, connectDB } from './src/config/database.js';

// Validate .env variables before init the app
validateEnv();

const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database initialized successfully');

    const PORT = env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`✅🚀 Server running on port ${PORT}: ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('❌Error starting server', error);
    process.exit(1);
  }
};

startServer();
