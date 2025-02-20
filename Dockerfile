# Use Node.js as the base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire project
COPY . .

# Set environment variable (or pass it via docker run)
ARG VITE_BASE_URL
ENV VITE_BASE_URL=${VITE_BASE_URL}

# Build the React app
RUN npm run build

# Serve the build using Nginx
FROM nginx:alpine AS production

# Copy built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
