FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the Railway default port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
