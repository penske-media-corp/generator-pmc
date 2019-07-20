<%= WORDPRESS_THEME %>
########################################

WordPress theme for `<%= WORDPRESS_THEME %> <<%= ORG_URL %>>

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

.. code-block:: sh
    docker-compose up --build -d --force-recreate --remove-orphans

Build the dependencies:

.. code-block:: sh
    docker-compose run --rm build-npm
    docker-compose run --rm build-php

Install WordPress:

.. code-block:: sh

    docker-compose run --rm wp-cli

Run tests:

.. code-block:: sh
    docker-compose run --rm test-npm
    docker-compose run --rm test-npm /bin/sh
    docker-compose run --rm test-php
    docker-compose run --rm test-php /bin/sh

Run CI:
.. code-block:: sh
    wget --no-cache -O - https://raw.githubusercontent.com/penske-media-corp/_ss-wordpress/master/global/_ss-ci.sh | sh

Critical files for CI/CD
=============
<%= WORDPRESS_THEME %>
Notes
-----
Add any additional notes that are app specific here
