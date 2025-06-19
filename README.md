# Report Writer Deployment

## Quick Start

1. Install dependencies:
   ```bash
   cd report-writer-new/client && npm install
   cd ../server && npm install
   ```

2. Build the client:
   ```bash
   cd client && npm run build
   ```

3. Configure environment:
   - Copy `.env.example` to `.env`
   - Update all configuration values

4. Start the server:
   ```bash
   cd server && npm start
   ```

## DigitalOcean App Platform

This application is ready for deployment on DigitalOcean App Platform with:
- Static site component for the client (build output)
- Service component for the Node.js server
- Environment variables configured through the platform

## Required Environment Variables

- `NODE_ENV`: Set to "production"
- `VITE_API_URL`: Your API endpoint URL
- `JWT_SECRET`: Secure random string for JWT signing
- `OPENAI_API_KEY`: Your OpenAI API key
- `ADMIN_USERNAME`: Initial admin username
- `ADMIN_PASSWORD`: Initial admin password
