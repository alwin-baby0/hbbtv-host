#!/bin/bash

# provide .env.webos
# git checkout development-base
# git pull

version=2.1.2

environment=prod
if [[ "$1" == "test" ]]; then
	environment=test
fi

buildfolder=wedotv-lg-build-$environment

if [[ "$environment" == "test" ]]; then
	sed -i '' 's#APP_BASE_URL_2.*#APP_BASE_URL_2='"'"'https://wedotv-proxy-api.work12.de'"'"'#' .env.webos
	sed -i '' 's#APP_BASE_WATCH4.*#APP_BASE_WATCH4='"'"'https://wedotv-proxy-tracking.work12.de'"'"'#' .env.webos
	sed -i '' 's#APP_BASE_OAUTH.*#APP_BASE_OAUTH='"'"'https://wedotv-proxy-oauth2.work12.de'"'"'#' .env.webos
	sed -i '' 's#APP_BASE_GA.*#APP_BASE_GA='"'"'https://wedotv-proxy-googletagmanager.work12.de'"'"'#' .env.webos
else
	sed -i '' 's#APP_BASE_URL_2.*#APP_BASE_URL_2='"'"'https://api-applicaster.wedo.tv'"'"'#' .env.webos
	sed -i '' 's#APP_BASE_WATCH4.*#APP_BASE_WATCH4='"'"'https://tracking.watch4.com'"'"'#' .env.webos
	sed -i '' 's#APP_BASE_OAUTH.*#APP_BASE_OAUTH='"'"'https://oauth2.wedotv.com'"'"'#' .env.webos
	sed -i '' 's#APP_BASE_GA.*#APP_BASE_GA='"'"'https://www.googletagmanager.com'"'"'#' .env.webos
fi

rm -rf "$buildfolder"
source .env.webos
npm install
npm run build-lg
mkdir -p "$buildfolder"/static
cp public/static/icon.png "$buildfolder"/static
ares-generate -p "id=wedotv-$environment" -p "version=${version}" -p "title=WeDoTV" "$buildfolder"
mv build/* "$buildfolder"

sed -i '' 's#<body>#<body>\n<script src="./webOSTVjs-1.2.10/webOSTV-dev.js" charset="UTF-8"></script>\n<script src="./webOSTVjs-1.2.10/webOSTV.js" charset="UTF-8"></script>\n#' "$buildfolder"/index.html

ares-package --no-minify ./"$buildfolder"

mv wedotv-${environment}_${version}_all.ipk ./"$buildfolder"
