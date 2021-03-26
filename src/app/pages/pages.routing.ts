import { Routes, RouterModule, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';


import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../guards/auth.guard';


const routes: Routes = [

    {  path: 'home', component: PagesComponent,
        canActivate: [ AuthGuard ],
        children: [
            {  path: '',         component: HomeComponent  },
            {  path: 'home',     component: HomeComponent  },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
