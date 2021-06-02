import {Game} from './game';
import {GameTypeEnum} from '../shared/enums/game-type.enum';
import {WordResponseDto} from '../../../rest/words/word.response.dto';

export class StudyGame extends Game {

  readonly gameType = GameTypeEnum.STUDY;

  checkType(gameType: GameTypeEnum): boolean {
    return gameType === GameTypeEnum.STUDY;
  }

  protected callbackAfterSelectWord(word: WordResponseDto): void {
        super.callbackAfterSelectWord(word);
        if (!this.wordsColumns[0].some(wordItem => wordItem.isVisible)) {
        this.wordsColumns = [];
        if (this.words.length <= this.wordsRangeEndIndex) {
          this.words = this.shuffle(this.words);
          this.words.forEach(shuffleWord => shuffleWord.isVisible = true);
          this.wordsRangeStartIndex = 0;
          this.wordsRangeEndIndex = this.sizeWordsRange;
        } else {
          this.wordsRangeStartIndex += this.sizeWordsRange;
          this.wordsRangeEndIndex += this.sizeWordsRange;
        }
        const wordsRange = this.getWordsRange(this.wordsRangeStartIndex, this.wordsRangeEndIndex, this.words);
        this.initWordsColumns(wordsRange);
    }
  }
}
