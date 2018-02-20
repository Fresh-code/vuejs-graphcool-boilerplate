# VueJS graphcool boilerplate

### Prerequisites
- `yarn`
- `latest docker > 1.17`
- `latest docker-compose > 1.17`
- `npm install -g graphcool-framework@0.11.5`

### Stack
**Back-end:**
1. `Graphcool`

**Front-end:**
1. `VueJS`
1. `vue-router`
1. `Vuetify`

### Run in development mode

1. `git clone git@gitlab.com:freshcode-projects/vuejs-graphcool-boilerplate.git`
1. `cd vuejs-graphcool-boilerplate`
1. `cd server && yarn install`
1. `graphcool local up`
1. `cd .. && yarn graphcool:init` *
1. `npm run docker:start`
1. `npm run docker:enter`
1. `cd /vuejs-graphcool-boilerplate`
1. `yarn install`
1. `yarn start`
1. Open [http://localhost:3000](http://localhost:3000/) for project
1. Open API endpoint for playground

\* On initial run this script creates new Graphcool service and adds 2 files in a project directory (ignored by git):
 * `./.env` - stores Graphcool API Endpoint address and Root Token
 * `./server/.graphcoolrc` - local Graphcool config; stores ID of a deployed instance (target)

### Deploy
 
When deploying image the first time Graphcool service will be created automatically.
Graphcool service configuration is stored under `/opt/graphcool/${projectName}` folder and available either in container and on host:

 * `.env`
 * `.graphcoolrc`
  
In case host has to be changed, you should move this folder manually from old host to new before deploying.

### Production

In production mode Graphcool is deployed as a standalone service along with frontend.
Before launch in `docker-compose-production.yml` replace `MuchTokenSuchMasterWow` with your new master token.
