import { Component, OnInit } from '@angular/core';
import { fromEvent, merge, of, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  haveWebSockets = false;
  isStandalone = false;
  isOnline$: Observable<boolean>;

  constructor() {
    if (!!window) {
      this.haveWebSockets = ('WebSocket' in window);
      this.isStandalone = (window.matchMedia('(display-mode: standalone)').matches);
      }

    this.isOnline$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );
  }

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

}
