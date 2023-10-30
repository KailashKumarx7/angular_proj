import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { response } from 'express';
import NepaliDate from 'nepali-date-converter';
import { NepaliDatepickerService } from 'nepali-datepicker-angular';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { GetDataService } from 'src/app/services/get-data.service';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { PrintService } from 'src/app/services/print.service';

interface AccountList {
  ac_key: number;
  nep_text: string;
}

interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-party-ledger',
  templateUrl: './party-ledger.component.html',
  styleUrls: ['./party-ledger.component.css']
})
export class PartyLedgerComponent implements OnInit {
  date!: string;

  SBSDate!: string;
  EBSDate!: string;
  accountKey!: string;
  nepaliDateInstance = new NepaliDate();
  dateone = new NepaliDate(new Date(2024, 2, 7)).toJsDate;


  totalDrAmt = 0;
  totalCrAmt = 0;
  totalcount: any = {};


  //data
  voucherTypes: any[] = [];
  voucherDetailsHeadingg!: string[];

  selectedAcountData: any = [];
  selectedSDateAndEDate: any = {}
  currentDate: any;

  cooperativeData: any = [];

  voucherDetailsData!: any[]; // Ensure that your data array has the correct property names
  voucherDetailsHeading: string[] = [
    'SN',
    'Date',
    'V.NO',
    'Description',
    'Dr.Amount',
    'Cr.Amount',
    'Balance',
  ];


  endDate($event: string) {
    this.EBSDate = $event;
  }
  startingDate($event: string) {
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
    private _nepaliDatepickerService: NepaliDatepickerService,
    private printService: PrintService
  ) {


  }

  ngOnInit() {
    const printableContentElement: any = document.querySelector('#printableContent');
    if (printableContentElement) {
      printableContentElement.style.whiteSpace = 'pre-wrap';
      printableContentElement.style.wordBreak = 'break-all';
    }
    this.getAccountList();
    this.getVoucherTypes();
    var data = this.dateone
    console.log(data);
    this.convertToNepaliDate('2024-02-07');

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
        // console.log(response);
      },
      error => {
        console.error('Error fetching account list:', error);
      }
    );
  }

  getVoucherTypes() {
    this.getdataService.getVoucherTypes().subscribe(
      response => {
        this.voucherTypes = response;
        //console.log(response);
      },
      error => {
        console.error('error ', error)
      }
    )
  }
  accountSeletd(option: any) {
    this.selectedAcountData = option;

    this.accountKey = option.ac_key;
  }

  getvalues() {
    console.log(this.selectedAcountData);
    this.currentDate = new Date();
    const SBSDate = this.SBSDate;
    const EBSDate = this.EBSDate;
    console.log(SBSDate);
    console.log(EBSDate);
    const SADDate = this._nepaliDatepickerService.BSToAD(SBSDate, 'yyyy/mm/dd');
    const EADDate = this._nepaliDatepickerService.BSToAD(EBSDate, 'yyyy/mm/dd');
    const ac_key = this.accountKey;

    const SFormattedADDate = this.datePipe.transform(SADDate, 'yyyy-MM-dd');
    const EFormattedADDate = this.datePipe.transform(EADDate, 'yyyy-MM-dd');


    console.log(SFormattedADDate);
    console.log(EFormattedADDate);
    console.log(this.accountKey);

    this.selectedSDateAndEDate = {
      sDate: SFormattedADDate,
      eDate: EFormattedADDate,
    }

    this.getdataService.getPartyledgerByAcKey(ac_key, SFormattedADDate, EFormattedADDate).subscribe(
      (response) => {
        // Handle the successful response here
        //console.log(response.cooperativeData);
        this.cooperativeData = response.cooperativeData;
        const voucherDetailData: any[] = response.allData;
        const vtdata: any[] = this.voucherTypes;
        let previousBalance = 0;

        let totalDrAmount = 0;
        let totalCrAmount = 0;

        const mappedData = voucherDetailData.map(item => {
          const vttext = vtdata.find(vtitem => vtitem.vt_key === item.v_t_key);
          const dateParts = item.ed.split(' '); // Split the date and time
          const parts = dateParts[0].split('/');
          var day = Number(parts[1]) + 1;
          var datefinal = parts[2] + '-' + parts[0] + '-' + day;
          const bsDate = adToBs(datefinal);
          var dramt = item.dr_amt;
          var cramt = item.cr_amt;
          const currentBalance = Number(previousBalance) + Number(dramt) - Number(cramt);
          previousBalance = currentBalance;
          const formatedbalance = formatNumber(currentBalance);

          totalDrAmount += Number(dramt);
          totalCrAmount += Number(cramt);




          // Format dramt
          if (dramt === 0) {
            dramt = '';
          } else {
            dramt = formatNumber(dramt);
          }

          // Format cramt
          if (cramt === 0) {
            cramt = '';
          } else {
            cramt = formatNumber(cramt);
          }



          // Function to format numbers



          const formatedDatePart = this.datePipe.transform(dateParts, 'MM/dd/yyyy');
          //console.log(formatedDatePart)


          return {
            ...item,
            v_t_key: vttext ? vttext.code : item.v_t_key,
            ed: bsDate,
            ede: dateParts[0],
            dr_amt: dramt,
            cr_amt: cramt,
            balance: formatedbalance
          };
        });
        this.voucherDetailsData = mappedData;
        const formattedTotalDrAmount = formatNumber(totalDrAmount);
        const formattedTotalCrAmount = formatNumber(totalCrAmount);

        this.voucherDetailsData = mappedData;

        const totalcount = {
          totalDrAmount: formattedTotalDrAmount,
          totalCrAmount: formattedTotalCrAmount,
        };

        this.totalcount = totalcount;
        this.voucherDetailsData.forEach(item => {
          this.totalDrAmt += item.dr_amt;
          this.totalCrAmt += item.cr_amt;
        });

        function formatNumber(number: number) {
          // Check if the number has decimal places
          if (Number.isInteger(number)) {
            return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else {
            return number.toLocaleString('en-US');
          }
        }

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


  convertToNepaliDate(adDate: string) {

    const bsDate = adToBs(adDate);
    console.log(bsDate);

  }

  getDrAmount() {
    return this.totalDrAmt;
  }

  getCrAmount() {

    return this.totalCrAmt;
  }



  printDiv() {


    const printableContentElement = document.querySelector('#printableContent');
    const printJob: any = window.print();
    printJob.appendChild(printableContentElement);
    printJob.start();

  }

  
  
  
  

  // Function to trigger printing
  printContent() {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow!.document.open();
    printWindow!.document.write('<html><head><link rel="stylesheet" type="text/css" href="your-styles.css"></head><body>');
    printWindow!.document.write('<div class="container mat-elevation-z8 pb-5">');
    printWindow!.document.write(document.getElementById('printableContent')!.innerHTML);
    printWindow!.document.write('</div></body></html>');
    printWindow!.document.close();
    printWindow!.print();
    printWindow!.close();
  }


}
