import {Injectable, Input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BACK_HOST, COMMON_OPTIONS, IStatisticsWord, IWordInfo} from '../common.entities';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  currentWordNode: Node = null;

  constructor(private http: HttpClient) { }

  getWordInfo(word: string): Observable<IWordInfo> {
    const url = BACK_HOST + `/info/${word}`;

    return this.http.get<{info: [IWordInfo]}>(url, COMMON_OPTIONS)
      .pipe(map((response) => response.info[0]));
  }

  sendStatistics(stat: IStatisticsWord): Observable<any> {
    const url = BACK_HOST + `/stats`;

    return this.http.post(url, stat, COMMON_OPTIONS);
  }
}
