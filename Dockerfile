# build stage
FROM node:16-alpine

# Set working directory
WORKDIR /app

COPY . .

RUN yarn

EXPOSE 3000

CMD ["yarn", "start:dev"]
