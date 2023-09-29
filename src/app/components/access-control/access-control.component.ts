import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { response } from 'express';
import { Observable, map, startWith } from 'rxjs';
import { Employee, Faculty, MenuList, NewUser, SchoolName, SubmenuUrl, UserLevel } from 'src/app/model/models';
import { GetDataService } from 'src/app/services/get-data.service';
import { MenuService } from 'src/app/services/menu.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.css']
})
export class AccessControlComponent {


  buttonValue:boolean = true;
  isteacher: boolean = false;
  isdisabled:boolean = false;
  applydisable:boolean = false;
  buttonText: string = this.buttonValue ? 'Update' : 'Save';

  user_key!: number;
  selectedRow: any; // This will store the selected row data


  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private getdataService: GetDataService,
    private menuService: MenuService
  ) {
    this.EmployeeOption = [];
    this.FacultyOption = [];
    this.SchoolNameOption = [];
    this.UserLevelOption = [];
    this.toppinglist = [];
    this.submenuSource = [];
    this.menutopplinglist = [];

  }


  newmembergroup = this._formBuilder.group({
    full_name: [''],
    user_id: [''],
    password: [''],
    access_level: [''],
    name: [''],
    email: [''],
    faculty: [''],
    phone_number: [''],
    school_name: [''],
    print_on: [null],
    paper_size: [null],
    isteacher: false,
    employee_key: ['']
  })



  wantonewmember: boolean = false;
  displayedColumns: string[] = ['index', 'name', 'userlevel', 'status', 'type'];
  dataSource: NewUser[] = [];
  clickedRows = new Set<NewUser>();

  // toppings = new FormControl('');
  // toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'


  toppinglist!: Faculty[];

  menutopplinglist!: MenuList[];

  displaymenuName: string[] = ['id', 'menu_name'];
  submenuSource!: SubmenuUrl[];

  oldselectedmenuSource!: SubmenuUrl[];
  newselectedmenuSource: SubmenuUrl[] = [];




  SchoolNameOption!: SchoolName[];
  SchoolNameFilteredOptions!: Observable<SchoolName[]>;

  UserLevelOption!: UserLevel[];
  UserLevelFilteredOptions!: Observable<UserLevel[]>;

  FacultyOption!: Faculty[];
  FacultyFilteredOptions!: Observable<Faculty[]>;

  EmployeeOption!: Employee[];
  EmployeeFilteredOptions!: Observable<Employee[]>;

  ngOnInit() {

    this.fetchDataFromServicej();
    this.getAllEmployees();
    this.getAllInstitutions();
    this.getAllFaculties();
    this.getAllAccesslists();
    this.getAllSubMenus();


    this.SchoolNameFilteredOptions = this.newmembergroup.get('school_name')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this._filterSchool(value);
        } else if (value && typeof value === 'object' && 'inst_name' in value) {
          const selectedValue = value as SchoolName;
          return this._filterSchool(selectedValue.inst_name);
        } else {
          return this.SchoolNameOption.slice();
        }
      }),
    );

    this.UserLevelFilteredOptions = this.newmembergroup.get('access_level')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this._filterUserlevel(value);
        } else if (value && typeof value === 'object' && 'access_name' in value) {
          const selectedValue = value as UserLevel;
          return this._filterUserlevel(selectedValue.access_name);
        } else {
          return this.UserLevelOption.slice();
        }
      })
    );
    this.FacultyFilteredOptions = this.newmembergroup.get('faculty')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this._filterFaculty(value);
        } else if (value && typeof value === 'object' && 'fac_name' in value) {
          const selectedValue = value as Faculty;
          return this._filterFaculty(selectedValue.fac_name);
        } else {
          return this.FacultyOption.slice();
        }
      })
    );

    this.EmployeeFilteredOptions = this.newmembergroup.get('employee_key')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this._filterEmployee(value);
        } else if (value && typeof value === 'object' && 'emp_name' in value) {
          const selectedValue = value as Employee;
          return this._filterEmployee(selectedValue.emp_name);
        } else {
          return this.EmployeeOption.slice();
        }
      })
    );


  }


  fetchDataFromServicej() {
    this.userService.getAllUsers().subscribe(
      (data: NewUser[]) => {

        this.dataSource = data;
      }
    )
  }




  displaySchool(school: SchoolName): string {
    return school && school.inst_name ? school.inst_name : '';
  }

  displayUserlevel(userlevel: UserLevel): string {
    return userlevel && userlevel.access_name ? userlevel.access_name : '';
  }

  displayFaculty(faculty: Faculty): string {
    return faculty && faculty.fac_name ? faculty.fac_name : '';
  }

  displayEmployee(employee: Employee): string {
    return employee && employee.emp_name ? employee.emp_name : '';
  }



  private _filterSchool(name: string): SchoolName[] {
    const filterValue = name.toLowerCase();
    return this.SchoolNameOption.filter(option => option.inst_name.toLowerCase().includes(filterValue));
  }

  private _filterUserlevel(name: string): UserLevel[] {
    const filterValue = name.toLowerCase();
    return this.UserLevelOption.filter(option => option.access_name.toLowerCase().includes(filterValue));
  }

  private _filterFaculty(name: string): Faculty[] {
    const filterValue = name.toLowerCase();
    return this.FacultyOption.filter(option => option.fac_name.toLowerCase().includes(filterValue));
  }

  private _filterEmployee(name: string): Employee[] {
    const filterValue = name.toLowerCase();
    return this.EmployeeOption.filter(option => option.emp_name.toLowerCase().includes(filterValue));
  }


  addNew() {
    this.wantonewmember = true;
    this.buttonValue = false;
    this.isdisabled = true;
    this.newmembergroup.reset();
    this.setButtonValue(this.buttonValue);
  }

  onCheckboxChange() {
    console.log(this.isteacher);
  }

  getFormValue() {
    // Use the value property of the form group to get the form data
    const formData = this.newmembergroup.value;
    if (Array.isArray(formData.faculty)) {
      formData.faculty = formData.faculty.join(', ');
    }

    console.log(formData.faculty)

    console.log(formData)
    this.userService.addNewUser(formData).subscribe(
      (response) => {
        console.log("ok" + response);
        this.fetchDataFromServicej();
        this.newmembergroup.reset();
      }
    )
    // Pass the newUser object to the service 
  }




  getAllEmployees() {
    this.getdataService.getEmployees().subscribe(
      (response) => {
        this.EmployeeOption = response;
      }
    )
  }

  getAllInstitutions() {
    this.getdataService.getInstitutions().subscribe(
      (response) => {
        this.SchoolNameOption = response;

      }
    )
  }

  getAllFaculties() {
    this.getdataService.getFaculties().subscribe(
      (response) => {
        this.toppinglist = response;

      }
    )
  }

  getAllAccesslists() {
    this.getdataService.getAccesslists().subscribe(
      (response) => {
        this.UserLevelOption = response;

      }
    )
  }


  getUserid(id: number) {
    this.user_key = id;
    console.log(this.user_key);
    this.userService.getUserByUserkey(id).subscribe(
      (response) => {
        this.newmembergroup.patchValue(response);

      }
    );

    
    this.wantonewmember=true;
    this.buttonValue = true;
    this.isdisabled = true;
    
    this.setButtonValue(this.buttonValue);
    var currentUser = localStorage.getItem('user_key');
    if (currentUser !== null && this.user_key === +currentUser) {
      this.applydisable = true;
    }else{
      this.applydisable = false;
    }
    this.menuService.getAccessableSubmenu(id).subscribe(
      (response) => {
        console.log(response)
        this.newselectedmenuSource = response.listOfMenuAccess;
        const allSubmenu = response.allsubmenu;

        const submenuToadd = allSubmenu.filter((item:any)=>{

          return !this.newselectedmenuSource.some(
            (selecteditem)=>
            selecteditem.item_no === item.menu_item_key && selecteditem.menu_sub_item_key === item.menu_sub_item_key
          );
        })
        this.submenuSource = submenuToadd;
        

      }
    )
  }

  updateUser() {
    var user_key = this.user_key;
    const formData = this.newmembergroup.value;
    if (Array.isArray(formData.faculty)) {
      formData.faculty = formData.faculty.join(', ');
    }
    this.userService.updateUserByUserkey(user_key, formData).subscribe(
      (response) => {
        console.log(response);
        this.fetchDataFromServicej();
        this.newmembergroup.reset();
      }
    )
  }

  selectRow(row: any): void {
    if (this.selectedRow === row) {
      // If the clicked row is already selected, unselect it
      this.selectedRow = undefined;
    } else {
      // Otherwise, select the clicked row
      this.selectedRow = row;
    }
  }

  getAllSubMenus() {
    // this.menuService.getMenuList().subscribe(
    //   (response) => {
    //     this.menutopplinglist = response;
    //   }
    // );
    // this.menuService.getAllSubMenus().subscribe(
    //   (response) => {

    //     this.submenuSource = response;
    //   }
    // )
  }

  getSubmenuByitemno(value: any) {
    var item_no = value.value;
    this.menuService.getSubmenuByItemno(item_no).subscribe(
      (response) => {
        console.log(response);
        this.submenuSource = response;
      }
    )
  }



  getThisrowdata(data: any) {
    const getabledata = data;
    const exists = this.newselectedmenuSource.some(item =>
      item.item_no === getabledata.menu_item_key && item.menu_sub_item_key === getabledata.menu_sub_item_key);

    if (!exists) {
      this.newselectedmenuSource.push(getabledata);
      console.log(this.newselectedmenuSource)
    }

  }


  addAccessSubMenu() {
    const user_id = this.user_key;
    const regd_by = localStorage.getItem('user_key');

    console.log(user_id);
    console.log(regd_by);
    this.newselectedmenuSource.forEach(item => {
      const formatedData = {
        name: item.name,
        user_key: user_id,
        regd_by: regd_by,
        menu_item_key: item.item_no,
        menu_sub_item_key: item.menu_sub_item_key,
        name_display: item.name,
        menu_command_name: item.menu_command_name,
        menu_fast_way: item.menu_fast_way,
      }
      console.log(formatedData);
      this.menuService.addAccessSubMenu(formatedData).subscribe(
        (response)=>{
          console.log(response);
        }
      )
    })

    
  }

  setButtonValue(newValue: boolean) {
    this.buttonValue = newValue;
    this.buttonText = newValue ? 'Update' : 'Save';
  }
  
}
