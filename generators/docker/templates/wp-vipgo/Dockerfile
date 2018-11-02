FROM wordpress:<%= wpVersion %>-php<%= phpVersion %>

ADD ./conf/confd-configs/. /etc/confd/.
ADD ./confd-watch.sh /usr/bin/confd-watch.sh

RUN apt-get update \
&& apt-get install -y libz-dev libmemcached-dev libxml2-dev \
&& pecl install memcached \
&& docker-php-ext-enable memcached \
&& docker-php-ext-install soap \
&& apt-get clean -y \
&& rm -Rf /var/lib/apt/lists/* <%= wpDir %>/plugins/akismet <%= wpDir %>/plugins/hello.php <%= wpDir %>/plugins/hello.php <%= wpDir %>/themes/twentyfifteen <%= wpDir %>/themes/twentysixteen

WORKDIR <%= wpDir %>

RUN chmod -R +x /usr/bin/confd-watch.sh <%= wpDir %> \
&& chown -R www-data:www-data <%= wpDir %>
