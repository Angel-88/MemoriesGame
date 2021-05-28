import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { WordRequestDto } from './word.request.dto';
import { Observable } from 'rxjs';
import { WordResponseDto } from './word.response.dto';
import { FbCreateResponse } from './fb-create.response';

@Injectable()
export class WordsService {

  constructor(private readonly http: HttpClient) { }

  createUkraineWord(word: WordRequestDto): Observable<WordResponseDto> {
    return this.http.post<FbCreateResponse>(`${environment.fbDbUrl}/ukraineWords.json`, word)
      .pipe(
        map((response: FbCreateResponse) => ({
          ...word,
          id: response.name,
        })),
        tap((response: WordResponseDto) => {
            console.log(response);
          },
        ),
      );
  }

  getWords(): Observable<WordResponseDto[]> {
    return this.http.get<WordResponseDto[]>(`${environment.fbDbUrl}/ukraineWords.json`)
      .pipe(
        map((response: { [key: string]: any }) => {
          return Object
            .keys(response)
            .map(key => ({
              ...response[key],
              id: key,
            }));
        }),
        tap((response: WordResponseDto[]) => {
          console.log(response);
        }),
      );
  }
}
