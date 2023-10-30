import { ElementRef, Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  printDivWithSharableBody(element: ElementRef) {
    const divContent = element.nativeElement;

    // Get the header and footer elements
    const headerElement = divContent.querySelector('.header');
    const footerElement = divContent.querySelector('.footer');

    // Remove the body element from the print document
    divContent.querySelector('.body').remove();

    // Create a new document to print the div content
    const printDocument = this.document.implementation.createHTMLDocument('Print');

    // Add the header and footer elements to the print document
    printDocument.body.appendChild(headerElement.cloneNode(true));
    printDocument.body.appendChild(footerElement.cloneNode(true));

    // Split the body element into pages
    const bodyPages = [];
    const bodyRows = divContent.querySelectorAll('.body tr');
    for (let i = 0; i < bodyRows.length; i += 10) {
      const page = document.createElement('div');
      for (let j = i; j < i + 10; j++) {
        page.appendChild(bodyRows[j].cloneNode(true));
      }
      bodyPages.push(page);
    }

    // Add the body pages to the print document
    for (const page of bodyPages) {
      printDocument.body.appendChild(page);
    }

    // Print the print document
    printDocument.execCommand('print', false,'');
  }
}
