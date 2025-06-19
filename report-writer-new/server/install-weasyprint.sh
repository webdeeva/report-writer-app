#!/bin/bash
# Install WeasyPrint and its dependencies on Ubuntu

echo "Installing WeasyPrint dependencies..."

# Update package list
apt-get update

# Install Python and pip if not already installed
apt-get install -y python3 python3-pip

# Install WeasyPrint system dependencies
apt-get install -y \
    python3-cffi \
    python3-brotli \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libharfbuzz0b \
    libpangocairo-1.0-0 \
    libcairo2 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info

# Install WeasyPrint
pip3 install weasyprint

# Verify installation
if command -v weasyprint &> /dev/null; then
    echo "WeasyPrint installed successfully"
    weasyprint --version
else
    echo "WeasyPrint installation failed"
    exit 1
fi