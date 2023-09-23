import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { response } from 'express';
import { Observable, map, startWith } from 'rxjs';
import { Employee, Faculty, MenuData, MenuList, NewUser, SchoolName, UserLevel } from 'src/app/model/models';
import { GetDataService } from 'src/app/services/get-data.service';
import { UserService } from 'src/app/services/user.service';
export interface PeriodicElement {
  name: string;
  position: number;
  userlevel: string;
  status: string;
  type: string;
}



const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Diyong', userlevel: 'Finance controler', status: 'NO', type: 'no' },
  { position: 2, name: 'Ronish', userlevel: 'Library ', status: 'Yes', type: 'no' },
  { position: 3, name: 'Depasa', userlevel: 'User', status: 'Yes', type: 'no' },
  { position: 4, name: 'Miyong', userlevel: 'User', status: 'NO', type: 'no' },
];
@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.css']
})
export class AccessControlComponent {

  isteacher: boolean = true;
   user_key!:number;


  constructor(
    private _formBuilder: FormBuilder, 
    private userService:UserService,
    private getdataService:GetDataService
    ) {
      this.EmployeeOption = [];
      this.FacultyOption = [];
      this.SchoolNameOption=[];
      this.UserLevelOption =[];
      this.toppinglist = [];
  }


  newmembergroup = this._formBuilder.group({
    full_name: [''],
    user_id: [''],
    password: [''],
    access_level: [''],
    name:[''],
    email: [''],
    faculty:[''],
    phone_number: [''],
    school_name: [''],
    print_on: [''],
    paper_size: [''],
    isteacher: false,
    employee_key:['']
  })



  wantonewmember: boolean = true;
  displayedColumns: string[] = ['index', 'name', 'userlevel', 'status', 'type'];
  dataSource: NewUser[] = [];
  clickedRows = new Set<NewUser>();

  // toppings = new FormControl('');
  // toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'


  toppinglist!:Faculty[]; 

  displaymenuName: string[] = ['id', 'menu_name'];
  menuSource:MenuList[]= MenuData;
  

  SchoolNameOption!: SchoolName[];
  SchoolNameFilteredOptions!: Observable<SchoolName[]>;

  UserLevelOption!:UserLevel[];
  UserLevelFilteredOptions!:Observable<UserLevel[]>;

  FacultyOption!:Faculty[];
  FacultyFilteredOptions!:Observable<Faculty[]>;

  EmployeeOption!:Employee[];
  EmployeeFilteredOptions!:Observable<Employee[]>;

  ngOnInit() {

    this.fetchDataFromServicej();
    this.getAllEmployees();
    this.getAllInstitutions();
    this.getAllFaculties();
    this.getAllAccesslists();


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

    this.UserLevelFilteredOptions = this. newmembergroup.get('access_level')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        if(typeof value === 'string'){
          return this._filterUserlevel(value);
        }else if(value && typeof value === 'object' && 'access_name' in value){
          const selectedValue = value as UserLevel;
          return this._filterUserlevel(selectedValue.access_name);
        }else{
          return this.UserLevelOption.slice();
        }
      })
    );
    this.FacultyFilteredOptions = this. newmembergroup.get('faculty')!.valueChanges.pipe(
      startWith(''),
      map(value=>{
        if(typeof value === 'string'){
          return this._filterFaculty(value);
        }else if(value && typeof value === 'object' && 'fac_name' in value){
          const selectedValue = value as Faculty;
          return this._filterFaculty(selectedValue.fac_name);
        }else{
          return this.FacultyOption.slice();
        }
      })
    );

    this.EmployeeFilteredOptions = this.newmembergroup.get('employee_key')!.valueChanges.pipe(
      startWith(''),
      map(value=>{
        if(typeof value === 'string'){
          return this._filterEmployee(value);
        }else if(value && typeof value === 'object' && 'emp_name' in value){
          const selectedValue = value as Employee;
          return this._filterEmployee(selectedValue.emp_name);
        }else{
          return this.EmployeeOption.slice();
        }
      })
    );

  
  }


  fetchDataFromServicej(){
    this.userService.getAllUsers().subscribe(
      (data: NewUser[]) => {
       
        this.dataSource = data;}
    )
  }


 

  displaySchool(school:SchoolName):string{
    return school && school.inst_name ? school.inst_name : '';
  }

  displayUserlevel(userlevel:UserLevel):string{
    return userlevel && userlevel.access_name ? userlevel.access_name : '';
  }

  displayFaculty(faculty:Faculty):string{
    return faculty && faculty.fac_name ? faculty.fac_name : '';
  }

  displayEmployee(employee:Employee):string{
    return employee && employee.emp_name ? employee.emp_name : '';
  }

 

  private _filterSchool(name:string):SchoolName[]{
    const filterValue = name.toLowerCase();
    return this.SchoolNameOption.filter(option=> option.inst_name.toLowerCase().includes(filterValue));
  }

  private _filterUserlevel(name:string):UserLevel[]{
    const filterValue = name.toLowerCase();
    return this.UserLevelOption.filter(option => option.access_name.toLowerCase().includes(filterValue));
  }

  private _filterFaculty(name:string):Faculty[]{
    const filterValue = name.toLowerCase();
    return this.FacultyOption.filter(option=> option.fac_name.toLowerCase().includes(filterValue));
  }

  private _filterEmployee(name:string):Employee[]{
    const filterValue = name.toLowerCase();
    return this.EmployeeOption.filter(option=> option.emp_name.toLowerCase().includes(filterValue));
  }


  addNew() {
    this.wantonewmember = !this.wantonewmember;
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
      (response)=>{
        console.log("ok"+response);
        this.fetchDataFromServicej();
        this.newmembergroup.reset();
      }
    )
    // Pass the newUser object to the service 
  }

  
  
  
getAllEmployees(){
  this.getdataService.getEmployees().subscribe(
    (response)=>{
      this.EmployeeOption = response;
      console.log(response);
    }
  )
}

getAllInstitutions(){
  this.getdataService.getInstitutions().subscribe(
    (response)=>{
      this.SchoolNameOption = response;
      console.log(response);
    }
  )
}

getAllFaculties(){
  this.getdataService.getFaculties().subscribe(
    (response)=>{
      this.toppinglist = response;
      console.log(response);
    }
  )
}

getAllAccesslists(){
  this.getdataService.getAccesslists().subscribe(
    (response)=>{
      this.UserLevelOption = response;
      console.log(response);
    }
  )
}


getUserid(id:number){
  this.user_key = id;
  this.userService.getUserByUserkey(id).subscribe(
    (response)=>{
      console.log(response);
      this.newmembergroup.patchValue(response);
    }
  )
}

updateUser(){
  var user_key = this.user_key;
  const formData = this.newmembergroup.value;
    if (Array.isArray(formData.faculty)) {
      formData.faculty = formData.faculty.join(', ');
    }
  this.userService.updateUserByUserkey(user_key,formData).subscribe(
    (response)=>{
      console.log(response);
    }
  )
}
 


}
