import { Component, OnInit } from '@angular/core';
import { WordsService } from '../../rest/words/words.service';
import { WordRequestDto } from '../../rest/words/word.request.dto';

@Component({
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})

export class AdminComponent implements OnInit {
  constructor(private readonly wordsServise: WordsService) { }

  ngOnInit() {
    this.getWords();
  }

  addWord() {
    const word: WordRequestDto =  {word:'car'+ 3,isVisible: true, translateWord: 'автомобіль'}
    this.wordsServise.createUkraineWord(word).subscribe();
  }

  getWords(){
    this.wordsServise.getWords().subscribe();
  }
}
