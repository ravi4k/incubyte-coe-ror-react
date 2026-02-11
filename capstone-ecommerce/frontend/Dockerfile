# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_GRAPHQL_URL=http://localhost:3000/graphql
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL

RUN npm run build

# Production stage - serve with a simple static server
FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
