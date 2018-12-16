import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CustomTextareaComponent} from './custom-textarea.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { WordComponent } from './word/word.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CustomTextareaComponent,
    WordComponent
  ],
  declarations: [
    CustomTextareaComponent,
    WordComponent
  ]
})
export class CustomTextareaModule { }
