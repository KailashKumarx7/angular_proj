import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { Login } from 'src/app/model/models';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-auth-log',
  templateUrl: './auth-log.component.html',
  styleUrls: ['./auth-log.component.css']
})
export class AuthLogComponent {
isalreadyhaveaccount:boolean = true;


  form: Login = { user_id: '', password: '' };

  constructor(
    private authServices: AuthService,
    private sharedService: SharedService,
    private router:Router
    ) {}

  


  


  myControl = new FormControl('');
  options: string[] = ['school 1', 'school 2', 'school 3'];
  filteredOptions: Observable<string[]> | undefined;


  stateCtrl = new FormControl('');
  filteredStates: Observable<string[]> | undefined;

  states: string[] = ['1 hour','2 hour','3 hour', '4 hour', '5 hour', '6 hour', '7 hour', '8 hour', '9 hour', '10 hour'];


  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this.states.slice())),
    );
  }


  showSignup(){
    this.isalreadyhaveaccount=!this.isalreadyhaveaccount;
  }

  onSubmit() {
    const loginData: Login = { user_id: this.form.user_id, password: this.form.password };

    console.log(loginData);

    this.authServices.login(loginData).subscribe(
      (response) => {
        console.log(response.message);
        this.router.navigate(['/dashboard'])
        localStorage.setItem('isloged','true');
        this.sharedService.setLoggedInStatus(true);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterStates(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.toLowerCase().includes(filterValue));
  }
}
