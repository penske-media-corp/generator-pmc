# <%= WORDPRESS_THEME %>

WordPress theme for `<%= WORDPRESS_THEME %> <%= ORG_URL %>`

APP Details
=============
<% if(WORDPRESS_PARENT_THEME) { %>* Parent theme <%= WORDPRESS_PARENT_THEME %><% } %>

Installation
============
* git clone this repo
* ensure your have a valid `COMPOSER_AUTH` or git auth credentials in your host environment to clone private repos
* run through build steps listed below

Dev
-----
Start up the app first by building the docker image:
```sh
docker-compose up --build -d --force-recreate --remove-orphans
```

Build the dependencies:
```sh
docker-compose run --rm build-npm
docker-compose run --rm build-php
```

Install WordPress:
```sh
docker-compose run --rm cli
```

Run tests:
```sh
docker-compose run --rm test-npm
docker-compose run --rm test-npm /bin/sh
docker-compose run --rm test-php
docker-compose run --rm test-php /bin/sh
```

Run CI:
```sh
wget --no-cache -O - https://raw.githubusercontent.com/penske-media-corp/alpine-wordpress/master/_ss/global/_ss-ci.sh | sh
```

Critical files for CI/CD
=============
Any files pre/post-fixed with these extensions are related to maintaining a healthy application `.`, `.xml`, `.json`, `.yml`.

<%= WORDPRESS_THEME %> generated on <%= new Date() %>

Notes
-----
Add any additional notes that are app specific here
