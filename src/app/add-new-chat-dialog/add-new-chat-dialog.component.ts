import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MatDialogModule} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-chat-dialog',
  templateUrl: './add-new-chat-dialog.component.html',
  styleUrls: ['./add-new-chat-dialog.component.css']
})
export class AddNewChatDialogComponent implements OnInit {

  users: any[] = [];
  addingNewChat: Boolean;
  success: String;
  error: String;
  constructor(
    private apiService: ApiService,
    private matSnackbar: MatSnackBar,
    public matDialogRef: MatDialogRef<AddNewChatDialogComponent>) {

  }

  ngOnInit() {
    this.apiService.fetchUsers().subscribe(
      data => {
        if (data.success) {
          this.users = data.data.users;
          this.matSnackbar.open("Users fetched successfully", "Okay", { duration: 2000 });
        } else {
          this.error = data.data.msg;
        }
      },
      error => {
        this.error = "Connection Problem";
      }
    )
  }

  addNewChat(user: any) {
    this.addingNewChat = true;
    this.apiService.addNewChat(user).subscribe(
      data => {
        if (data.success) {
          this.success = data.data.success;
          setTimeout(() => {
            this.matDialogRef.close({ refresh: true });
          }, 2000, this);
        } else {
          this.error = data.data.msg;
          setTimeout(() => {
            this.error = null;
          }, 2000, this);
        }
      },
      error => {
        this.error = "Connection Problem";
        setTimeout(() => {
          this.error = null;
        }, 2000, this);
      }
    )
  }

}