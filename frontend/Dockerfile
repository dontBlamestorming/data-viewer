FROM node:10 as node

WORKDIR /front

# to avoid installing npm packages when not changed package.json
ADD package.json package.json
RUN npm install --production --quiet

COPY . .

VOLUME /front/build

CMD npm run build

