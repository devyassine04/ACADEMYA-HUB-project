# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port (using 3000 to match our fix)
EXPOSE 3000

# Start development server with host binding
CMD ["npm", "run", "dev", "--", "--port", "3000", "--host"]
