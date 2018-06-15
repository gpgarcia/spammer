import { Routes, RouterModule } from '@angular/router';

import { MessageComponent } from './message/message.component';
import { SignInComponent } from './signin/signin.component';
import { AuthGuard } from './AuthGuard.service';

const appRoutes: Routes = [
      { path: '', component: SignInComponent }
    , { path: 'message', component: MessageComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    // ,{ path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
