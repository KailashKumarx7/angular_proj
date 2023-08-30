import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/app/model/models';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: Login = { user_id: '', password: '' };

  constructor(
    private authServices: AuthService,
    private sharedService: SharedService
    ) {}

  onSubmit() {
    const loginData: Login = { user_id: this.form.user_id, password: this.form.password };

    console.log(loginData);

    this.authServices.login(loginData).subscribe(
      (response) => {
        console.log(response.message);
        this.sharedService.setLoggedInStatus(true);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
