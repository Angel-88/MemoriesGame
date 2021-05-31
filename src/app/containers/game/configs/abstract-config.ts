import {GameTypeEnum} from '../shared/enums/game-type.enum';
import {GameConfig} from '../game.component';

export abstract class AbstractConfig {

  isGameStarted = false;
  gameType!: GameTypeEnum;

  abstract checkType(gameType: GameTypeEnum): boolean;

  abstract getGameConfig(): GameConfig;

  setIsGameRunning(bool: boolean): void {
    this.isGameStarted = bool;
  }

  isGameRunning(): boolean {
    return this.isGameStarted;
  }
}
