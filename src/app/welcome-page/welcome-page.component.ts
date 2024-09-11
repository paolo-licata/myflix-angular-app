import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from '../login-form/login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})

export class WelcomePageComponent {
  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {}

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '320px'
    });
  }

	openUserLoginDialog(): void {
			this.dialog.open(LoginFormComponent, {
				width: '320px'
			});
	}
}
