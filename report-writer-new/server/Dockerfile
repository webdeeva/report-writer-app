FROM node:18

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
    gir1.2-pango-1.0 \
    libxml2 \
    libxml2-dev \
    libxslt1-dev \
    libffi-dev \
    libcairo2 \
    libpango1.0-dev \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

# Install WeasyPrint
RUN pip3 install weasyprint

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]