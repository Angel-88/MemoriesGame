export class WordResponseDto {
  isVisible!: boolean;
  word!: string;
  translateWord!: string;
  id!: string;

  constructor(data?: WordResponseDto) {
    if (data){
      this.isVisible = data.isVisible;
      this.word = data.word;
      this.translateWord = data.translateWord;
      this.id = data.id;
    }
  }
}
