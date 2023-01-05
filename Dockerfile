FROM node:16-alpine as builder

ENV NODE_ENV build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build && yarn install --production

FROM node:16-alpine

ENV NODE_ENV production

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/

CMD ["yarn", "start:prod"]
