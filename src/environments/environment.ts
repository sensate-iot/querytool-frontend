// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  authApiHost: 'http://localhost:5000/auth/v1',
  dashboardApiHost: 'http://localhost:5001/stats/v1',
  networkApiHost: 'http://localhost:6500/network/v1',
  dataApiHost: 'http://localhost:5002/data/v1',
  liveDataHost: 'ws://localhost:4750/live/v1/measurements',
  appId : 'querytool',
  appsApiHost: 'http://applications.api.dev.sensateiot.com/apps/v1'
};
