
FROM node:14-buster-slim
LABEL email="sungle3737@gmail.com"
LABEL name="seonglae"

WORKDIR /usr/src/app
RUN npm i -g pnpm

ARG GOOGLE_APPLICATION_CREDENTIALS
ARG GCLOUD_PROJECT
ARG FIREBASE_COLLECTION_IMAGES
ARG NOTION_API_AUTH_TOKEN

COPY * ./
COPY src ./src/
COPY lib ./lib/
COPY scripts ./scripts/
COPY public ./public/

RUN adduser seonglae && chown -R seonglae /usr/src/app
USER seonglae

RUN pnpm i
RUN pnpm build
EXPOSE 8080

CMD [ "pnpm", "start" ]