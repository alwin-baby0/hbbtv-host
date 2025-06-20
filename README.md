# WEDOTV - lightning.js

WEDOTV is lightning.js based TV application developed by Shindiri Studio.

### Folder structure

- reskin - data about different skins for the app
- src
  - Components - contains components we use throughout the app
  - Models - all the models to parse data coming from the server
    - **...all the models...**
    - parsers.js - contains functions for parsing different data to models
    - index.js - exports all the models from the folder
  - Pages - different pages we use throughout the app
    - **Filtered** - VODs filtered by category
    - **Help** - terms & conditions, privacy policy and imprint
    - **Home** - initial screen when entering the app
    - **Player** - player page
    - **Search** - search for different content
    - **Settings** - change the language
    - **SingleLiveEvent** - information about specific live events
    - **SingleMovie** - information about specific movies
    - **SingleSeries** - information about specific series
    - **VodPreview** - page with content and VOD section for Movies/Series/Sports
    - routes.js - holds info about the routes for the router
  - Widgets - different widgets we use throughout the app
    - **NavBar** - navigation through the app (TopBar)
  - Services - services to contain logic for fetching, storing, and caching data for pages - every service extends FetchingService
    - **FetchingService** - generic service class that encapsulates requesting logic, Axios instance, and error handling
    - **HomePageService** - logic behind the Home page
    - **VodService** - logic behind VodPreview page, provides different logic depending on the type of VOD you want to show
    - **SearchService** - handles searching and storing search data
    - **SingleMovieService** - fetch and hold data for single movie
    - **SingleSeriesService** - single series/sports and seasons/episodes
    - **SingleEventService** - single event and other events
- static - static content
  - fonts
  - icons
  - images

### Packages

- **axios.js** - fetching

### Fetching Logic

1. there are 2 versions of the API
2. we use **Services** to fetch and store data
3. **Services** parse the data, to keep only the things we need, for this we use different **Models**
4. **Services** also caches the data
5. We then use the data we have in **Services** and present it in different **Views** (Pages/components/Widgets)

### Rails

Rails are used to describe one row of data nodes in the app.

We use constructRails function to construct Rails.

constructRails creates HorizontalContainer with different types of RailItems.

RailItems are different depending on type of the data and/or type of the cards(poster,landscape...).

### Containers

There are 2 types of item containers: Horizontal and Vertical containers.

They are used to store collection of data in specific orientation.

They handle adding/focusing/removing items from the collection.

### Players

_..._

### Gitflow

We have 3 main branches:

- master - production code only
- staging - finished features that are ready to be tested or are already tested
- development - containes finished untested features
  - feature - created from develop and used to develop a feature

We **ONLY** create new branches from **development** and only merge in **development**.
Once PR is Accepted, it can be merged into **development**.

New updates should be merged to **staging** once a full feature is finished.
After all the testing, and 100% sure its okay to merge, merge from **staging** to **master**.

**master** branch is use to create production builds.

#### Keeping up with develpment

1. go to **develop**
2. git pull
3. go to my **feature** branch
4. git merge **development**
5. fix conflicts if exist
6. test if everything works fine
7. git add . > git commit -m "feat: " > git push
8. create PR if it doesnt exis (**feature** > **development**)
9. add meaningfull description to PR, add reviewer :handshake:
10. :pray:
