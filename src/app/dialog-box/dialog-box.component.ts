import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrl: './dialog-box.component.scss'
})
export class DialogBoxComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { name: string, title: string, bio: string, birthyear: string, description: string, genre: string },
    public dialogRef : MatDialogRef<DialogBoxComponent>
  ) { }

  ngOnInit(): void { }

  closeDailogBox(): void {
    this.dialogRef.close();
  }

  closeGenreDailogBox(): void {
    this.dialogRef.close();
  }

  closeSynopsisDailogBox(): void {
    this.dialogRef.close();
  }
}
