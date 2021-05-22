import { NgModule } from '@angular/core';

import { GameComponent } from './game.component';
import { CommonModule } from '@angular/common';
import { GameRouting } from './game.routing';

@NgModule({
  imports: [
    CommonModule,
    GameRouting,
  ],
  declarations: [ GameComponent ],
})
export class GameModule {}
