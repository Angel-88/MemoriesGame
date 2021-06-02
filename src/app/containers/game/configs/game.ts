import {GameTypeEnum} from '../shared/enums/game-type.enum';
import {WordResponseDto} from '../../../rest/words/word.response.dto';

export abstract class Game {

  readonly abstract gameType: GameTypeEnum;
  timerCounter!: number;
  totalGameTime!: Date;

  wordsColumns: WordResponseDto[][] = [];
  words: WordResponseDto[] = [];

  score = 0;
  wordsProgress = 0;
  mistake = 0;
  sizeWordsRange = 10;
  protected wordsRangeStartIndex = 0;
  protected wordsRangeEndIndex = this.sizeWordsRange;

  selectedWord!: WordResponseDto | null;
  selectedTranslateWord!: WordResponseDto | null;
  equalingWords = {isWordsEqual: true, selectedWordId: '', selectedTranslateWordId: ''};

  isGameConfigShow = false;
  isModalShow = false;
  isGameRunning = false;
  isGameSectionShow = false;

  protected getWordsRange(startIndex: number, endIndex: number, array: WordResponseDto[]): WordResponseDto[] {
    return array.slice(startIndex, endIndex);
  }

  abstract checkType(gameType: GameTypeEnum): boolean;

  runGame(words: WordResponseDto[]): void {
    this.words = words;
    this.isGameConfigShow = false;
    const shuffledWords = this.shuffle(words).map(word => new WordResponseDto(word));
    const wordsRange = this.getWordsRange(this.wordsRangeStartIndex, this.wordsRangeEndIndex, shuffledWords);
    this.initWordsColumns(wordsRange);
  }

  stopGame(): void {
    this.wordsColumns = [];
    this.isModalShow = true;
    this.isGameRunning = false;
    this.isGameSectionShow = false;
  }

  resetGame(): void {
    this.isModalShow = false;
    this.isGameConfigShow = true;
    this.resetAllGameVariable();
  }

  protected initWordsColumns(wordsRange: WordResponseDto[]): void {
    this.wordsColumns.push(wordsRange);
    const wordsRandom = this.shuffle(wordsRange);
    this.wordsColumns.push(wordsRandom);
  }

  selectWord(columnIndex: number, word: WordResponseDto): void {
    if (columnIndex === 0) {
      this.selectedWord = word;
    } else {
      this.selectedTranslateWord = word;
      this.compareSelectedWords();
      setTimeout(() => {
        word.isVisible = !this.equalingWords.isWordsEqual;
        this.equalingWords = {isWordsEqual: true, selectedWordId: '', selectedTranslateWordId: ''};
      }, 300);
      this.selectedWord = this.selectedTranslateWord = null;
    }
  }

  protected shuffle(array: WordResponseDto[]): WordResponseDto[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  private resetAllGameVariable(): void {
    this.wordsColumns = [];
    this.wordsProgress = 0;
    this.score = 0;
    this.mistake = 0;
    this.wordsRangeStartIndex = 0;
    this.wordsRangeEndIndex = this.sizeWordsRange;
  }

  private compareSelectedWords(): void {
    const equal = this.selectedWord?.id === this.selectedTranslateWord?.id;
    if (equal) {
      this.wordsProgress++;
      this.score++;
    } else {
      this.mistake++;
    }
    this.equalingWords.isWordsEqual = equal;
    this.equalingWords.selectedWordId = this.selectedWord?.id as string;
    this.equalingWords.selectedTranslateWordId = this.selectedTranslateWord?.id as string;
  }
}
