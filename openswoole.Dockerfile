FROM openswoole/swoole:22.1.2-php8.1-alpine
RUN apk add -U --no-cache nghttp2-dev nodejs npm unzip tzdata
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

COPY . /var/www/html
WORKDIR /var/www/html

# Laravel config
ENV APP_KEY base64:B6l/H5fSpR60Y+MpcKP22Z1B4Us7adD+jJrln8XOcpQ=
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
RUN chmod 777 ./*
RUN composer install && composer require laravel/octane  &&\
npm install && \
yes | php artisan octane:install --server=swoole &&\
php artisan livewire:publish --assets && php artisan vendor:publish --tag=laravel-assets --ansi --force


CMD ["php artisan octane:start","--workers=4","--server=swoole","--port=82"]
