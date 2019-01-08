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
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.less'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SpinnerComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
