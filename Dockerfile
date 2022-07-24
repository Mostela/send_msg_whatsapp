FROM node:17
WORKDIR sending
RUN apt update && apt install -y libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2
ADD package.json .
RUN yarn
COPY . .
ENTRYPOINT yarn start
