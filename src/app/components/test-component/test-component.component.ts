import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { GetDataService } from 'src/app/services/get-data.service';
import { PrintService } from 'src/app/services/print.service';
import { NepaliDatepickerService } from 'nepali-datepicker-angular';


export interface Transaction {
  item: string;
  cost: number;
}
@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})
export class TestComponentComponent implements OnInit{
  date:string='';
  constructor(
    private _nepaliDatepickerService: NepaliDatepickerService,

  ){
    
  }
  ngOnInit(): void {
   
  }

  startingDate($event:any){

  }
    
  }

