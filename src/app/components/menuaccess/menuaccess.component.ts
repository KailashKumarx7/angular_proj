
import { Component } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Menu } from 'src/app/model/menu';
import { SubmenuUrl } from 'src/app/model/models';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-menuaccess',
  templateUrl: './menuaccess.component.html',
  styleUrls: ['./menuaccess.component.css']
})
export class MenuaccessComponent {



  menuSelected:boolean=false;
  menus$!: Observable<Menu[]>;
  menu_no:Number=0;

  form: SubmenuUrl = {  
    item_no: 0,
    menu_sub_item_key: 0,
    name: '',
    menu_command_name: '',
    menu_fast_way: '',
    menu_function: '',
    url: '' };




  constructor(private menuService:MenuService){
    // this.menuService.getMenu().subscribe(
    //   (data)=>{
    //     this.menus = data
    //     console.log();
    //   }
    // )
    this.menus$ = this.menuService.getMenu();

  }
  

  ngOnInit():void{
    console.log("working")
    


  }


  onSubmit(){
    const subMenuFormData:SubmenuUrl = {
      item_no:this.menu_no,
      menu_sub_item_key: this.form.menu_sub_item_key,
      name: this.form.name,
      menu_command_name: this.form.menu_command_name,
      menu_fast_way: this.form.menu_fast_way,
      menu_function: this.form.menu_function,
      url: this.form.url
    }

    this.menuService.postSubmenu(subMenuFormData).subscribe((data)=>{
      console.log(data);
    })
  }

  selectMenu(menu:Menu){
    this.menuSelected = true;
    this.menu_no = menu.item_no;
    console.log(this.menu_no)
  }

}
