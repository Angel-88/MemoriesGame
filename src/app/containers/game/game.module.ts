import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimpleTimer } from 'ng2-simple-timer';

import { GameComponent } from './game.component';
import { GameRouting } from './game.routing';

@NgModule({
  imports: [
    CommonModule,
    GameRouting,
  ],
  declarations: [ GameComponent ],
  providers: [ SimpleTimer ],
})
export class GameModule {}
