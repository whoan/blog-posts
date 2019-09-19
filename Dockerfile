# build stage
FROM node:lts-alpine as build-stage

WORKDIR /app

ADD https://github.com/whoan/vuepress-theme-canvas/archive/master.zip .

RUN \
  unzip master.zip && \
  rm master.zip && \
  mv vuepress-theme-canvas-master .vuepress && \
  cd .vuepress && \
  yarn

COPY config.js .vuepress/
COPY README.md ./
COPY posts/*.md ./

RUN \
  .vuepress/node_modules/.bin/vuepress build && \
  mv .vuepress/dist dist

# production stage
FROM whoan/nginx-static as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
