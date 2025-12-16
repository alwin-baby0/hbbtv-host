# **WedoTV** - Smart TV OTT Application 📺

The application follows a modern OTT platform concept similar to leading streaming services, offering structured content rails for movies, series, sports, and Live TV. 

It includes dynamic content browsing, personalized navigation flows, and a full-screen player optimized for Smart TV devices.

## 1. Setup project
### 1.1. Before cloning the repository, make sure the following are installed and working

* **Node.js** _(Check in terminal)_

     ``` 
     node -v 
     ```
* **npm _(Node package manager)_** _(Check in terminal)_

     ``` 
     npm -v 
     ```
* **GIT** _(Check in terminal)_

     ``` 
     git -v 
     ```

### 1.2. Clone the repository
#### Open terminal in the folder where you want the project

* Clone the repo:
    ```
    git clone \REPO_URL\
    ```
* Enter project folder:
    ```
    cd \PROJECT_FOLDER_NAME\
    ```
* Install all npm packages:
    ```
    npm install
    ```
### 1.3. Checklist aftet successful install:

* `node_modules/` folder exist in the project root
* No fatal errors in the terminal
* Warnings are acceptable unless explicitly stated otherwise in the project
#### If installation fails, check:
* Node version
* Internet connection/proxy
* npm registry settings (`npm config get registry`)

### 1.4. Environment configuration
The project requires environment configuration before it can run.
* Create `.env` file in the root folder of the project
* Open `.env` file and set required values _(consult with a dev colleague)_
### ⚠️ IMPORTANT :  _`.env` files must NEVER be committed to any repository._
### _These files contain sensitive data such as API keys, secrets, tokens, and credentials._
### Before doing anything else in the project, make sure that your `.env` file is **ADDED** to the **`.gitignore`** file

    # .gitignore

    .env
    .env.local
    .env.production 

## 2. Start/build and all neccecery commands
To start application in general first you need to peek at `package.json`, and search `script`'s. These script we'll use for development/build/test etc.

### 2.1. Start
#### In terminal:
  ```
    npm start
   ```
#### Preview in browser on : 

#### Local >`http://localhost:3000/` 👈🏻
#### Network > `http://192.168.50.57:3000/` 👈🏻
## ⚠️ IMPORTANT!
  
#### If you see an error like:
    
    EADDRINUSE: address already in use :::3000
    
#### …it means another process is already running on port 3000.
 **You need to find it and kill it.**

#### Open terminal (CMD/Powershell) and run:
  
    netstat -ano | findstr :3000
    
#### You'll get something like :
    
    TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
    
#### The last number is the PID (process ID).
    
    taskkill /PID 12345 /F
    
#### Replace `12345` with the actual PID from your output.
    
#### After that you can start your application again. ✅

### 2.2. Test
#### Open terminal (CMD/Powershell) and run:
    
    npm run test -- -u
    
### 2.3. Build
#### Open terminal (CMD/Powershell) and run:
    
    npm run build
### ⚠️ IMPORTANT
#### There are build commands specifically for certain devices, which you can see in `package.json`

  ```json
  # package.json


  {
    script: [
      // Platform-specific production builds (Hisense, Titan, Netgem, etc.) 👇🏻👇🏻👇🏻
      "build-lg": "vite build --mode production-webos",
      "build-hisense": "vite build --mode production-hisense",
      "build-titan": "vite build --mode production-titan",
      "build-netgem": "vite build --mode production-netgem",
      // ...
    ]
  }
  ```
#### Corresponding config files are located in the **`/build`** directory in the root of the project. 
    
#### Contains build artifacts and platform-specific configuration files and example outputs (used for packaging and platform builds).

## 3. Architecture summary
### 3.1. High-level flow:
  * **Boot** (`src/index.js`) — initialize device info, key mappings, services, analytics hooks, and launch the Lightning app.
  * **App** (`src/App.js`) — extends Router.App, defines main template, global widgets (Navbar, Dialog, Loading), background, fonts.+
  * **Router** (`src/routes.js`) — route table mapping paths to page components and page data providers.
  * **Pages** (`src/pages/*`) — per-route UI, using components and Services to fetch and show data.
  * **Services** (`src/Services/*`) — centralised data fetching, parsing and business logic (FetchingService, VODService, EPGService, HomePageService, etc.).
  * **Models & parsers** (`src/Models/*`) — normalise backend responses into app models used by components/pages.
  * **Components** (`src/components/*`) — reusable UI building blocks, widgets, rails, player UI and layout components.

### 3.2. Folder by folder:
  * Root files:
    * `package.json` - scripts, dependencies, and platform build scripts.
    * `vite.config.js` - vite configuration.
    * `jest.config.js` & `babel.config.js` - preset/configuration for testing.
    * `README.md` - General setup instruction and info about App.
  * `build/`- contains build artifacts and platform-specific configuration files (used for packaging and platform builds).
  * `public/static` - Assets (images, icons, fonts, translations)
  * `reskin/` - configuration for brand colors and theming.
  * `src/`
    * `components/` - reusable UI components and widgets
    * `constants/` -  global constants such as ROUTES, IMG_PATH, TRANSLATIONS and other shared values.
    * `Models/` - Banner, Category, GalleryItem and other models plus parsers.js used to transform raw API responses.
    * `pages/` -  all page-level components and their providers
    * `Services/` - API integration and data services (Auth, Fetching data etc.)
    * `utils` - device.js (device detection and info), focus.js (focus management for TV), keys.js (key mappings).
    * `test` - Unit and snapshot tests, mocks for API endpoints and test setup files
    * `index.js`, `App.js` & `routes.js` - They have already been explained, some of first files that are initialized.

## 4. Technologies and libraries
  * Core frontend & UI
    * `LightingJS` core, sdk, ui-components etc.
  * Build & tooling
    * `Vite` and `@vitejs/plugin-legacy` - dev server, build tool, and legacy browser support for builds.
    * `Babel` - test transform, preset-env for node in tests.
    * `npm` - package manager and script runner.
  * Playback & Media
    * `hls.js` - JS library which implements an HTTP Live Streaming client.
    * `shaka-player` - DASH/advanced playback support.
    * `srt-parser-2` — parse SRT captions.
    * `webvtt-parser` — parse WebVTT captions.
  * Networking & utilities
    * `axios` - HTTP client used in FetchingService and others services.
    * `qrcode` - generate QR codes
    * Font-related / icons: `@fortawesome` packages for icons
  * Testing & mocks
    * `jest` — test runner
    * `jest-environment-jsdom` — DOM environment for tests
    * `jest-fetch-mock` — mock fetch
    * `jest-webgl`-canvas-mock — mock for WebGL/canvas used by Lightning
    * `babel-jest` — transform JS for tests
  * Lighting formating / pre-commit
    * prettier, eslint, eslint-config-prettier, husky, lint-staged
## 5. Practical notes/ where to find in repo 
### 5.1. Where to find ?

*  **Entry and launch:** `index.js` (boot sequence, service init, Launch(App, ...)).
* **App shell & routing:** `App.js` and `routes.js`.
* **API layer:** Services (open `FetchingService.js` to understand base URLs/interceptors).
* **Pages and UI:** `src/pages/*` and `src/components/*`.
* **Platform build behavior:** `vite.config.js`.
* **Tests:** `test/*` and `jest.config.js` for test setup/coverage thresholds.

### 5.2. Notes for pushing code on Bitbucket
In terminal:
#### If you are not checkout on development branch 👇🏻
```json
git checkout development
```
#### Then pull current changes (if there is one) 👇🏻
```json
git pull
```
#### Make new branch and checkout on your branch (⚠️ **IMPORTANT**: Naming of brunches must be in form `feature/<BRANCH_NAME>`)👇🏻
```json
git checkout -b feature/<BRANCH_NAME>
```
#### After changes or finished task add files that you changed👇🏻
```json
git add . // added all changed files
```
#### or👇🏻
```json
git add src/example.js // This is example where we add just one file from his src route
```
#### Then commit it (⚠️ **IMPORTANT**: commit will not succeed if you not add `--no-verify`)👇🏻
```json
git commit --no-verify -m "commit msg" 
```
#### Git push (**`origin`**: The specific remote repository to push to, which, by default, points to the URL of the primary online repository (e.g., on GitHub, GitLab, or Bitbucket). )👇🏻
```json
git push origin feature/<BRANCH_NAME>
```


