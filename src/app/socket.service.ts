import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: SocketIOClient.Socket;

  constructor() { }

  connect() {
    this.socket = io();
    this.socket.on("connect", () => {
      console.log('Socket connected with id: ', this.socket.id);
    })
  }

  sendActiveEvent(token: String): Observable<any> {
    return new Observable(observer => {
      this.socket.emit("active", { token }, callback => {
        observer.next(callback);
      })
    })
  }
}