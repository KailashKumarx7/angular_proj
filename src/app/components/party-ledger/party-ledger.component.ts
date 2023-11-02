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
  softwareName:any=[];


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
        //console.log(response.softwareNames);
        this.softwareName = response.softwareNames;
        console.log(this.softwareName.application_name);
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
          const formatedbalance = this.formatNumber(currentBalance);

          totalDrAmount += Number(dramt);
          totalCrAmount += Number(cramt);

          // Format dramt
          if (dramt === 0) {
            dramt = '';
          } else {
            dramt = this.formatNumber(dramt);
          }

          // Format cramt
          if (cramt === 0) {
            cramt = '';
          } else {
            cramt = this.formatNumber(cramt);
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
        const formattedTotalDrAmount = this.formatNumber(totalDrAmount);
        const formattedTotalCrAmount = this.formatNumber(totalCrAmount);

        this.voucherDetailsData = mappedData;

        const totalcount = {
          totalDrAmount: formattedTotalDrAmount,
          totalCrAmount: formattedTotalCrAmount,
        };

        this.totalcount = totalcount;




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

    let tableHtml = '<table style="border-top: 1px solid black!important; border-bottom: 2px solid black!important; border-left: 0; border-right: 0 ;  margin-right:1px; margin-bottom:0!important; " class="table table-bordered">';
    tableHtml += '<thead><tr style="font-size:17px;">';
    tableHtml += `<th style="width:10px;" class="sn-class">${columnHeaders[0]}</th>`;
    tableHtml += `<th style="width:70px;" class="date-class">${columnHeaders[1]}</th>`;
    tableHtml += `<th style="width:60px;" class="vno-class">${columnHeaders[2]}</th>`;
    tableHtml += `<th class="description-class">${columnHeaders[3]}</th>`;
    tableHtml += `<th style="width:110px;text-align:end;" class="dr-amount-class text-end">${columnHeaders[4]}</th>`;
    tableHtml += `<th style="width:110px;text-align:end;" class="cr-amount-class text-end">${columnHeaders[5]}</th>`;
    tableHtml += `<th style="width:110px;text-align:end;" class="balance-class text-end">${columnHeaders[6]}</th>`;


    tableHtml += '</tr></thead>';
    tableHtml += '<tbody>';
    let previousEd: any = null;
    let rowBackgroundColor = '';
    data.forEach((item, index) => {
      let balance = parseFloat(item.balance.replace(/,/g, ''));
      let balanceLabel = "Cr"; // Default label

      if (balance < 0) {
        balance = Math.abs(balance);
        console.log('Negative balance:', balance);
        balanceLabel = "Cr";
      } else {
        console.log('Positive balance:', balance);
        balanceLabel = "Dr";
      }

      if (item.ed === null || item.ed !== previousEd) {
        rowBackgroundColor = 'table-secondary';
      }

      // tableHtml += '<tr style="font-size:11px;font-weight:500; height:5px;padding:0;" class="table-row-data">';
      tableHtml += '<tr style="font-size: 11px; font-weight: 500; height: 5px; padding: 0; " class="table-row-data '+rowBackgroundColor+'">';
      tableHtml += `<td style="width:10px;padding:.07rem;" class="sn-class text-center">${index + 1}</td>`;
      tableHtml += `<td style="width:70px;padding:.07rem;" class="date-class">${item.ed} <br> ${item.ede}</td>`;
      tableHtml += `<td style="width:60px;padding:.07rem;" class="vno-class text-center">${item.v_t_key} <br> ${item.v_no}</td>`;
      tableHtml += `<td style="padding:.07rem; padding-left:2px!important;" class="description-class">${item.description}</td>`;
      tableHtml += `<td style="width:110px;text-align:end;padding:.07rem; " class="dr-amount-class">${item.dr_amt}</td>`;
      tableHtml += `<td style="width:110px;text-align:end;padding:.07rem;" class="cr-amount-class">${item.cr_amt}</td>`;
      tableHtml += `<td style="width:110px;text-align:end;padding:.07rem;" class="balance-class">${this.formatNumber(balance)}<br> ${balanceLabel}</td>`;
      tableHtml += '</tr>';
      previousEd = item.ed;
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
    const partation = 18;
    const devided = Math.ceil(lengthOfData / partation);

    for (var i = 0; i < devided; i++) {
      let content = `<div style="border:2px solid black; margin-top:30px" class="page">`;

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
        content += `<table style="border:1px solid black;">
                <tr>
                    <td style="width:10px;padding:.3rem;" class="sn-class"></td>
                    <td style="width:70px;padding:.3rem;" class="date-class"></td>
                    <td style="width:60px;padding:.3rem;" class="vno-class"></td>
                    <td style="width:300px;padding:.3rem;" class="description-class"> Total</td>
                    <td style="width:110px;text-align:end;padding:.3rem;" class="dr-amount-class">${totalDrCrAmount.totalDrAmount}</td>
                    <td style="width:110px;padding:.3rem;" class="cr-amount-class">${totalDrCrAmount.totalCrAmount}</td>
                    <td style="width:110px;padding:.3rem;" class="balance-class"></td>
                </tr>
                </table>
            `;
      }
      // content += `<div style="padding:0!important;margin-top:0!important; height:10px;" class="row page-footer">
      //             <div style="padding-top:0!important; margin-top:0!important;" class="col-sm-4">
      //               <span style="margin-top:0!important;">Report Generated By: <strong>EMS</strong></span>
      //             </div>
      //             <div style="padding-top:0!important;margin-top:0!important;" class="col-sm-2 text-sm-center">
      //               <span style="margin-top:0!important;">Page: ${i+1}/${devided}</span>
      //             </div>
      //             <div style="padding-top:0!important;margin-top:0!important;" class="col-sm-6 text-end">
      //               <span style="margin-top:0!important;">Date/Time ${this.currentDate}</span>
      //             </div>
      //           </div>`;

      content += `<div style="padding: 0; top: 0!important; height: 20px; text-align: center;" class=" row page-footer ">
                <div style="padding:0;margin-top: 0;" class="col-lg-4 col-md-4 col-sm-4">
                <span style="margin-right: 10px; margin-top: 0;">Report Generated By : <strong>${this.softwareName.application_name}</strong></span>
                
                </div>
                <div style="padding:0;margin-top: 0;" class="col-lg-2 col-md-2 col-sm-2">
                <span style="margin-right: 10px; margin-top: 0;">Page: ${i + 1}/${devided}</span>

                </div>
                <div style="padding:0;margin-top: 0;" class="col-lg-6 col-md-6 col-sm-6">
                <span style="margin-top: 0;">Date/Time ${this.currentDate}</span>
                
                </div>

              </div>
              
            `;
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

  formatNumber(number: number) {
    // Check if the number has decimal places
    if (Number.isInteger(number)) {
      return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

}
