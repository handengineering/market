FROM cypress/base:16.14.2-slim
WORKDIR /myapp
COPY package.json package-lock.json ./
RUN npm ci