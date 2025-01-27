FROM node:18

RUN apt-get update && apt-get install -y curl

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

COPY . .

RUN npm install -g pnpm && pnpm install 

# EXPOSE 3000

CMD ["pnpm", "start"]