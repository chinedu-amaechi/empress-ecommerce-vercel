FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire backend application code
COPY . .

# Create a directory for temporary uploads
RUN mkdir -p ./public/temp

# Expose port 5000 (the port your backend uses)
EXPOSE 5000

# Command to run when the container starts
CMD ["npm", "start"]