import { ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef, Injectable, EmbeddedViewRef, ViewContainerRef } from '@angular/core';
import { DynamicComponent } from './dynamic.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicHtmlService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  createComponentAndInsertHtml(template: any, viewContainerRef: ViewContainerRef): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DynamicComponent);

    const componentRef = componentFactory.create(this.injector);
    componentRef.instance.template = template;

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    viewContainerRef.element.nativeElement.appendChild(domElem);

    return componentRef;
  }
}
