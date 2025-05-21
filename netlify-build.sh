#!/bin/bash

# Ensure we're using the right Node.js version
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
npm ci

# Build the project
npm run build
