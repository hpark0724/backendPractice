FROM node:18-alpine

WORKDIR /app

COPY package.json ./

COPY . .

RUN npm install -g pnpm && pnpm install 

# EXPOSE 3000

CMD ["pnpm", "start"]