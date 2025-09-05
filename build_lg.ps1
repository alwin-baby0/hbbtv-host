# RUN ME WITH
# ./build_lg.ps1 test
# OR
# ./build_lg.ps1 prod

# provide .env.webos
# git checkout development-base
# git pull


param(
    [string]$Environment
)

$envFile = ".env.webos"
$buildfolder = "wedotv-lg-build-$Environment"

if ($Environment -eq "test") {
    # Test environment URLs
    (Get-Content $envFile) -replace 'APP_BASE_URL_2.*', "APP_BASE_URL_2 = 'https://wedotv-proxy-api.work12.de'" | Set-Content $envFile
    (Get-Content $envFile) -replace 'APP_BASE_WATCH4.*', "APP_BASE_WATCH4 = 'https://wedotv-proxy-tracking.work12.de'" | Set-Content $envFile
    (Get-Content $envFile) -replace 'APP_BASE_OAUTH.*', "APP_BASE_OAUTH = 'https://wedotv-proxy-oauth2.work12.de'" | Set-Content $envFile
    (Get-Content $envFile) -replace 'APP_BASE_GA.*', "APP_BASE_GA = 'https://wedotv-proxy-googletagmanager.work12.de'" | Set-Content $envFile
} else {
    # Production environment URLs
    (Get-Content $envFile) -replace 'APP_BASE_URL_2.*', "APP_BASE_URL_2 = 'https://api-applicaster.wedo.tv'" | Set-Content $envFile
    (Get-Content $envFile) -replace 'APP_BASE_WATCH4.*', "APP_BASE_WATCH4 = 'https://tracking.watch4.com'" | Set-Content $envFile
    (Get-Content $envFile) -replace 'APP_BASE_OAUTH.*', "APP_BASE_OAUTH = 'https://oauth2.wedotv.com'" | Set-Content $envFile
    (Get-Content $envFile) -replace 'APP_BASE_GA.*', "APP_BASE_GA = 'https://www.googletagmanager.com'" | Set-Content $envFile
}

# Remove build folder if it exists
if (Test-Path $buildfolder) {
    Remove-Item -Recurse -Force $buildfolder
}

# Source environment file (PowerShell equivalent)
if (Test-Path "$envFile") {
    Get-Content "$envFile" | ForEach-Object {
        if ($_ -match "^(?:export\s+)?([^=]+)=(?:'|\")?(.*?)(?:'|\")?$") {
            Set-Variable -Name $matches[1] -Value $matches[2] -Scope Global
        }
    }
}

Write-Host "BUILD VERSION $APP_VERSION"

# Run npm commands
npm install
npm run build-lg

New-Item -ItemType Directory -Force -Path "$buildfolder/static"
Copy-Item -Force "public/static/icon.png" "$buildfolder/static"

# Generate ares package
$env:APP_VERSION = $APP_VERSION
ares-generate -p "id=wedotv-$Environment" -p "version=$env:APP_VERSION" -p "title=WeDoTV" $buildfolder

# Move build contents
Move-Item -Force "build/*" $buildfolder

# Replace content in index.html (PowerShell string replacement)
$indexPath = Join-Path $buildfolder "index.html"
if (Test-Path $indexPath) {
    $content = Get-Content $indexPath -Raw
    $newScripts = @"
<body>
<script src="./webOSTVjs-1.2.10/webOSTV-dev.js" charset="UTF-8"></script>
<script src="./webOSTVjs-1.2.10/webOSTV.js" charset="UTF-8"></script>
"@
    $content = $content -replace '<body>', $newScripts
    Set-Content -Path $indexPath -Value $content
}

# Package the application
ares-package --no-minify "./$buildfolder"

# Move the generated IPK file
$ipkFile = "wedotv-${Environment}_${APP_VERSION}_all.ipk"
if (Test-Path $ipkFile) {
    Move-Item $ipkFile "./$buildfolder"
}