export class WordRequestDto {
  isVisible!: boolean;
  word!: string;
  translateWord!: string;

  constructor(data?: WordRequestDto) {
    if (data) {
      this.isVisible = data.isVisible;
      this.word = data.word;
      this.translateWord = data.translateWord;
    }
  }
}
