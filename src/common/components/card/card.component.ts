import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IStatisticsWord, ISynonyms} from '../../common.entities';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() word = '';
  @Input() wordForm = '';
  @Input() items: ISynonyms[] = [];
  @Input() notFound = true;
  @Output() selectedItem = new EventEmitter<{statistics: IStatisticsWord, synonym: string}>();

  get googleHref(): string {
    return `https://www.google.com/search?q=${this.word}`;
  }

  get currentFlag(): boolean {
    return this.notFound;
  }

  private onDestroy$ = new Subject<void>();

  constructor() { }

  ngOnInit() {}

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  choseItem(item: ISynonyms) {
    this.selectedItem.next({
      statistics: {
        replacement: item.initial,
        word: this.word
      },
      synonym: item.synonym
    });
  }

}
