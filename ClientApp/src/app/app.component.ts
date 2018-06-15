import { Component } from '@angular/core';
import { MessageComponent } from './message/message.component';
import { SignInComponent } from './signin/signin.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Spammer';
}
