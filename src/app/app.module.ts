import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RewriterModule} from './rewriter/rewriter.module';
import {RouterModule} from '@angular/router';
import {ROUTES} from '../core/routes';
import { CustomTextareaComponent } from '../common/components/custom-textarea/custom-textarea.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RewriterModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
