import app from './app.js';
import env from './env.js';

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}: ${env.NODE_ENV} mode`);
});
