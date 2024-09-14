import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

/**
 * The LoginFormComponent allows users to log in to the application.
 * It sends the user's credentials to the backend and, on success, navigates to the movies page.
 */
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  /**
   * Stores the user's login credentials, including the username and password.
   * @property {string} Username - The username entered by the user.
   * @property {string} Password - The password entered by the user.
   */
  userData = { Username: '', Password:''};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  /**
   * Logs in the user by sending their credentials to the API.
   * On success, the user data and token are stored in local storage, the login dialog is closed, and the user is redirected to the movies page.
   * On error, a snack bar message displays the error.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      this.dialogRef.close();

      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      this.snackBar.open("User successfully logged in!", 'OK', {
        duration: 2000
      });
      // if log in is correct, navigate to /movies
      this.router.navigate(['movies']);
    }, (result) => {
      console.log(result);
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    }
  )}
}
