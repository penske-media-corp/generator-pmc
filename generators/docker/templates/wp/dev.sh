#!/bin/sh
	#@TODO: add to composer package for vip go setukp

install_memcached() {
echo 'apk add...'
}

install_xdebug() {
	if [ 'dev' == "${APP_ENV}" ]; then
		echo 'dev'
		#@TODO: setup xdebug
		apk update
		apk add php7.2-xdebug
		pecl install -f xdebug
		docker-php-ext-enable xdebug
ENV XDEBUG_PORT 9000
ENV XDEBUG_IDEKEY docker
    pecl install xdebug
    docker-php-ext-enable xdebug
    echo "xdebug.remote_enable=1" >> /usr/local/etc/php/conf.d/xdebug.ini && \
    echo "xdebug.remote_autostart=1" >> /usr/local/etc/php/conf.d/xdebug.ini && \
    echo "xdebug.remote_port=${XDEBUG_PORT}" >> /usr/local/etc/php/conf.d/xdebug.ini && \
    echo "xdebug.idekey=${XDEBUG_IDEKEY}" >> /usr/local/etc/php/conf.d/xdebug.ini
		 XDEBUG_CONFIG: remote_host=host.docker.internal
		# We don't care if we're in dev because this is a dev only image WILL NOT EVER hit prod
		# echo "clear_env = no" >> /etc/php/$PHP_VERSION/fpm/pool.d/www.conf
		# echo "zend_extension=xdebug.so" >> /etc/php/$PHP_VERSION/mods-available/xdebug.ini
		# echo "xdebug.idekey=${XDEBUG_IDEKEY}" >> /etc/php/$PHP_VERSION/mods-available/xdebug.ini
		# echo "xdebug.remote_autostart=${XDEBUG_REMOTE_AUTOSTART}" >> /etc/php/$PHP_VERSION/mods-available/xdebug.ini
		# echo "xdebug.remote_connect_back=${XDEBUG_REMOTE_CONNECT_BACK}" >> /etc/php/$PHP_VERSION/mods-available/xdebug.ini
		# echo "xdebug.remote_enable=${XDEBUG_REMOTE_ENABLE}" >> /etc/php/$PHP_VERSION/mods-available/xdeug.ini
		# echo "xdebug.remote_handler=${XDEBUG_REMOTE_HANDLER}" >> /etc/php/$PHP_VERSION/mods-available/xdebug.ini
		# echo "xdebug.remote_host=${XDEBUG_REMOTE_HOST}" >> /etc/php/$PHP_VERSION/mods-available/xdebug.ini
		# echo "xdebug.remote_port=${XDEBUG_REMOTE_PORT}" >> /etc/php/$PHP_VERSION/mods-available/xdebug.ini
		#
	fi
}

install_wp() {
	# Install WordPress
	wp --allow-root core install \
		--admin_email="${WORDPRESS_EMAIL}" \
		--admin_password="${WORDPRESS_ADMIN_PASSWORD}" \
		--admin_user="${WORDPRESS_ADMIN_USER}"\
		--skip-email \
		--title="${WORDPRESS_TITLE}" \
		--url="${WORDPRESS_DOMAIN}" \
		--quiet

		# Activate theme
		wp --allow-root --url=$WORDPRESS_DOMAIN theme activate $WORDPRESS_THEME
# define( 'DISALLOW_FILE_EDIT', true );
# define( 'DISALLOW_FILE_MODS', true );
# define( 'AUTOMATIC_UPDATER_DISABLED', true );
}

translate_wp() {
	if [ ! -d "./languages" ]
		then mkdir -p "./languages"
	fi

	# The find command will find relevant files in the repository ignoring certain paths
	wp-pot \
	$(find -name "*.php" -not -path "./tests/*" -not -path "./vendor/*" | awk '{print "--src " $1}') \
	--dest-file "languages/${PMC_TEXT_DOMAIN}.pot" \
	--package "${PMC_TEXT_DOMAIN}" \
	--domain "${PMC_TEXT_DOMAIN}" \
	--last-translator "$(git --no-pager show -s --format="%an <%ae>" $(git rev-parse HEAD))" \
	--team "$(git config user.email) $(git config user.name)" \
	--bug-report 'https://pmc.com/contact'
}

