FROM node:20-alpine
ENV PORT 8080
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
CMD [ "npm", "run", "serve" ]