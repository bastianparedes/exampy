FROM node:20.15.0

RUN mkdir -p /app
WORKDIR /app

COPY . /app
RUN npm ci

CMD [ "npm", "run", "dev" ]
