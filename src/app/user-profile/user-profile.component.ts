import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * UserProfileComponent allows users to view and update their profile information, as well as delete their account.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userData: any = {};
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) {
    const storedUser = localStorage.getItem("user");
    this.userData = storedUser ? JSON.parse(storedUser) : {};
    }

  ngOnInit(): void {
    this.getUserDetails();
  }

  /**
   * Navigates back to the movies page.
   */
  goBack(): void {
    this.router.navigate(['/movies']);
  }

  /**
   * Fetches the user's profile details from the API and updates the `userData` object.
   * The response data is stored in local storage to keep it in sync.
   */
  getUserDetails(): void {
    this.fetchApiData.getUser().subscribe((res: any) => {
      this.userData = {
        ...res,
        token: this.userData.token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
    }, (err: any) => {
      this.snackBar.open('Error fetching user details', 'OK', {
        duration: 2000
      });
      console.error(err);
    });
  }

  /**
   * Updates the user's profile details by sending updated data to the API.
   * Displays a notification whether the update was successful or not.
   */
  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((res: any) => {
      this.userData = {
        ...res,
        password: this.userData.password,
        token: this.userData.token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.snackBar.open('Profile updated successfully', 'OK', {
        duration: 2000
      });
    }, (err: any) => {
      this.snackBar.open('Error updating profile', 'OK', {
        duration: 2000
      });
      console.error(err)
    })
  }

  /**
   * Deletes the user's account after a confirmation prompt.
   * On success, clears local storage and navigates to the welcome page.
   */
  deleteUser(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.fetchApiData.deleteUser().subscribe((res) => {
        this.snackBar.open('Account deleted successfully', 'OK', {
          duration: 2000
        });
        localStorage.clear(); // Clear local storage
        this.router.navigate(['/welcome']); // Navigate to welcome page
      }, (err) => {
        this.snackBar.open('Error deleting account', 'OK', {
          duration: 2000
        });
        console.error(err);
      });
    }
  }
}
