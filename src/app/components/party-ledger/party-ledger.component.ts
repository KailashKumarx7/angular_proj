import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  partyledger = this._formBuilder.group({
    startingdate: [''],
    lastdate: [''],
    accountlist: ['']
  });

  options: AccountList[] = [];
  filteredOptions!: Observable<AccountList[]>;

  constructor(
    private _formBuilder: FormBuilder,
    private getdataService: GetDataService
  ) {}

  ngOnInit() {
    this.getAccountList();

    this.filteredOptions = this.partyledger.get('accountlist')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        if(typeof value === 'string'){
          return this._filterAccountlist(value);
        }else if(value && typeof value === 'object' && 'nep_text' in value){
          const selectedValue = value as AccountList;
          return this._filterAccountlist(selectedValue.nep_text);
        }else{
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
}
