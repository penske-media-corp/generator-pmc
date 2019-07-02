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

###############################################################################
### PLEASE READ:
###############################################################################
# A single configuration for every environment ( dev, stg, prod ) is a MUST
# ALL configuration is dictated by the `.env` file for the app which default to
# local dev. That configuration is simply overriden for other environments
# START/BUILD: `docker-compose up --build -d --force-recreate --remove-orphans`
# EACH service is REQUIRED to be in it's own container
# NEVER put credentials into the .env file for configuration
#  If a credential is needed for dev such as an auth token or password you can
#  configure that via your host environment by exporting the var
#  i.e. `export CODECOV_AUTH_TOKEN=abc123 as demonstrated below
# K.I.S.S. if you're adding/modifying configurations then check yourself before
#  you wreck the project and ask for help from DevOps before making any changes
#  ALL WP apps are generic and updates are applied in an automated way.
#  Your changes will be overwritten if they don't conform with the standard.
# .env vars need to conform with existing containers. Usage of `WP_DB` or similar
#  is strongly discouraged.
###############################################################################
###############################################################################

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

Enable 2FA in /wp-admin/profile.php#two-factor-options

Notes
-----
- `get_term_link` / `get_category_link` function return relative path instead of full url: /category/...
 - see `Rolling_Stone\Inc\Rewrites::set_permalink_defaults`
 - code responsible: `wpcom_vip_load_category_base( '' );`
