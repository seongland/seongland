
FROM node:14-buster-slim

WORKDIR /usr/src/app

COPY * ./
COPY src ./src/
COPY lib ./lib/
COPY scripts ./scripts/
COPY public ./public/

ARG GOOGLE_APPLICATION_CREDENTIALS
ARG GCLOUD_PROJECT
ARG FIREBASE_COLLECTION_IMAGES

RUN npm i -g pnpm
RUN pnpm i
RUN pnpm build
EXPOSE 8000

CMD [ "pnpm", "start" ]