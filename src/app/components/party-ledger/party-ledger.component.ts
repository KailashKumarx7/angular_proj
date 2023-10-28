import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NepaliDatepickerService } from 'nepali-datepicker-angular';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { GetDataService } from 'src/app/services/get-data.service';

interface AccountList {
  ac_key: number;
  nep_text: string;
}

@Component({
  selector: 'app-party-ledger',
  templateUrl: './party-ledger.component.html',
  styleUrls: ['./party-ledger.component.css']
})
export class PartyLedgerComponent implements OnInit {
  date!: string;

  SBSDate!:string;
  EBSDate!:string;
  accountKey!:string;
  
  endDate($event: string) {
    this.EBSDate = $event;
  }
  startingDate($event:string){
    this.SBSDate = $event;
  }
  partyledger = this._formBuilder.group({
    //startingdate: [''],
    //lastdate: [''],
    accountlist: ['']
  });

  options: AccountList[] = [];
  filteredOptions!: Observable<AccountList[]>;

  constructor(
    private _formBuilder: FormBuilder,
    private getdataService: GetDataService,
    private datePipe: DatePipe,
    private _nepaliDatepickerService: NepaliDatepickerService
  ) {

    
   }

  ngOnInit() {
    this.getAccountList();

    this.filteredOptions = this.partyledger.get('accountlist')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this._filterAccountlist(value);
        } else if (value && typeof value === 'object' && 'nep_text' in value) {
          const selectedValue = value as AccountList;
          return this._filterAccountlist(selectedValue.nep_text);
        } else {
          return this.options.slice();
        }
      }

      ),
    );
  }

  private _filterAccountlist(value: string | AccountList): AccountList[] {
    const filterValue =
      typeof value === 'string' ? value.toLowerCase() : value.nep_text.toLowerCase();

    return this.options.filter(option =>
      option.nep_text.toLowerCase().includes(filterValue)
    );
  }

  // Get account list
  getAccountList() {
    this.getdataService.getAccountList().subscribe(
      response => {
        this.options = response || []; // Handle null or undefined response
        console.log(response);
      },
      error => {
        console.error('Error fetching account list:', error);
      }
    );
  }
  accountSeletd(option:any){
    this.accountKey = option;
  }

  getvalues() {
    const SBSDate = this.SBSDate;
    const EBSDate = this.EBSDate;
    console.log(SBSDate);
    console.log(EBSDate);
    const SADDate = this._nepaliDatepickerService.BSToAD(SBSDate, 'yyyy/mm/dd');
    const EADDate = this._nepaliDatepickerService.BSToAD(EBSDate,'yyyy/mm/dd');
    const ac_key = this.accountKey;

    const SFormattedADDate = this.datePipe.transform(SADDate,'yyyy-MM-dd');
    const EFormattedADDate = this.datePipe.transform(EADDate,'yyyy-MM-dd');


    console.log(SFormattedADDate);
    console.log(EFormattedADDate);
    console.log(this.accountKey);
    
    this.getdataService.getPartyledgerByAcKey(ac_key, SFormattedADDate, EFormattedADDate).subscribe(
      (response) => {
        // Handle the successful response here
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          // Handle the 404 error here
          console.error("Data Not Found");
        } else {
          // Handle other errors here
          console.error("Error:", error);
        }
      }
    );
    
    
    

  }

}
