# DigitalOcean App Platform Deployment Steps

## Your GitHub Repository
- **URL**: https://github.com/webdeeva/report-writer-app
- **Branch**: main

## Step 1: Connect GitHub to DigitalOcean
1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Choose "GitHub" as your source
4. Authorize DigitalOcean to access your GitHub account
5. Select the repository: `webdeeva/report-writer-app`
6. Select branch: `main`

## Step 2: Configure App Components

### Component 1: API Service (Backend)
- **Type**: Web Service
- **Source Directory**: `/report-writer-new/server`
- **Build Command**: `npm install`
- **Run Command**: `npm start`
- **HTTP Port**: 8080
- **HTTP Route**: `/api`
- **Instance Size**: Basic XXS ($5/month)

### Component 2: Static Site (Frontend)
- **Type**: Static Site
- **Source Directory**: `/report-writer-new/client`
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dist`
- **Routes**: `/`

## Step 3: Environment Variables

### For the API Service:
```
NODE_ENV=production
PORT=8080
DATABASE_FILE=./data/database.json
PDF_OUTPUT_DIR=output
JWT_SECRET=[generate a secure random string]
OPENAI_API_KEY=[your OpenAI API key]
ADMIN_USERNAME=[choose an admin username]
ADMIN_PASSWORD=[choose a secure password]
```

### For the Static Site:
```
VITE_API_URL=${APP_URL}
```

## Step 4: Deploy
1. Review the configuration
2. Click "Create Resources"
3. Wait for the build and deployment to complete (5-10 minutes)

## Step 5: Post-Deployment
1. Your app will be available at: `https://report-writer-<random-string>.ondigitalocean.app`
2. Visit the URL and login with your admin credentials
3. Create a test report to verify everything works

## Alternative: Use the CLI

Once you've connected GitHub to DigitalOcean through the web interface, you can use the CLI:

```bash
# Create the app
doctl apps create --spec app.yaml

# List your apps
doctl apps list

# Get app details
doctl apps get <app-id>

# Update environment variables
doctl apps update <app-id> --spec app.yaml

# View logs
doctl apps logs <app-id> --follow
```

## Troubleshooting

If you encounter issues:
1. Check the deployment logs in DigitalOcean dashboard
2. Verify all environment variables are set correctly
3. Ensure the OpenAI API key is valid
4. Check that the build commands complete successfully

## Cost Estimate
- Basic XXS instance: $5/month
- Static site hosting: Free
- Total: ~$5/month