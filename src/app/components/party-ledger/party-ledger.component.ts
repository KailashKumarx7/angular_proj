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
import { MatTableDataSource } from '@angular/material/table';

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

  //------------------------------------------Date Properties/------------------------------------------
  SBSDate!: string;
  EBSDate!: string;
  date!: string;


  ///------------------------------------------Keys Properties/------------------------------------------
  accountKey!: string;



  ///------------------------------------------Table Contents/------------------------------------------
  tableContent: any;
  voucherDetailsData!: any[];
  voucherDetailsHeading: string[] = ['SN', 'Date', 'V.NO', 'Description', 'Dr.Amount', 'Cr.Amount', 'Balance',];


  ///------------------------------------------Total Counts for table/------------------------------------------
  totalcount: any = {};


  ///------------------------------------------data collection/------------------------------------------
  voucherTypes: any[] = [];


  ///------------------------------------------usable data/------------------------------------------
  selectedAcountData: any = [];
  selectedSDateAndEDate: any = {}
  currentDate: any;
  cooperativeData: any = [];


  ///------------------------------------------Form Groups/------------------------------------------
  partyledger = this._formBuilder.group({
    accountlist: ['']
  });

  ///------------------------------------------Auto-Complete properties/------------------------------------------

  //For Account selection
  options: AccountList[] = [];
  filteredOptions!: Observable<AccountList[]>;

  ///------------------------------------------constructor/------------------------------------------
  constructor(
    private _formBuilder: FormBuilder,
    private getdataService: GetDataService,
    private datePipe: DatePipe,
    private _nepaliDatepickerService: NepaliDatepickerService,
    private printService: PrintService
  ) { }


  ///------------------------------------------OnInit/------------------------------------------
  ngOnInit() {
    const printableContentElement: any = document.querySelector('#printableContent');
    if (printableContentElement) {
      printableContentElement.style.whiteSpace = 'pre-wrap';
      printableContentElement.style.wordBreak = 'break-all';
    }
    this.getAccountList();
    this.getVoucherTypes();

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


  ///------------------------------------------Filter methods for Auto Complete:/------------------------------------
  private _filterAccountlist(value: string | AccountList): AccountList[] {
    const filterValue =
      typeof value === 'string' ? value.toLowerCase() : value.nep_text.toLowerCase();

    return this.options.filter(option =>
      option.nep_text.toLowerCase().includes(filterValue)
    );
  }



  ///------------------------------------------Service Calling method to get/---------------------------------------

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

  //voucherTypes
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

  ///------------------------------------------Buttoms methods/------------------------------------------
  getvalues() {

    const nepalTime = this.getNepalTime();
    this.currentDate = nepalTime;
    // const SBSDate = this.SBSDate;
    // const EBSDate = this.EBSDate;

    const SBSDate = '2080/04/01';
    const EBSDate = '2080/07/01';

    const SADDate = this._nepaliDatepickerService.BSToAD(SBSDate, 'yyyy/mm/dd');
    const EADDate = this._nepaliDatepickerService.BSToAD(EBSDate, 'yyyy/mm/dd');
    // const ac_key = this.accountKey;

    const ac_key = 1;

    const SFormattedADDate = this.datePipe.transform(SADDate, 'yyyy-MM-dd');
    const EFormattedADDate = this.datePipe.transform(EADDate, 'yyyy-MM-dd');


    this.selectedSDateAndEDate = {
      sDate: SFormattedADDate,
      eDate: EFormattedADDate,
    }

    this.getdataService.getPartyledgerByAcKey(ac_key, SFormattedADDate, EFormattedADDate).subscribe(
      (response) => {
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
          const formatedDatePart = this.datePipe.transform(dateParts, 'MM/dd/yyyy');



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

  printDiv() {
    console.log(document.querySelector('#printablepage'));
    this.copryForPrint();
    const printableContentElement = document.querySelector('#printingBox');
    // const printJob: any = window.print();
    // printJob.appendChild(printableContentElement);
    // printJob.start();

    const printingBox = document.getElementById('printingBox');
    printingBox!.classList.add('print');
    window.print();
  }




  ///------------------------------------------template usable methods/------------------------------------------
  endDate($event: string) {
    this.EBSDate = $event;
  }
  startingDate($event: string) {
    this.SBSDate = $event;
  }
  accountSeletd(option: any) {
    this.selectedAcountData = option;

    this.accountKey = option.ac_key;
  }



  ///------------------------------------------Helper Methods/------------------------------------------
  tableBox(data: any, columnHeaders: any) {

    if (!Array.isArray(data)) {
      return 'Invalid data format';
    }

    let tableHtml = '<table style="border:1px solid black;" class="table table-bordered">';
    tableHtml += '<thead><tr>';
    tableHtml += `<th style="width:10px;" class="sn-class">${columnHeaders[0]}</th>`;
    tableHtml += `<th style="width:70px;" class="date-class">${columnHeaders[1]}</th>`;
    tableHtml += `<th style="width:60px;" class="vno-class">${columnHeaders[2]}</th>`;
    tableHtml += `<th style="width:300px;" class="description-class">${columnHeaders[3]}</th>`;
    tableHtml += `<th style="width:100px;" class="dr-amount-class text-end">${columnHeaders[4]}</th>`;
    tableHtml += `<th style="width:100px;" class="cr-amount-class text-end">${columnHeaders[5]}</th>`;
    tableHtml += `<th style="width:100px;" class="balance-class text-end">${columnHeaders[6]}</th>`;


    tableHtml += '</tr></thead>';
    tableHtml += '<tbody>';

    data.forEach((item, index) => {
      tableHtml += '<tr style="font-size:18px;font-weight:400; height:10px;" class="table-row-data">';
      tableHtml += `<td style="width:10px;padding:.3rem;" class="sn-class">${index + 1}</td>`;
      tableHtml += `<td style="width:70px;padding:.3rem;" class="date-class">${item.ed} <br> ${item.ede}</td>`;
      tableHtml += `<td style="width:60px;padding:.3rem;" class="vno-class">${item.v_t_key} <br> ${item.v_no}</td>`;
      tableHtml += `<td style="width:300px;padding:.3rem;" class="description-class">${item.description}</td>`;
      tableHtml += `<td style="width:100px;padding:.3rem;" class="dr-amount-class">${item.dr_amt}</td>`;
      tableHtml += `<td style="width:100px;padding:.3rem;" class="cr-amount-class">${item.cr_amt}</td>`;
      tableHtml += `<td style="width:100px;padding:.3rem;" class="balance-class">${item.balance}</td>`;
      tableHtml += '</tr>';
    });

    tableHtml += '</tbody>';
    tableHtml += '</table>';

    return tableHtml;



    // console.log(newdata);
    // if (!Array.isArray(newdata)) {
    //   return 'Invalid data format';
    // }

    // let tableHtml = '<table class="table">';
    // if (newdata.length > 0) {
    //   tableHtml += '<thead><tr>';
    //   for (const key in newdata[0]) {
    //     if (newdata[0].hasOwnProperty(key)) {
    //       tableHtml += `<th>${key}</th>`;
    //     }
    //   }
    //   tableHtml += '</tr></thead>';
    //   tableHtml += '<tbody>';
    //   newdata.forEach((item) => {
    //     tableHtml += '<tr>';
    //     for (const key in item) {
    //       if (item.hasOwnProperty(key)) {
    //         tableHtml += `<td>${item[key]}</td>`;
    //       }
    //     }
    //     tableHtml += '</tr>';
    //   });
    //   tableHtml += '</tbody>';
    // }
    // tableHtml += '</table>';

    // return tableHtml;


  }

  //to print and make saperate page using this method
  copryForPrint() {
    const headerContent = document.querySelector('#pageHeaderId');
    const footerContent = document.querySelector('#pageFooterId');
    const printingBox = document.querySelector('#printingBox');
    const sourceOfData = this.voucherDetailsData;
    var devidedData = [];
    const lengthOfData = sourceOfData.length;
    const partation = 15;
    const devided = Math.ceil(lengthOfData / partation);

    for (var i = 0; i < devided; i++) {
      let content = `<div class="page">`;

      content += headerContent?.innerHTML;
      let start = i * partation;
      let end = Math.min((i + 1) * partation, lengthOfData);

      for (var j = start; j < end; j++) {
        devidedData.push(sourceOfData[j]);
      }

      const columnHeaders = ['SN', 'Date', 'V.NO', 'Description', 'Dr.Amount', 'Cr.Amount', 'Balance'];
      content += this.tableBox(devidedData, columnHeaders);

      if (i === devided - 1) {
        var totalDrCrAmount = this.totalcount;
        content += `
                <tr>
                    <td style="width:10px;" class="sn-class"></td>
                    <td style="width:70px;" class="date-class"></td>
                    <td style="width:60px;" class="vno-class"></td>
                    <td style="width:300px!important;" class="description-class"> Total</td>
                    <td style="width:100px;" class="dr-amount-class">${totalDrCrAmount.totalDrAmount}</td>
                    <td style="width:100px;" class="cr-amount-class">${totalDrCrAmount.totalCrAmount}</td>
                    <td style="width:100px;" class="balance-class"></td>
                </tr>
            `;
      }
      content += `<div class="row page-footer">
      <div class="col-sm-4">
        <h3>Report Generated By: <strong>EMS</strong></h3>
      </div>
      <div class="col-sm-2 text-sm-center">
        <h5>Page: ${i+1}/${devided-1}</h5>
      </div>
      <div class="col-sm-6 text-end">
        <p>Date/Time ${this.currentDate}</p>
      </div>
    </div>`;
      //content += footerContent?.innerHTML;
      

      content += `</div>`;

      printingBox?.insertAdjacentHTML('beforeend', content);

      devidedData = [];
    }
  }

  //Get Nepali Time
  getNepalTime() {
    const currentDate = new Date();

    // Specify the time zone as "Asia/Kathmandu" for both date and time
    const nepalDateTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      dateStyle: 'medium',
      timeStyle: 'medium'
    }).format(currentDate);
    return nepalDateTime;
  }

}
