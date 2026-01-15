# 1. Base image (match Prisma + Node requirement)
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first
COPY package*.json ./
COPY prisma ./prisma/

# 4. Install dependencies
RUN npm install

# 5. Copy rest of the worker code
COPY . .

# 6. Generate Prisma Client (uses the copied schema)
RUN npm run generate

# 7. Build TypeScript
RUN npm run build

# 8. Run the worker
CMD ["node", "dist/publish.worker.js"]
