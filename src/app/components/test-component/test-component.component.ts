import { Component, ElementRef, Inject } from '@angular/core';
import { GetDataService } from 'src/app/services/get-data.service';
import { PrintService } from 'src/app/services/print.service';
export interface Transaction {
  item: string;
  cost: number;
}
@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent {

  constructor(@Inject(PrintService) private printService: PrintService){

  }
  // displayedColumns = ['SN',
  // 'Date',
  // 'V.NO',
  // 'Description',
  // 'Dr.Amount',
  // 'Cr.Amount',
  // 'Balance',];
  // transactions: any[] = [];
  // constructor(private getDataService:GetDataService){
  //   this.getDataService.getPartyledgerByAcKey(1, '2023-07-17', '2023-10-18').subscribe(
  //     (response) => {
  //       this.transactions=response.allData;
  //     });
  // }

  

  // ngOnInit():void{
    
  // }

  // /** Gets the total cost of all transactions. */
  // getTotalCost() {
  //   return this.transactions.map(t => t.dr_amt).reduce((acc, value) => acc + value, 0);
  // }



    printContent() {
      window.print();
    }

    
  }

