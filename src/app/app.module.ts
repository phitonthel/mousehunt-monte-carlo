import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import {MenuItem} from 'primeng/api';                  //api
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InterviewsComponent } from './interviews/interviews.component';
import { FormComponent } from './form/form.component';
import { AboutComponent } from './about/about.component';

// Mousehunt
import { VriftComponent } from './vrift/vrift.component';
import { DludhuComponent } from './dludhu/dludhu.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    MessagesModule,
    MessageModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    InterviewsComponent,
    FormComponent,
    AboutComponent,
    VriftComponent,
    DludhuComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }