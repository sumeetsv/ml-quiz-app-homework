# Use the official Node.js image as the base
FROM node:21.7.3

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files into the container
COPY . .

# Expose the port that your app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
