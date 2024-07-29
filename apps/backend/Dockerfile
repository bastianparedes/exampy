FROM node:20.15.0

RUN mkdir -p /app
WORKDIR /app

# RUN npm i -g @nestjs/cli

COPY . /app
RUN npm ci

CMD [ "npm", "run", "start:dev" ]
