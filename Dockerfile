# 1. Use a lightweight, official Node.js image
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy only package files first to cache dependencies
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your application code
COPY . .

# 6. Generate the Prisma Client for this specific Linux container
RUN npx prisma generate

# 7. Expose the port the app runs on
EXPOSE 3000

# 8. Start command: Push the DB schema, then start the Express server
CMD npx prisma db push && node src/server.js