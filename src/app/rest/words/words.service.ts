import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {WordRequestDto} from './word.request.dto';
import {WordResponseDto} from './word.response.dto';
import {FbCreateResponse} from './fb-create.response';

@Injectable()
export class WordsService {

  constructor(private readonly http: HttpClient) { }

  addUkraineWord(word: WordRequestDto): Observable<WordResponseDto> {
    return this.http.post<FbCreateResponse>(`${environment.fbDbUrl}/ukraineWords.json`, word)
      .pipe(
        map((response: FbCreateResponse) => ({
          ...word,
          id: response.name,
        })),
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
      );
  }

  deleteWord(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/ukraineWords/${id}.json`);
  }
}
