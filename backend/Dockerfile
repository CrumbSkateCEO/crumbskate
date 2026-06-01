# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for TypeScript)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# --- Stage 2: Production ---
FROM node:20-alpine AS production

WORKDIR /app

# Copy only package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy compiled JavaScript from the builder stage
COPY --from=builder /app/dist ./dist

# Copy existing uploads if any
COPY --from=builder /app/uploads ./uploads

# Expose the application port
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/index.js"]
