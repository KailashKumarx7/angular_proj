import { ChangeDetectorRef, Component } from '@angular/core';
import { Menu } from 'src/app/model/menu';
import { MenuService } from 'src/app/services/menu.service';
import { faSearch,faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Submenu } from 'src/app/model/submenu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {


  showhide:boolean =false;
  isMenuClicked:boolean = false;
  searchicon=faSearch;
  faChevronDown=faChevronDown;
  menus:Menu[] =[];
  subMenu:Submenu[]=[];


  constructor(private menuService:MenuService,private cdr:ChangeDetectorRef){

  }


  ngOnInit():void{
    this.menuService.getMenu().subscribe((data)=>{
      this.menus=data;
    })
    
  }

  showdropdown(){
this.showhide=true;
this.cdr.detectChanges();
  }


  menuClicked(menu:Menu){
    console.log(menu.item_no)
    this.menuService.getSubmenu(menu.item_no).subscribe((data)=>{
      this.isMenuClicked = true;
      console.log(data);

      this.subMenu=data;

      this.cdr.detectChanges();
    })
  }
}
