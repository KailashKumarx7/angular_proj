import { ChangeDetectorRef, Component } from '@angular/core';
import { Menu } from 'src/app/model/menu';
import { MenuService } from 'src/app/services/menu.service';
import { faSearch,faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Submenu } from 'src/app/model/submenu';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { faCloudDownload, faCloudUpload, faCog, faPowerOff, faTrash, faUser, faUserLock} from '@fortawesome/free-solid-svg-icons';

export const userItems = [
  {
      icon: faUser,
      label:'Profile'
  },
  {
      icon: faCog,
      label:'Settings'
  },
  {
      icon: faUserLock,
      label:'Lock screen'
  },
  {
      icon: faPowerOff,
      label:'Logout'
  },
]
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {


  userItems = userItems;

  islogedin:boolean = true;
  showhide:boolean =false;

  searchicon=faSearch;
  faChevronDown=faChevronDown;
  menus:Menu[] =[];
  subMenu:Submenu[]=[];

  // private subscription: Subscription;
userOverlay: any;


  constructor(
    private menuService:MenuService,
    private cdr:ChangeDetectorRef,
    private sharedService: SharedService
    ){

      // this.subscription = this.sharedService.getLoggedInStatus().subscribe(status => {
      //   this.islogedin = status;
      // });

  }


  ngOnInit():void{
    this.menuService.getMenu().subscribe((data)=>{
      
    });
    this.menuService.getAllSubMenuAndMenu().subscribe((data)=>{
      console.log(data);
      this.menus = data;
    })
    
  }

  showdropdown(){
this.showhide=true;
this.cdr.detectChanges();
  }


  menuClick(itemNO:any){
   console.log("this is item",itemNO);
  }


  menuClicked(menu:Menu){
    console.log(menu.item_no)
    this.menuService.getSubmenu(menu.item_no).subscribe((data)=>{
      this.subMenu=data;
      this.cdr.detectChanges();
    })
  }


  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe(); // Unsubscribe to avoid memory leaks
  // }
}
