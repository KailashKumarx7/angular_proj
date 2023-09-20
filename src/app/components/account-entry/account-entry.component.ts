import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Category } from 'src/app/model/models';
import { AccountEntryService } from 'src/app/services/account-entry.service';

@Component({
  selector: 'app-account-entry',
  templateUrl: './account-entry.component.html',
  styleUrls: ['./account-entry.component.css']
})
export class AccountEntryComponent {

  selectedCategoryId!:Number;


  categories:Category[]=[];
 

  constructor(private accountService:AccountEntryService){}

  ngOnInit():void{
    this.accountService.getCategory().subscribe((data)=>{
      this.categories=data;
      console.log(data);
    }) 
  }

  selectCategory(event: any) {
    this.selectedCategoryId = event.target.value; 
    console.log(this.selectedCategoryId);
    
    
}


  

  

  

}
