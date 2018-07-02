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

  ngOnInit() {}

}
