const { execSync } = require('child_process');
console.log('Building without TypeScript type checking...');
try {
  // Skip the TypeScript compilation step and go straight to Vite build
  execSync('vite build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
