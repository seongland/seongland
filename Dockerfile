
FROM node:14-buster-slim
LABEL email="sungle3737@gmail.com"
LABEL name="seonglae"

WORKDIR /usr/src/app
RUN adduser -D seonglae && chown -R seonglae /usr/src/app

ARG GOOGLE_APPLICATION_CREDENTIALS
ARG GCLOUD_PROJECT
ARG FIREBASE_COLLECTION_IMAGES
ARG NOTION_API_AUTH_TOKEN

COPY * ./
COPY src ./src/
COPY lib ./lib/
COPY scripts ./scripts/
COPY public ./public/

USER seonglae

RUN npm i -g pnpm
RUN pnpm i
EXPOSE 8888

CMD [ "pnpm", "dev" ]