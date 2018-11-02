#!/usr/bin/env sh

# Install WordPress.
<% if (isMultisite) { %>wp core multisite-install \<% } else { %>wp core install \<% } %>
--title="<%= wpTitle %>" \
--admin_user="<%= wpUserName %>" \
--admin_password="<%= wpUserPass %>" \
--admin_email="<%= wpEmail %>" \
--url="<%= wpDomain %>" \
--skip-email

# Update permalink structure.
wp option update permalink_structure "/%year%/%monthnum%/%postname%/" --skip-themes --skip-plugins
