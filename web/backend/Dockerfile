FROM node:alpine

ARG DB_USER=web
ENV DB_USER=${DB_USER}

ARG DB_NAME=trtl
ENV DB_NAME=${DB_NAME}

ARG DB_PASSWORD=98765
ENV DB_PASSWORD=${DB_PASSWORD}

ARG DB_HOST=db-nodes-and-pools
ENV DB_HOST=${DB_HOST}

ARG DB_PORT=5432
ENV DB_PORT=${DB_PORT}

WORKDIR /home/node

COPY . .
COPY ./wait-for-postgres.sh .

#create .env file
RUN apk add --no-cache postgresql-client && \
    echo $'DB_USER='${DB_USER}$'\n\
    DB_NAME='${DB_NAME}$'\n\
    DB_PASSWORD='${DB_PASSWORD}$'\n\
    DB_HOST='${DB_HOST}$'\n\
    DB_PORT='${DB_PORT}$'' >> .env && \
    chmod +x /home/node/wait-for-postgres.sh && \
    npm install && \
    npm install pm2 -g

EXPOSE 3030

CMD ./wait-for-postgres.sh ${DB_HOST} ${DB_PORT} ${DB_USER} ${DB_PASSWORD} ${DB_NAME} pm2-runtime start config/ecosystem.config.js