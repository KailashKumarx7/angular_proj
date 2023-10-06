import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { response } from 'express';
import { Observable, map, startWith } from 'rxjs';
import { Category } from 'src/app/model/models';
import { AccountEntryService } from 'src/app/services/account-entry.service';

@Component({
  selector: 'app-account-entry',
  templateUrl: './account-entry.component.html',
  styleUrls: ['./account-entry.component.css']
})
export class AccountEntryComponent {

  @ViewChild('hCodeInput') hCodeInput!: ElementRef;
  @ViewChild('sheadcode') sheadcode!:ElementRef;
  @ViewChild('accountCode') accountCode!:ElementRef;
  selectedCategoryId!: Number;

  selectedHeadRow: any;
  selectedSubHeadRow:any;
  selectedAccountRow:any;

  //buttons 
  head_new_btn: boolean = false;
  head_modify_btn: boolean = false;
  head_save_btn: boolean = false;
  sub_head_new_btn: boolean = false;
  sub_head_modify_btn: boolean = false;
  sub_head_save_btn: boolean = false;
  account_new_btn: boolean = false;
  account_modify_btn: boolean = false;
  account_save_btn: boolean = false;



  //flags
  head_flag!: number;
  sub_head_flag!: number;
  account_flag!: number;



  //keys
  cat_key!: number;
  head_key!: number;
  subHead_key!: number;
  account_key!: number;



  selectedCategory: any;
  filteredOptions: any;
  categories: Category[] = [];

  categoryCtrl = new FormControl();
  CategoryOption!: any[];
  CategoryFilteredOptions!: Observable<any[]>;

  displayedColumns = ['position', 'code', 'name'];
  headDataSource: any;
  subheadDataSource: any;

  displayedAccountColumns: string[] = ['position', 'A/C code', 'Account', 'D.per%'];
  accountDataSource: any;


  //Form Group
  wholeAccountGroup!: FormGroup;
  headFormGroup!: FormGroup;
  subHeadFormGroup!: FormGroup;
  accountFormGroup!: FormGroup;





  constructor(
    private accountService: AccountEntryService,
    private _formBuilder: FormBuilder,
  ) {
    this.CategoryOption = [];

    this.headFormGroup = this._formBuilder.group({
      h_code: ['', [Validators.required]],
      h_nep_text: ['', [Validators.required]],

    });
    this.subHeadFormGroup = this._formBuilder.group({
      sub_head_code: [''],
      sub_head_text: [''],

    });

    this.accountFormGroup = this._formBuilder.group({
      ac_code: ['', [Validators.required]],
      ac_nep_text: ['', [Validators.required]],
      billing: ['', [Validators.required]],
      master_item: ['', [Validators.required]]
    });

    this.wholeAccountGroup = this._formBuilder.group({
      headFormGroup: this.headFormGroup,
      subHeadFormGroup: this.subHeadFormGroup,
      accountFormGroup: this.accountFormGroup
    })
  }

  ngOnInit(): void {

    this.CategoryFilteredOptions = this.categoryCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this._filterCategory(value);
        } else if (value && typeof value === 'object') {
          const selectedValue = value;
          return this._filterCategory(selectedValue);
        } else {
          return this.CategoryOption.slice();
        }
      })
    )
    this.accountService.getCategory().subscribe((data) => {
      this.CategoryOption = data;
      console.log(data);
    });



  }

  _filterCategory(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CategoryOption.filter(option => option.eng_text.toLowerCase().includes(filterValue));
  }

  selectCategory(event: any) {
    this.selectedCategoryId = event.target.value;
    console.log(this.selectedCategoryId);


  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.CategoryFilteredOptions.subscribe(options => {
      const selectedCatKey = event.option.value;
      const selectedOption = options.find(option => option.eng_text === selectedCatKey);
      console.log(selectedOption);
      this.cat_key = selectedOption.id;

      this.accountService.getHeadByCatId(selectedOption.id).subscribe(
        (response) => {

          this.headDataSource = response;
          this.head_new_btn = true;

        }
      );
      this.accountService.getSubheadByCatId(selectedOption.id).subscribe(
        (response) => {
          this.subheadDataSource = response;

        }
      );

      this.accountService.getAccountByCatKey(selectedOption.id).subscribe(
        (response) => {
          this.accountDataSource = response;
          //console.log(response);
        }
      )
    })

  }


  selectHead(element: any) {
    this.head_modify_btn = true;
    const head_key = element.head_key;
    this.head_key = head_key;
    const h_code = element.h_code;
    const h_nep_text = element.nep_text;

    this.headFormGroup.patchValue({
      h_code: h_code,
      h_nep_text: h_nep_text
    });

    this.accountService.getSuhheadByHeadKey(head_key).subscribe(
      (response) => {
        this.subheadDataSource = response
        this.sub_head_new_btn = true;
      }
    )

  }

  newHeadBtn(number: number) {
    this.head_flag = number;
    this.head_save_btn = true;
  }

  saveHeadForm() {
    const head_flag = this.head_flag;
    const h_code = this.headFormGroup.get('h_code')!.value;
    const h_nep_text = this.headFormGroup.get('h_nep_text')!.value;
    const cat_key = this.cat_key;
    const user_key = localStorage.getItem('user_key');
    const currentDate = new Date();
    const formatedDate = currentDate.toISOString();

    const headData = {
      h_code:h_code,
      nep_text:h_nep_text,
      item_key:0,
      cat_key:cat_key,
      head_key:0,
      del_key:0,
      ldm:formatedDate,
      eng_text:h_nep_text,
      inst_key:0,
      dec_code:0,
      h_code_num:h_code,
    }

    const updateHeadData={
      h_code:h_code,
      nep_text:h_nep_text,
      item_key:0,
      cat_key:cat_key,
      del_key:0,
      ldm:formatedDate,
      eng_text:h_nep_text,
      inst_key:0,
      dec_code:0,
      h_code_num:h_code,
    }



    if (head_flag === 1) {
      console.log(headData);
      this.accountService.addHead(headData).subscribe(
        (response)=>{
          console.log(response);
        }
      )
    } else if (head_flag === 2) {
      console.log("modify flag or action")
    } else {
      console.log("please select flag using new or modefy then u can save changes")
    }
  }

  updateHeadBtn(number: number) {
    this.head_flag = number;
    this.head_save_btn = true;
  }

  newSubHeadBtn(number: number) {
    this.sub_head_flag = number;
    this.sub_head_save_btn = true;
  }

  updateSubHeadBtn(number: number) {
    this.sub_head_flag = number;
    this.sub_head_save_btn = true;
  }

  saveSubHeadForm() {

  }

  selectSubHead(element: any) {
    const subHeadKey = element.sub_head_key;
    this.subHead_key = subHeadKey;
    this.sub_head_modify_btn = true;
    const sub_head_code = element.sub_head_code;
    const sub_head_text = element.sub_head_text;
    this.subHeadFormGroup.patchValue({
      sub_head_code: sub_head_code,
      sub_head_text: sub_head_text
    })

    this.accountService.getAccountBySubHeadKey(subHeadKey).subscribe(
      (response) => {
        this.accountDataSource = response;
        this.account_new_btn = true;
      }
    )
  }




  selectAccount(element: any) {
    const account_code = element.ac_code;
    const account = element.nep_text;
    const billing = element.billing_key;
    const master_item_key = element.master_item_key;
    this.account_modify_btn = true;
    console.log(element);

    this.account_key = element.id;


    this.accountFormGroup.patchValue({
      ac_code: account_code,
      ac_nep_text: account,
      billing: billing,
      master_item: master_item_key
    })


  }

  newAccountBtn(number: number) {
    this.account_flag = number;
    this.account_save_btn = true;
  }

  updateAccountBtn(number: number) {
    this.account_flag = number;
    this.account_save_btn = true;
  }

  saveAccountForm() {
    // Extract values from the form controls
    const ac_code = this.accountFormGroup.get('ac_code')!.value;
    const ac_nep_text = this.accountFormGroup.get('ac_nep_text')!.value;
    const billing = this.accountFormGroup.get('billing')!.value;
    const master_item = this.accountFormGroup.get('master_item')!.value;

    // Extract values from other variables
    const cat_key = this.cat_key;
    const head_key = this.head_key;
    const sub_head_key = this.subHead_key;
    const user_key = localStorage.getItem('user_key');
    const currentDate = new Date();
    const formatedDate = currentDate.toISOString();

    // Create the accountdata object
    const accountdata = {
      ac_code: ac_code,
      nep_text: ac_nep_text,
      item_key: 0, // Replace with the actual value
      cat_key: cat_key,
      head_key: head_key,
      ac_key: 0, // Replace with the actual value
      ldm: formatedDate, // Replace with the actual value
      user_key: user_key, // Replace with the actual value
      eng_text: ac_nep_text, // Replace with the actual value
      inst_key: 0, // Replace with the actual value
      billing_key: billing,
      sub_head_key: sub_head_key,
      ac_code_num: ac_code, // Replace with the actual value
      master_item_key: master_item,
    };

    const account_flag = this.account_flag;
    if (account_flag === 1) {
      this.accountService.addAccount(accountdata).subscribe(
        (response) => {
          console.log(response);
        }
      )
    } else if (account_flag === 2) {
      const id = this.account_key;
      this.accountService.updateAccount(id, accountdata).subscribe(
        (response) => {
          console.log(response);
        }
      )
    }



    // Log the accountdata object to the console
    console.log(accountdata);
  }




  selectRow(row: any): void {

    if (this.selectedHeadRow === row) {
      // If the clicked row is already selected, unselect it
      this.selectedHeadRow = undefined;
    } else {
      // Otherwise, select the clicked row
      this.selectedHeadRow = row;
      this.hCodeInput.nativeElement.focus();
    }
  }

  selectSubHeadRow(row:any):void{

    if(this.selectedSubHeadRow === row){
      this.selectedSubHeadRow = undefined;
    }else{
      this.selectedSubHeadRow = row;
      this.sheadcode.nativeElement.focus();
    }
  }

  selectAccountRow(row:any):void{
    if(this.selectedAccountRow === row){
      this.selectedAccountRow = undefined;
    }else{
      this.selectedAccountRow = row;
      this.accountCode.nativeElement.focus();
    }
  }



}
