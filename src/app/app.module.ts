import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { AppComponent } from './app.component';
import { TreeComponent } from './components/tree/tree.component';
import { LeafnodedetailsComponent } from './leafnodedetails/leafnodedetails.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: '/tree', pathMatch: 'full' },
  { path: 'tree', component: TreeComponent },
  { path: 'leafnodedetails/:text', component: LeafnodedetailsComponent },
 // { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    LeafnodedetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})

export class AppModule { }
export class AppRoutingModule { }


