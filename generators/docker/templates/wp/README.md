
rollingstone.com
########################################

WordPress theme for `rollingstone.com <https://www.rollingstone.com/>

.. contents::

.. section-numbering::

Main features
=============

* Hosted on VIPGO
* Uses parent theme pmc-core-v2

Installation
============
This project uses docker docker-compose and `pmc-dev <https://bitbucket.org/penskemediacorp/pmc-dev>`

Dev
-----
On your local machine you will have to start the `pmc-dev <https://bitbucket.org/penskemediacorp/pmc-dev>` Traefik proxy if you haven't already.

Start up the project first by building the docker image:

.. code-block:: sh

    docker-compose up --remove-orphans -d --build

Build the dependencies:

.. code-block:: sh

    docker-compose run --rm pipeline-npm-build
    docker-compose run --rm pipeline-composer-build

Install WordPress:

.. code-block:: sh

    docker-compose run --rm wp-cli

Notes
-----
- `get_term_link` / `get_category_link` function return relative path instead of full url: /category/...
 - see `Rolling_Stone\Inc\Rewrites::set_permalink_defaults`
 - code responsible: `wpcom_vip_load_category_base( '' );`
