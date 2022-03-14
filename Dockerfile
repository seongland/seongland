
FROM node:14-buster-slim as build
LABEL email="sungle3737@gmail.com"
LABEL name="seonglae"

WORKDIR /app
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

RUN adduser seongland && chown -R seongland /app
USER seongland

# install
RUN pnpm i --prod
RUN pnpm build

# post
RUN rm .git -r

FROM node:14-alpine
COPY --from=build /app /app
WORKDIR /app
RUN npm i -g pnpm
EXPOSE 8080

CMD [ "pnpm", "start" ]
