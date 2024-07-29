FROM node:20.15.0

RUN mkdir -p /app
WORKDIR /app

RUN npm install -g @angular/cli

COPY . /app
RUN npm ci

CMD ["npm", "run", "start", "--", "--proxy-config", "proxy.config.json", "--host", "0.0.0.0", "--poll=1000"]
