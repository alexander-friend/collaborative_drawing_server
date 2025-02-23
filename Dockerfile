FROM node:20-alpine
ENV NODE_ENV production
ENV port 8080
WORKDIR /app
COPY package*.json .
RUN npm install --omity=dev
COPY . .
CMD [ "npm", "start" ]