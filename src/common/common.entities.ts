import {HttpHeaders} from '@angular/common/http';

export const BACK_HOST = 'http://192.168.0.100:8080';

export const COMMON_OPTIONS = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': BACK_HOST,
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': [ 'Content-Type', '*']
  }),
  withCredentials: true
};

export interface IWordInfo {
  word: string;
  pos: string;
  synonyms: ISynonyms[];
}

export interface ISynonyms {
  synonym: string;
  initial: string;
}

export interface IStatisticsWord {
  word: string;
  replacement: string;
}
