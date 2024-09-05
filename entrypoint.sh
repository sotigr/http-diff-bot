#!/bin/bash

echo "${CRON} /bin/bash -c 'cd /src && npm run start' > /proc/1/fd/1 2>/proc/1/fd/2" > /etc/cron.d/scrape-cron
crontab /etc/cron.d/scrape-cron
printenv | grep -v 'no_proxy' >> /etc/environment && cron -f