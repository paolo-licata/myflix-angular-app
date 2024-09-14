import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * This component handles the user registration form.
 * It interacts with the API service to register a new user and provides user feedback via a modal and snackbar notifications.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent {

  /**
   * Contains the form input data for user registration.
   * @property {string} Username - The user's chosen username.
   * @property {string} Password - The user's chosen password.
   * @property {string} Email - The user's email address.
   * @property {string} Birthday - The user's birthday in 'YYYY-MM-DD' format.
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
      public fetchApiData: FetchApiDataService,
      public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
      public snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {}

  /**
   * Registers a new user by sending the form data to the API.
   * On successful registration, the dialog is closed, and a success message is displayed.
   * On error, an error message is shown to the user.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((response) => {
      
      this.dialogRef.close(); // This will close the modal on success!
      console.log(response);
      this.snackBar.open('User Registeration Successful', 'OK', {
        duration: 2000
      });
    }, (response) => {
      console.log(response);
      this.snackBar.open(response, 'OK', {
        duration: 2000
      });
    });
  }
}
