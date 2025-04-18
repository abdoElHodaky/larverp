FROM openswoole/swoole:22.1-php8.1-alpine
RUN apk add -U --no-cache nghttp2-dev nodejs npm unzip tzdata
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

COPY . /var/www/html
WORKDIR /var/www/html
# Laravel config
ENV APP_KEY base64:Zndza2ttMm9kbnNkcmlmeHlmYnlnb3RzOTJxMnBnNHY=
ENV APP_ENV production
ENV APP_DEBUG true
ENV LOG_CHANNEL stderr
ENV APP_URL 0.0.0.0

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV NODEJS_ALLOW_SUPERUSER 1
ENV NPM_ALLOW_SUPERUSER 1
ENV YARN_ALLOW_SUPERUSER 1
ENV NPX_ALLOW_SUPERUSER 1
ENV OCTANE_SERVER roadrunner
#RUN echo 'pm.max_children = 15' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
#echo 'pm.max_requests = 500' >> /usr/local/etc/php-fpm.d/zz-docker.conf
RUN chmod -R 777 . && composer install &&\
composer require laravel/octane && npm install workbox-window --save
RUN yes | php artisan octane:install --server=swool
RUN npm run build && php artisan storage:link

CMD ["php artisan octane:start","--workers=4","--server=swool","--port=8080"]
