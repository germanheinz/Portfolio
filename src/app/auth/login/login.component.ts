import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // FORM
  form: FormGroup;
  user: User;

  loading: boolean = false;
  public auth2: any;

  constructor(private userService: UserService, 
              private router: Router, 
              private ngZone: NgZone) { }

  ngOnInit(): void {
    this.renderButton();
    this.form  =  new FormGroup({
      email   :   new FormControl('', [Validators.required, Validators.email]),
      password:   new FormControl('', [Validators.required])
    });

  }
  signIn(){
      console.log(this.form.value);
      this.userService.signIn(this.form.value).subscribe(resp => {
      this.router.navigateByUrl('/');
    }, (err) => {
      console.log(err);
    });

  }

  onFailure(error) {
    console.log(error);
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': this.startApp(),
      'onfailure': this.onFailure
    });
  }

  async startApp() {
      await this.userService.googleInit();
      this.auth2 = this.userService.auth2;

      this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin( element ) {
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {

              const id_token = googleUser.getAuthResponse().id_token;
              console.log(id_token);

              this.userService.signInWithGoogle(id_token)
              .subscribe(resp => {
                this.ngZone.run(() => {
                  this.router.navigateByUrl('/');
                });
              });
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

  // METODO ERRORES //
  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }


}
