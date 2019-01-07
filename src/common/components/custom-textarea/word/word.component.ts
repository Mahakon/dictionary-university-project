import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.less']
})
export class WordComponent implements OnInit, OnDestroy {
  @Input() text: string;
  @Output() selected = new EventEmitter<string>();

  private onDestroy$ = new Subject<void>();

  @HostListener('mouseup') click() {
    this.selected.next(this.text);
  }

  constructor(
    private elementRef: ElementRef,
    private render: Renderer2
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

}
