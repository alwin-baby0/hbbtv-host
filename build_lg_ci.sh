#!/bin/bash

environment=prod

echo "BUILD VERSION $APP_VERSION"

buildfolder=build

npm install

echo npm run build-lg
npm run build-lg
mkdir -p "$buildfolder"/static
cp public/static/icon.png "$buildfolder"/static

echo run ares-generate
ares-generate -p "id=wedotv-$environment" -p "version=${APP_VERSION}" -p "title=WeDoTV" "$buildfolder" --overwrite

sed -i 's#<body>#<body>\n<script src="./webOSTVjs-1.2.10/webOSTV-dev.js" charset="UTF-8"></script>\n<script src="./webOSTVjs-1.2.10/webOSTV.js" charset="UTF-8"></script>\n#' "$buildfolder"/index.html

echo run ares-package
ares-package --no-minify ./"$buildfolder"

mv wedotv-${environment}_${APP_VERSION}_all.ipk ./"$buildfolder"
