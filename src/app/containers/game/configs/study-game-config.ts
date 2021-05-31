import {AbstractConfig} from './abstract-config';
import {GameTypeEnum} from '../shared/enums/game-type.enum';
import {GameConfig} from '../game.component';

export class StudyGameConfig extends AbstractConfig {

  gameType = GameTypeEnum.STUDY;

  checkType(gameType: GameTypeEnum): boolean {
    return gameType === GameTypeEnum.STUDY;
  }

  getGameConfig(): GameConfig {
    return {
      statisticConfig:
        [
          'score',
        ],
    };
  }
}
