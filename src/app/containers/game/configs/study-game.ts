import {Game} from './game';
import {GameTypeEnum} from '../shared/enums/game-type.enum';

export class StudyGame extends Game {

  gameType = GameTypeEnum.STUDY;

  checkType(gameType: GameTypeEnum): boolean {
    return gameType === GameTypeEnum.STUDY;
  }

}
