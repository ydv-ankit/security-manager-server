# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./

RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

RUN ls -la

CMD ["node", "./dist/index.js"]