import {Game} from './game';
import {GameTypeEnum} from '../shared/enums/game-type.enum';
import {SimpleTimer} from 'ng2-simple-timer';
import {WordResponseDto} from '../../../rest/words/word.response.dto';

export class TestGame extends Game {

  private readonly simpleTimer: SimpleTimer = new SimpleTimer();

  readonly gameType = GameTypeEnum.TEST;

  private readonly timerConfig = 60;
  timerCounter = this.timerConfig;
  private timerId!: string | null;
  private readonly timerName = 'Test game';
  private gameStartTime!: number;
  private gameEndTime!: number;
  totalGameTime!: Date;

  checkType(gameType: GameTypeEnum): boolean {
    return gameType === GameTypeEnum.TEST;
  }

  runGame(words: WordResponseDto[]): void {
    super.runGame(words);
    this.simpleTimer.newTimer(this.timerName, 1, true);
    this.subscribeTimer();
    this.gameStartTime = new Date().getTime();
  }

  stopGame(): void {
    super.stopGame();
    this.gameEndTime = new Date().getTime();
    this.totalGameTime = new Date(this.gameEndTime - this.gameStartTime);
    this.unsubscribeTimer();
  }

  protected callbackAfterSelectWord(word: WordResponseDto): void {
    super.callbackAfterSelectWord(word);
    if (!this.wordsColumns[0].some(wordItem => wordItem.isVisible)) {
      this.stopGame();
    }
  }

  private subscribeTimer(): void {
    if (!this.timerId) {
      this.timerId = this.simpleTimer.subscribe(this.timerName, () => this.timerCallback());
    }
  }

  private unsubscribeTimer(): void {
    if (this.timerId) {
      this.simpleTimer.unsubscribe(this.timerId);
      this.timerId = null;
      this.timerCounter = this.timerConfig;
    }
  }

  private timerCallback(): void {
    this.timerCounter--;
    if (this.timerCounter === 0) {
      this.stopGame();
    }
  }
}
