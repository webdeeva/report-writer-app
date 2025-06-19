FROM node:18-slim

# Install Python and WeasyPrint dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-cffi \
    python3-brotli \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libharfbuzz0b \
    libpangocairo-1.0-0 \
    libcairo2 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

# Install WeasyPrint
RUN pip3 install --no-cache-dir weasyprint

# Set working directory
WORKDIR /workspace/report-writer-new/server

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Set environment variable to indicate WeasyPrint is available
ENV WEASYPRINT_AVAILABLE=true

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]