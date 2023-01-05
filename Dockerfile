FROM node:16-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .
RUN yarn build && yarn install --production

FROM node:16-alpine

ENV NODE_ENV production

USER node
WORKDIR /app

COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/yarn.lock ./
COPY --from=builder --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/dist/ ./dist/

CMD ["yarn", "start:prod"]
