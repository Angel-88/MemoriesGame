import {GameTypeEnum} from '../shared/enums/game-type.enum';
import {AbstractConfig} from './abstract-config';
import {StudyGameConfig} from './study-game-config';
import {TestGameConfig} from './test-game-config';

export class ConfigsFactory {

  static instances: Array<AbstractConfig> = [
    new StudyGameConfig(),
    new TestGameConfig(),
  ];

  static getInstance(type: GameTypeEnum): AbstractConfig {
    return this.instances.find(instance => instance.checkType(type)) as AbstractConfig;
  }
}
