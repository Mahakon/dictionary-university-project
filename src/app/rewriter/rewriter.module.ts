import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RewriterComponent} from './rewriter.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomTextareaModule} from '../../common/components/custom-textarea/custom-textarea.module';
import {CardModule} from '../../common/components/card/card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomTextareaModule,
    CardModule
  ],
  exports: [
    RewriterComponent
  ],
  declarations: [
    RewriterComponent
  ]
})
export class RewriterModule { }
