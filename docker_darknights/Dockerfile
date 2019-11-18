FROM nginx:1.11.10-alpine 

ENV TZ 'Asia/Shanghai'


RUN apk upgrade --no-cache \
    && apk add --no-cache bash git \
    && rm -rf /usr/share/nginx/html \ 
    && git clone https://github.com/IORI20091101/darknights.me.git /usr/share/nginx/html \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && rm -rf /var/cache/apk/* 


ADD entrypoint.sh /entrypoint.sh

WORKDIR /usr/share/nginx/html

CMD ["/entrypoint.sh"]
