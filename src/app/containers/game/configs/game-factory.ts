import {GameTypeEnum} from '../shared/enums/game-type.enum';
import {Game} from './game';
import {StudyGame} from './study-game';
import {TestGame} from './test-game';

export class GameFactory {

  static gamesInstances: Array<Game> = [
    new StudyGame(),
    new TestGame(),
  ];

  static getInstance(type: GameTypeEnum): Game {
    return this.gamesInstances.find(instance => instance.checkType(type)) as Game;
  }
}
