import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Mousehunt
import { VriftComponent } from './vrift/vrift.component';
import { DludhuComponent } from './dludhu/dludhu.component';

// Misc
import { AboutComponent } from './about/about.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

const routes: Routes = [
  { path: '', redirectTo: '/vrift', pathMatch: 'full' },
  { path: 'vrift', component: VriftComponent },
  { path: 'dlu-dhu', component: DludhuComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}