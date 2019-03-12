generator-pmc
======
**genrator-pmc** is a yeoman scaffolding generator for generating re-usable project architecture patterns. It can be utilized for quick project adoption of PMC standards and upgrades to existing ones.

## Setup and usage via yeoman
* `npm install --global generator-pmc`
* navigate to project root `cd ...`
* `yo pmc:{sub-command}`

## Setup and usage via git clone ( for Development )
* `git clone git@bitbucket.org:penskemediacorp/generator-pmc.git`
* `cd generator-pmc`
* `nvm use`
* `npm link`
* navigate to project root `cd ...`
* `yo pmc:{sub-command}`

### Setup for Docker
Upon generation new files will be added to the project root so be sure to be in a clean HEAD state before running the generator for docker.

* Navigate to your project
* `yo pmc:docker`
* Follow the prompts to setup when finished you should see some new files generated in your project
* Edit the `composer.json` file in the root of the repo to include or customize any plugins and/or themes that the project depends on
* If there are any setup plugins or theme activations to run via wp-cli. Then edit the `dev.sh` file to `setup_wp_stack`
* After editing `dev.sh` run `source dev.sh && start`
* Add a host entry for the domain of your project to your hosts file
* At that domain you should now see the wp install screen
* To install your site run `source dev.sh && install_wp_stack`
* Re-iterate on those steps until your project is complete and commit these docker files to source

### Setup for pipelines
* Navigate to your project
* `yo pmc:pipelines`
* Follow the prompts to setup pipelines config

## Improvements / Feature requests
If the generator doesn't quite fit the project structure or changes need to be made for improvements please either submit a PR or contact the DevOps engineering team.
