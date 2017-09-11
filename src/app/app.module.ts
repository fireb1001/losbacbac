import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ClipboardModule } from 'ngx-clipboard';

import { PersonsComponent } from './components/persons/persons.component';
import { ConfigsComponent } from './components/configs/configs.component';
import { PersonDetailsComponent } from 'app/components/person-details/person-details.component';
import { ImgursComponent } from 'app/components/imgurs/imgurs.component';
import { LandingsComponent } from './components/landings/landings.component';
import { ArticlesComponent } from 'app/components/articles/articles.component';

import { TimeAgoPipe } from 'app/pipes/time-ago.pipe';
import { ReversePipe } from 'app/pipes/reverse.pipe';
import { ListItemAttrPipe } from './pipes/list-item-attr.pipe';
import { SeleniumQueueComponent } from './components/selenium-queue/selenium-queue.component';

import { ImgursService } from 'app/services/imgurs.service';
import { ConfigsService } from 'app/services/configs.service';
import { GoogleApiService } from 'app/services/google-api.service';
import { PersonsService } from 'app/services/persons.service';
import { LandingsService } from 'app/services/landings.service';
import { FireHelperService } from 'app/services/fire-helper.service';
import { NestedListPipe } from './pipes/nested-list.pipe';
import { InitPlayDirective } from './directives/init-play.directive';

const routes: Routes = [{
  path: '',
  component: AppComponent
},
{
  path: 'persons',
  component: PersonsComponent
},
{
  path: 'pages',
  component: PersonsComponent ,
  data: { pages_mode: true }
},
{
  path: 'imgurs',
  component: ImgursComponent
},
{
  path: 'landings',
  component: LandingsComponent
},
{
  path: 'queue',
  component: SeleniumQueueComponent
},
{
  path: 'configs',
  component: ConfigsComponent
}
,
{
  path: 'person/:id',
  component: PersonDetailsComponent
}
];

const environment = {
  production: false,
  fbconfig: {
    apiKey: 'AIzaSyDWYLHD7tvDvnJOAx3ArIpBAXSl5Csgexw',
    authDomain: 'dubaihotelstar.firebaseapp.com',
    databaseURL: 'https://dubaihotelstar.firebaseio.com',
    projectId: 'dubaihotelstar',
    storageBucket: 'dubaihotelstar.appspot.com',
    messagingSenderId: '460764628000'
  }
};


@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent,
    PersonsComponent,
    ImgursComponent,
    ListItemAttrPipe,
    TimeAgoPipe,
    ReversePipe,
    PersonDetailsComponent,
    ConfigsComponent,
    LandingsComponent,
    SeleniumQueueComponent,
    NestedListPipe,
    InitPlayDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.fbconfig),
    AngularFireDatabaseModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    ClipboardModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [PersonsService,
     ImgursService,
     LandingsService,
     ConfigsService,
     FireHelperService,
     GoogleApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
