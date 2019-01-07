import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef, Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {Subject, fromEvent, Observable, of} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';
import {ApiService} from '../../services/api.service';
import {FileSaver} from '../../utils/fileSaver/FileSaver';

export const WORD_NODE_NAME = 'SPAN';
export const SPLIT_RULE = /[^a-z0-9\-а-яё]+/i;

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
  @Input() changeChoosenWord$ = of(null);
  @ViewChild('textarea') textareaRef: ElementRef;
  @ViewChild('upload') uploadRef: ElementRef;

  text = '';
  textareaDOMElement: HTMLElement;
  private changeCurrentNode: Observable<any> = of(null);

  private propagateChange: ((text: string) => void) = _.noop;
  private onDestroy$  = new Subject<void>();
  private reader = new FileReader();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private render: Renderer2,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.textareaDOMElement = this.textareaRef.nativeElement;

    this.initTextAreaEvents();

    this.changeChoosenWord$
      .pipe(
        filter((word) => !!word && !!this.apiService.currentWordNode),
        takeUntil(this.onDestroy$)
      )
      .subscribe((word) => {
        this.apiService.currentWordNode.textContent = word;

        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
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

  uploadFile({target}) {
    const file = target.files[0];
    this.reader.readAsText(file);

    this.reader.onloadend = this.onLoadEnd.bind(this);
  }

  downloadText() {
    const text = this.textareaDOMElement.textContent.toString();

    FileSaver.download(new Blob([text]), 'rewriter.txt');
  }

  private onLoadEnd(event) {
    const text = this.reader.result.toString();
    this.text = text;

    const textNode = document.createTextNode(text);

    const arr = Array.from(this.textareaDOMElement.childNodes);

    arr.forEach(node => {
      this.textareaDOMElement.removeChild(node);
    });

    this.textareaDOMElement.appendChild(textNode);

    this.changeDetectorRef.markForCheck();
  }

  private moveCaretToLastAddedNode(node: any, chars: number) {
    if (chars >= 0) {
      const selection = window.getSelection();

      const range = this.createRange(node, { count: chars });

      if (range) {
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  private createRange(node, chars, range?): any {
    if (!range) {
      range = document.createRange();
      range.selectNode(node);
      range.setStart(node, 0);
    }

    if (chars.count === 0) {
      range.setEnd(node, chars.count);
    } else if (node && chars.count > 0) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.length < chars.count) {
          chars.count -= node.textContent.length;
        } else {
          range.setEnd(node, chars.count);
          chars.count = 0;
        }
      } else {
        for (let lp = 0; lp < node.childNodes.length; lp++) {
          range = this.createRange(node.childNodes[lp], chars, range);

          if (chars.count === 0) {
            break;
          }
        }
      }
    }

    return range;
  }

  private getCaretPosition(element) {
    const selection = window.getSelection();
    let caretOffset = 0;
    let container = null;

    if (selection.rangeCount === 1) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();

      preCaretRange.selectNodeContents(element);
      container = preCaretRange.commonAncestorContainer;
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
    return {caretOffset, container};
  }

  private initTextAreaEvents() {
    fromEvent(this.textareaDOMElement, 'mouseup')
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(({target}) => {
        const currentNode = <Node>target;

        if (this.text !== '' && currentNode.nodeName && currentNode.nodeName !== WORD_NODE_NAME) {
          const {caretOffset, container} = this.getCaretPosition(this.textareaDOMElement);
          const {startIndex, endIndex} = this.getWordPosition(caretOffset, container.textContent);

          this.createWord(startIndex, endIndex, container, caretOffset);
        }

      });

    fromEvent(this.textareaDOMElement, 'input')
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe((event) => {
        const node = <Node> event.target;

        this.text = node.textContent;
      });
  }

  private getWordPosition(caretPosition: number, text: string): {startIndex: number, endIndex: number} {
    let startIndex = 0, endIndex = 0;

    if (caretPosition - 1 === 0
      || !!text[caretPosition - 1].match(SPLIT_RULE)
      || caretPosition === text.length
      || !!text[caretPosition].match(SPLIT_RULE)) {

      return {
        startIndex,
        endIndex
      };
    }

    for (let i = caretPosition - 1; i >= 0; i--) {
      if (!!text[i].match(SPLIT_RULE)) {
        break;
      }

      startIndex = i;
    }

    for (let i = caretPosition; i < text.length; i++) {
      if (!!text[i].match(SPLIT_RULE)) {
        break;
      }

      endIndex = i;
    }

    return {
      startIndex,
      endIndex
    };
  }

  private createWord(startIndex: number, endIndex: number, container: Node, positionCaret: number) {
    if (startIndex === 0 && endIndex === 0) {
      return;
    }

    const text = container.textContent;

    const part1 = text.substring(0, startIndex);
    const part2 = text.substring(startIndex, endIndex + 1);
    const part3 = text.substring(endIndex + 1);

    const firstTextNode = document.createTextNode(part1);

    const arr = Array.from(this.textareaDOMElement.childNodes);

    arr.forEach(node => {
      this.textareaDOMElement.removeChild(node);
    });

    const spanNode = document.createElement('span');

    spanNode.appendChild(document.createTextNode(part2));

    this.render.addClass(spanNode, 'red-word');

    const thirdTextNode = document.createTextNode(part3);

    [firstTextNode, spanNode, thirdTextNode].forEach((node) => {
      this.render.appendChild(this.textareaDOMElement, node);
    });

    this.moveCaretToLastAddedNode(spanNode, positionCaret - startIndex);

    this.apiService.currentWordNode = spanNode;

    this.changeCurrentNode = fromEvent(this.apiService.currentWordNode, 'DOMSubtreeModified');

    this.subscribeToNewWord();

    this.changeDetectorRef.markForCheck();

    this.propagateChange(part2);
  }

  private subscribeToNewWord() {
    this.changeCurrentNode
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(({target}) => {
        const text = target.textContent;
        let indexOfSplit = 0;
        const textNodes = text.split(SPLIT_RULE);

        text.split('').forEach((char, index) => {
          if (!!char.match(SPLIT_RULE)) {
            indexOfSplit = index + 1;
          }
        });

        if (textNodes.length > 1) {
          const textNode = document.createTextNode(text);

          this.textareaDOMElement.replaceChild(textNode, this.apiService.currentWordNode);

          this.moveCaretToLastAddedNode(textNode, indexOfSplit);

          this.apiService.currentWordNode = null;

          this.changeDetectorRef.markForCheck();

          return;
        }

        this.propagateChange(text);
      });
  }
}
