import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit {
  returnUrl: string;
  user: string;
  constructor(
    private router: Router
    , private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // get return url from route parameters or default to '/message'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/message';
    this.user = sessionStorage.getItem('currentUser');
    console.log('signin ngInit user: ' + this.user, + ' return: ' + this.returnUrl);
    if (!!this.user) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSignIn(theUser: string) {
    this.user = theUser;
    sessionStorage.setItem('currentUser', this.user);
    this.router.navigate([this.returnUrl]);
  }

}
