import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCommaNumber]'
})
export class CommaNumberDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/,/g, ''); // Remove existing commas
    value = value.replace(/\D/g, ''); // Remove non-numeric characters
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas every three digits

    input.value = value;
  }
}
