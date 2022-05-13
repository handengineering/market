FROM cypress/base:16.14.2-slim
USER node
WORKDIR /myapp
COPY package.json package-lock.json ./
RUN npm ci