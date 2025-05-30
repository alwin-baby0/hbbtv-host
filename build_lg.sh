# provide .env.lg
# git checkout development-base
# git pull

buildfolder=wedotv-lg-build
version=2.1.2

rm -rf "$buildfolder"
source .env.lg
npm install
npm run build-lg
ares-generate -p "id=wedotv" -p "version=${version}" -p "title=WeDoTV" "$buildfolder"
mv build/* "$buildfolder"

sed -i '' 's#<body>#<body>\n<script src="./webOSTVjs-1.2.10/webOSTV-dev.js" charset="UTF-8"></script>\n<script src="./webOSTVjs-1.2.10/webOSTV.js" charset="UTF-8"></script>\n#' "$buildfolder"/index.html

ares-package --no-minify ./"$buildfolder"

mv wedotv_${version}_all.ipk ./"$buildfolder"
