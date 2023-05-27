FROM node:19.0.0-buster-slim

RUN mkdir -p /app/services/cyndaquil

WORKDIR /app/services/cyndaquil

COPY ./package.json .

RUN npm install

COPY ./tsconfig.json .

COPY ./src/ ./src/

COPY ./.env ./.env

RUN npm run build

RUN rm -rf \
    node_modules \
    src \
    tsconfig.json

RUN npm install --only=production

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "run", "start"]