import {Component, OnInit} from '@angular/core';
import {WordsService} from '../../rest/words/words.service';
import {WordRequestDto} from '../../rest/words/word.request.dto';
import {Observable} from 'rxjs';
import {WordResponseDto} from '../../rest/words/word.response.dto';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})

export class AdminComponent implements OnInit {

  words$!: Observable<WordResponseDto[]>;
  words!: WordResponseDto[];
  form: FormGroup = new FormGroup({
    word: new FormControl(null, Validators.required),
    translateWord: new FormControl(null, Validators.required),
  });

  constructor(private readonly wordsService: WordsService) { }

  ngOnInit(): void {
    this.initWords();
  }

  addWord(): void {
    const word = this.form.controls.word.value.toLowerCase();
    const translateWord = this.form.controls.translateWord.value.toLowerCase();
    const myWord: WordRequestDto = {word, isVisible: true, translateWord};
    this.wordsService.addUkraineWord(myWord).subscribe(res => {
      this.words.push(res);
      this.form.reset();
    });
  }


  deleteWord(id: string): void {
    this.wordsService.deleteWord(id).subscribe(() => {
      this.words = this.words.filter(word => word.id !== id);
    });
  }

  private initWords(): void {
    this.words$ = this.wordsService.getWords();

    this.words$.subscribe(data => {
      this.words = data;
      this.words.map(word => new WordResponseDto(word));
    });
  }
}
