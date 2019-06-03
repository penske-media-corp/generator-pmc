ARG PHP_VERSION
ARG WEB_ROOT
ARG WORDPRESS_VERSION

FROM "wordpress:${WORDPRESS_VERSION}-php${PHP_VERSION}-fpm-alpine"

# @NOTE: Soap is installed because of legacy pmc code in pmc-plugins
RUN apk add --update --no-cache libxml2-dev \
&& docker-php-ext-install soap \
&& mkdir -p ${WEB_ROOT}/wp-content/uploads \
&& chown -R www-data:www-data "${WEB_ROOT}/wp-content/uploads"

