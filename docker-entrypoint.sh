#!/bin/bash

# NOTE: need umask 002 to avoid Error: EACCES: permission denied, open '/root/.config/insight-nodejs/insight-yo.json'
umask 002

if [[ ! -d /usr/local/lib/node_modules/yo ]]; then
	npm install --global yo --allow-root
fi

if [[ ! -f /usr/local/bin/yo ]]; then
	ln -sf /usr/local/lib/node_modules/yo/lib/cli.js /usr/local/bin/yo
	ln -sf /usr/local/lib/node_modules/yo/lib/completion/index.js /usr/local/bin/yo-complete
	chmod +x /usr/local/bin
fi

if [[ -d /generator-pmc/generators ]]; then
	if [[ ! -d /usr/local/lib/node_modules/generator-pmc ]]; then
		cd /generator-pmc
		npm link
	fi
fi

chmod -R g+rwx /root /root/.config

exec "$@"
