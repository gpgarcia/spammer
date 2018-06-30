import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppComponent } from './app.component';
import { routing} from './app.routes';
import { MessageComponent } from './message/message.component';
import { SignInComponent } from './signin/signin.component';
import { AuthGuard } from './AuthGuard.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent
    , MessageComponent
    , SignInComponent
    , AboutComponent
  ],
  imports: [
    routing
    , BrowserModule
    , BsDropdownModule.forRoot()
    , CollapseModule.forRoot()
    , ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
