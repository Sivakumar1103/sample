import {
    Directive,
    ElementRef,
    Renderer2,
    HostListener,
    forwardRef,
    Input,
    OnInit,
    HostBinding
  } from '@angular/core';
  import debounceFn from 'lodash';

  import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BitlyAKService } from '../services/socialmedia/bitly.ak.service';

  @Directive({
    selector: '[contenteditable]',
    providers:
    [
      { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ContentEditableFormDirective), multi: true }
    ]
  })
  export class ContentEditableFormDirective implements ControlValueAccessor {

    @HostBinding('attr.contenteditable') enabled = true;
  
    private onChange!: (value: string) => void;
    private onTouched!: () => void;
    private removeDisabledState!: () => void;
    finalrange = 0;
    childNodes = 0;
    constructor(private elementRef: ElementRef, private renderer: Renderer2,private bitlyService:BitlyAKService) { }
    @HostListener('keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {

      if (window.getSelection && window?.getSelection()?.getRangeAt) {
        var ranges:any = window?.getSelection()?.getRangeAt(0);
        var selectedObj:any = window.getSelection();
        var rangeCount = 0;
        var childNodes:any = selectedObj?.anchorNode?.parentNode.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
          if (childNodes[i] == selectedObj.anchorNode) {
            childNodes = i;
            break;
          }
          if (childNodes[i].outerHTML)
            rangeCount += childNodes[i].outerHTML.length;
          else if (childNodes[i].nodeType == 3) {
            childNodes = i;
          }
        }
        this.finalrange =  ranges.startOffset + rangeCount;
      }
  }
    @HostListener('input') onInput(): void {
      this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML',this.bitlyService.replaceURLs(this.elementRef.nativeElement.innerText)||'');
      this.onChange(this.elementRef.nativeElement.innerText);
      var selection:any = window.getSelection();
      var range = document.createRange();
      var div:any = document.getElementById('contentTagDiv');
      if(div.childNodes.length>0){
      range.setStart(div.childNodes[this.childNodes?this.childNodes:div.childNodes.length-1], 
        div.childNodes[this.childNodes?this.childNodes:div.childNodes.length-1].nodeType != 
        Node.TEXT_NODE?1:div.childNodes[this.childNodes?0:div.childNodes.length-1].textContent.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      div.focus();
    }
      // this.bitlyService.sharedDataUrls.next("");
    }
  
    @HostListener('blur') onBlur(): void {
      // this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML',this.bitlyService.replaceURLs(this.elementRef.nativeElement.innerText)||'');
      this.onTouched();
    }
   
    writeValue(value: string): void {
  
      this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML',value);
    }
  
    registerOnChange(onChange: (value: string) => void): void {
      this.onChange = onChange;
    }
  
    registerOnTouched(onTouched: () => void): void {
      this.onTouched = onTouched;
    }
  
    setDisabledState(disabled: boolean): void {
      this.enabled = !disabled;
    }
  }


  export function getCaretIndex(element:any) {
    let position:any = 0;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
      const selection = window.getSelection();
      if (selection?.rangeCount !== 0) {
        const range:any = window?.getSelection()?.getRangeAt(0);
        const preCaretRange = range?.cloneRange();
        preCaretRange?.selectNodeContents(element);
        preCaretRange?.setEnd(range?.endContainer, range?.endOffset);
        position = preCaretRange?.toString().length;
      }
    }
    return position;
  }

