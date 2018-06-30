import { Routes, RouterModule } from '@angular/router';

import { MessageComponent } from './message/message.component';
import { SignInComponent } from './signin/signin.component';
import { AboutComponent } from './about/about.component';
import { AuthGuard } from './AuthGuard.service';

const appRoutes: Routes = [
      { path: '', component: SignInComponent }
    , { path: 'about', component: AboutComponent}
    , { path: 'message', component: MessageComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    // ,{ path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
