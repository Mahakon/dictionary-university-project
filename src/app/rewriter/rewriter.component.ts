import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-rewriter',
  templateUrl: './rewriter.component.html',
  styleUrls: ['./rewriter.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RewriterComponent implements OnInit, OnDestroy {
  form: FormGroup;

  private onDestroy$ = new Subject<void>();

  private get textControl(): AbstractControl {
    return this.form.get('text');
  }

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      text: ['']
    });

    this.textControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((word) => {
        debugger;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

}
