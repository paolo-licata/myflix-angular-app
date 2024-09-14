import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from '../login-form/login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * The WelcomePageComponent serves as the entry point of the application.
 * It allows users to either register a new account or log in using a modal dialog.
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})

export class WelcomePageComponent {
  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {}

  /**
   * Opens a dialog containing the user registration form.
   * The dialog is opened with a fixed width of 320px.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '320px'
    });
  }

  /**
   * Opens a dialog containing the login form.
   * The dialog is opened with a fixed width of 320px.
   */
	openUserLoginDialog(): void {
			this.dialog.open(LoginFormComponent, {
				width: '320px'
			});
	}
}
