FROM node:18-alpine

# Install live-server for serving static files
RUN npm install -g live-server

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the server
CMD ["live-server", "--port=8080", "--host=0.0.0.0", "--no-browser"]
