import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {IStatisticsWord, ISynonyms} from '../../common/common.entities';
import {ApiService} from '../../common/services/api.service';

@Component({
  selector: 'app-rewriter',
  templateUrl: './rewriter.component.html',
  styleUrls: ['./rewriter.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RewriterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  currentSynonyms: ISynonyms[] = [];
  changeChoosenWord$ = new Subject<string>();
  normalWordForm = '';
  wordForm = '';
  notFound = true;

  get word(): string {
    return this.textControl.value;
  }

  private onDestroy$ = new Subject<void>();

  private get textControl(): AbstractControl {
    return this.form.get('text');
  }

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      text: ['']
    });

    this.textControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((word) => {
        this.apiService.getWordInfo(word)
          .pipe(
            tap((info) => {
              if (!info) {
                this.notFound = false;
                this.normalWordForm = this.word;
                this.wordForm = '';
                this.currentSynonyms = [];

                this.changeDetectorRef.markForCheck();
              }
            }),
            filter((info) => !!info)
          )
          .subscribe((info) => {
            this.notFound = true;
            this.currentSynonyms = info.synonyms;
            this.normalWordForm = info.word;
            this.wordForm = info.pos;

            this.changeDetectorRef.markForCheck();
          });
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  changeWordValue(e: {statistics: IStatisticsWord, synonym: string}) {
    this.changeChoosenWord$.next(e.synonym);

    if (!!this.apiService.currentWordNode) {
      this.apiService.sendStatistics(e.statistics).subscribe();
    }
  }

}
