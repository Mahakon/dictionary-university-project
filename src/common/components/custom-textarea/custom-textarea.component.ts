import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef, Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-custom-textarea',
  templateUrl: './custom-textarea.component.html',
  styleUrls: ['./custom-textarea.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTextareaComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomTextareaComponent),
      multi: true
    }
  ]
})
export class CustomTextareaComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @ViewChild('textarea') textareaRef: ElementRef;

  words = [''];
  text = '';
  textareaDOMElement: HTMLElement;

  private propagateChange: ((text: string) => void) = _.noop;
  private onDestroy$  = new Subject<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private render: Renderer2
  ) { }

  ngOnInit() {
    this.textareaDOMElement = this.textareaRef.nativeElement;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  changeSelectedWord(word: string) {
    this.propagateChange(word);
  }

  inputText({data, target}) {
    debugger;
    if (!!data) {
      const ruleChar = /[a-z0-9\-а-я]+/i;

      if (!!data.match(ruleChar)) {
        this.words[this.words.length - 1] += data;
      } else {
        this.words.push(data);
      }

      this.deleteExtraTextNode();

      return;
    }

    const text = target.innerText.toString();
    const rule = /[^a-z0-9\-а-я]+/i;

    this.words = text.split(rule);

    this.deleteExtraTextNode();
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
  }

  registerOnValidatorChange(fn: () => void) {
  }

  setDisabledState(isDisabled: boolean) {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  writeValue(text: String) {
  }

  private deleteExtraTextNode() {
    const arr = Array.from(this.textareaDOMElement.childNodes);

    arr.forEach(node => {
      if (node.nodeName === '#text') {
        this.textareaDOMElement.removeChild(node);
      }
    });
    debugger;

    this.moveCaretToLastAddedNode(this.textareaDOMElement.childNodes[this.textareaDOMElement.childNodes.length - 1]);

    this.changeDetectorRef.detectChanges();
  }

  private moveCaretToLastAddedNode(node: Node) {
    debugger
    if (window.getSelection) {
      const textNode = node.firstChild;
      const caret = 0; // insert caret after the 10th character say
      const range = document.createRange();
      range.setStart(textNode, caret);
      range.setEnd(textNode, caret);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}
