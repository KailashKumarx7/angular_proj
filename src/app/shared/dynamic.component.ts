import { Component, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dynamic-component',
  template: '<ng-container *ngTemplateOutlet="template"></ng-container>',
})
export class DynamicComponent {
  @Input() template: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
