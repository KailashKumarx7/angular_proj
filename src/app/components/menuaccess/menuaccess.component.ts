
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
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


  menus:Menu[]=[]

  form: SubmenuUrl = {  
    item_no: 0,
    menu_sub_item_key: 0,
    name: '',
    menu_command_name: '',
    menu_fast_way: '',
    menu_function: '',
    url: '' };




  constructor(private menuService:MenuService){}
  

  ngOnInit():void{
    this.menuService.getMenu().subscribe(
      (data)=>{
        this.menus = data
        console.log();
      }
    )
  }


  onSubmit(){
    const subMenuFormData:SubmenuUrl = {item_no:this.form.item_no,menu_sub_item_key: this.form.menu_sub_item_key,
      name: this.form.name,
      menu_command_name: this.form.menu_command_name,
      menu_fast_way: this.form.menu_fast_way,
      menu_function: this.form.menu_function,
      url: this.form.url
    }


    console.log(subMenuFormData);
  }

}
