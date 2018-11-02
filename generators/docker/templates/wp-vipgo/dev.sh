#!/bin/bash
start() {
	if [ ! -f docker-compose.yml ]; then
		echo "Please run this script from the root of the docker-vip repo."
		exit 1
	fi

	if [ ! -z "$(docker-compose ps | sed -e '/^\-\-\-/,$!d' -e '/^\-\-\-/d')" ]; then
		echo "Please run \`docker-compose down\` before running this script. (You will need"
		echo "to reimport content after this script completes.)"
		exit 1
	fi

	docker-compose up -d --build --remove-orphans
}

start_with_memcached() {
	docker-compose -f docker-compose.yml -f docker-compose-memcached.yml up -d --remove-orphans --build
}

stop() {
	docker-compose stop
}

down() {
	docker-compose down
}

setup_wp_stack() {
	docker-compose run --rm wp-cli install-wp
	# Here you can add any setup commands that you would like to run to make setup easier such as activating themes, plugins, etc.
	# docker-compose run --rm wp-cli wp plugin activate someplugin
	#docker-compose run --rm wp-cli wp theme activate sometheme
}
