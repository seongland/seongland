FROM node:16-alpine as build
WORKDIR /app

# args
ARG GIT_TAG

# clone
RUN apk --no-cache --virtual build-dependencies add git
RUN git clone -b $GIT_TAG https://$GIT_TOKEN@github.com/seongland/seongland .
RUN rm -r .git

# install
RUN npm i -g pnpm
RUN pnpm i
RUN pnpm build
RUN pnpm i --prod

# main image
FROM node:16-alpine
COPY --from=build /app /app
WORKDIR /app

# make user
RUN adduser seongland -D -H
RUN chown -R seongland /app
USER seongland

# meta
RUN npm i -g pnpm
EXPOSE 1234
CMD [ "pnpm", "start" ]
