import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import { ApiService } from '../api.service';
import { SocketService } from '../socket.service';
import { MatDialog } from '@angular/material/dialog';
import { AddNewChatDialogComponent } from '../add-new-chat-dialog/add-new-chat-dialog.component';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  chats: any[] = [];
  success: String;
  error: String;
  loading: Boolean;
  selfData: any;
  selectedChat: any;
  sendMessageForm: FormGroup

  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private matDialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder) { }

  @ViewChild('scrollMe') scrollMe: ElementRef;
  scrollTop: number;

  ngOnInit() {
    this.socketService.connect();
    this.socketService.socket.on("hii", () => {
      console.log('Received hii from  server');
      let subscription = this.socketService.sendActiveEvent(localStorage.getItem('token')).subscribe(
        data => {
          if (data.success) {
            console.log('message from server: ', data.data.msg);
            subscription.unsubscribe();
          } else {
            console.log('Error in session verification: ', data.data.msg);
          }
        }
      )
    });

    this.socketService.socket.on("message", data => {
      this.chats.forEach(chat => {
        if (chat._id === data.chatId) {
          chat.messages.push(data.message);
        }
      })
    });



    this.fetchSelfData();
    this.fetchChats();
    this.sendMessageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  fetchSelfData() {
    this.apiService.fetchSelfData().subscribe(
      data => {
        if (data.success) {
          this.selfData = data.data.selfData;
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

  fetchChats() {
    this.loading = true;
    this.apiService.fetchChats().subscribe(
      data => {
        this.loading = false;
        if (data.success) {
          this.chats = data.data.chats;
          console.log('Fetched chats: ', this.chats);
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

  openAddChatDialog() {
    this.matDialog.open(AddNewChatDialogComponent, { width: "500px" }).afterClosed().subscribe(
      data => {
        if (data && data.refresh) {
          this.fetchChats();
        }
      }
    )
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['authentication']);
  }

  getOppositeUser(participants: any[]): any {
    let otherUser = null;
    participants.forEach(participant => {
      if (participant._id != this.selfData._id) {
        otherUser = participant;
      }
    });
    return otherUser;
  }

  selectChat(chat) {
    this.selectedChat = chat;
    this.markAsRead(chat);
  }

  sendMessage(event) {
    if (this.sendMessageForm.valid) {
      let payload = {
        chatId: this.selectedChat._id,
        message: {
          to: this.getOppositeUser(this.selectedChat.participants)._id,
          from: this.selfData._id,
          message: this.sendMessageForm.value.message,
          timestamp: new Date().getTime(),
          status: "unread"
        }
      }

      this.socketService.socket.emit('message', payload, callback => {
        console.log('callback: ', callback);
        if (callback.success) {
          this.sendMessageForm.get('message').setValue('');
          this.selectedChat.messages.push(payload.message);
        }
      });
    }
  }

  getUnreadMessagesCount(messages: any[]) {
    let count = 0;
    messages.forEach(message => {
      if (message.from != this.selfData._id && message.status === 'unread') {
        count++;
      }
    });
    return count;
  }

  markAsRead(chat: any) {
    chat.messages.forEach(message => {
      if (message.from != this.selfData._id) {
        message.status = "read";
      }
    });

    this.socketService.socket.emit('markAsRead', { chatId: chat._id, userId: this.getOppositeUser(chat.participants)._id }, callback => {
      if (callback.success) {
        console.log('Messages marked as read successfully');
      } else {
        console.log('Could not mark messages as read: ', callback.data.msg);
      }
    });
  }

}