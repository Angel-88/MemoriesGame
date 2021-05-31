import {AbstractConfig} from './abstract-config';
import {GameTypeEnum} from '../shared/enums/game-type.enum';
import {GameConfig} from '../game.component';

export class TestGameConfig extends AbstractConfig {

  gameType = GameTypeEnum.TEST;

  checkType(gameType: GameTypeEnum): boolean {
    return gameType === GameTypeEnum.TEST;
  }

  getGameConfig(): GameConfig {
    return {
      statisticConfig:
        [
          'timer',
          'words',
          'score',
        ],
    };
  }

}
