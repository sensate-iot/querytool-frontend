import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function main() {
  const appPath = `/apps/${environment.appId}`;

  if(window.location.pathname === `${appPath}/` || window.location.pathname === `${appPath}`) {
    window.location.pathname = `/apps/${environment.appId}/graph-tool`;
  }

  console.debug(`Path name : ${window.location.pathname}`);

  if(environment.production) {
    enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
}

main().then(() => {});
