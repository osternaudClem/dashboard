FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Generate Prisma client and build the application
RUN npx prisma generate
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the Next.js production server
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]