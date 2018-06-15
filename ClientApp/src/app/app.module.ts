import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppComponent } from './app.component';
import { routing} from './app.routes';
import { MessageComponent } from './message/message.component';
import { SignInComponent } from './signin/signin.component';
import { AuthGuard } from './AuthGuard.service';

@NgModule({
  declarations: [
    AppComponent
    , MessageComponent
    , SignInComponent
  ],
  imports: [
    routing
    , BrowserModule
    , BsDropdownModule.forRoot()
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
