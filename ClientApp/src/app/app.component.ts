import { Component,  OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Spammer';
  isCollapsed = true;



  deferredPrompt = null;
  btnDisabled = 0;

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt');
      e.preventDefault();
      this.deferredPrompt = e;
      // Update UI notify the user they can add to home screen
      this.btnDisabled = 0; // show
    });
  }

  onClick() {
    // hide our user interface that shows our A2HS button
    this.btnDisabled = 1; // hide
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

  clearUser() {
    sessionStorage.setItem('currentUser', '');
  }
}
