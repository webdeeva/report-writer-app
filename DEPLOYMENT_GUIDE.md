# DigitalOcean Deployment Guide

## Prerequisites
- DigitalOcean account
- API token (already configured in MCP)
- doctl CLI (already installed)

## Option 1: Deploy using DigitalOcean App Platform (Recommended)

### Step 1: Authenticate with DigitalOcean
```bash
doctl auth init
# Paste your token when prompted
```

### Step 2: Create the app
```bash
cd deployment-ready
doctl apps create --spec ../app.yaml
```

### Step 3: Configure environment variables
After creation, update the environment variables in the DigitalOcean dashboard:
- JWT_SECRET: Generate a secure random string
- OPENAI_API_KEY: Your OpenAI API key
- ADMIN_USERNAME: Choose an admin username
- ADMIN_PASSWORD: Choose a secure password

## Option 2: Deploy via GitHub Integration

1. Push this deployment-ready folder to a GitHub repository
2. In DigitalOcean App Platform:
   - Click "Create App"
   - Choose "GitHub" as source
   - Select your repository
   - Use these settings:
     - **Component 1 - Static Site (Client)**:
       - Source Directory: `/report-writer-new/client`
       - Build Command: `npm install && npm run build`
       - Output Directory: `dist`
     - **Component 2 - Web Service (Server)**:
       - Source Directory: `/report-writer-new/server`
       - Build Command: `npm install`
       - Run Command: `npm start`
       - HTTP Port: 8080
       - HTTP Route: `/api`

## Option 3: Deploy using MCP (Claude Code)

Since you have the DigitalOcean MCP configured, we can use it to:
1. Create the app
2. Configure environment variables
3. Deploy the code

## Environment Variables Required

```env
# Server
NODE_ENV=production
PORT=8080
JWT_SECRET=<generate-secure-random-string>
OPENAI_API_KEY=<your-openai-api-key>
ADMIN_USERNAME=<choose-admin-username>
ADMIN_PASSWORD=<choose-secure-password>
DATABASE_FILE=./data/database.json
PDF_OUTPUT_DIR=output

# Client
VITE_API_URL=https://<your-app-name>.ondigitalocean.app
```

## Post-Deployment Steps

1. Test the deployment:
   - Visit: https://<your-app-name>.ondigitalocean.app
   - Login with admin credentials
   - Create a test report

2. Monitor the app:
   ```bash
   doctl apps logs <app-id> --follow
   ```

3. Scale if needed:
   ```bash
   doctl apps update <app-id> --spec app.yaml
   ```