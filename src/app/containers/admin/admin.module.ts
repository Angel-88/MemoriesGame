import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminComponent} from './admin.component';
import {AdminRouting} from './admin.routing';
import {WordsService} from '../../rest/words/words.service';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AdminRouting,
    ReactiveFormsModule,
  ],
  exports: [],
  declarations: [AdminComponent],
  providers: [WordsService],
})
export class AdminModule {}
