generator-pmc
======
**genrator-pmc** is a yeoman scaffolding generator for generating re-usable project architecture patterns. It can be utilized for quick project adoption of PMC standards and upgrades to existing ones.

## SETUP
- clone this repo
- `cd generator-pmc`
- `npm link`
- `npm i -g yo`
- `cd {some-project}`
- `yo pmc:{sub-command}`
- follow the cli instructions using your own discretion with the updates to your application

## AVAILABLE SUBCOMMANDS

- `yo pmc:wp` Setup local environment for a standard WordPress theme.

##@TODOS:
- Integrate master `bootstrap.php` into wordpress-alpine
- Refactor [wordpress-alpine](generators/wp/index.js) to not use quite so many arrays to pass args
- Add options when running `yo` so that users can choose what to generate without a sub-command.

## ISSUES
If any issues are encountered open an issue, file a ticket, or submit a PR!
