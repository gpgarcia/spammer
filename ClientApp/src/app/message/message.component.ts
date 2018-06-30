import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import {Message} from './message';



@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewChecked {
  @ViewChild('msgHistory') private msgHistoryContainer: ElementRef;

  status = 'Initial';
  host = 'wss://echo.websocket.org/';
  connection = null;
  buffer: Message[] = [];
  hostList: string[] = [];
  user: string;

  isConnected = 0;

  constructor() {

  const scheme = document.location.protocol === 'https:' ? 'wss' : 'ws';
  const port = document.location.port ? (':' + document.location.port) : '';
  this.hostList = [
    'wss://echo.websocket.org/'
    , scheme + '://' + document.location.hostname + port + '/wsEcho'
    , scheme + '://' + document.location.hostname + port + '/wsChat'
  ];

}

  ngOnInit() {
    this.user = sessionStorage.getItem('currentUser');
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
        this.msgHistoryContainer.nativeElement.scrollTop = this.msgHistoryContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }
  onConnect() {
    console.log(this.host);
    this.connection = new WebSocket(this.host);
    this.connection.onopen = (evt) => this.onOpen(evt);
    this.connection.onclose = (evt) => this.onClose(evt);
    this.connection.onmessage = (evt) => this.onMessage(evt);
    this.connection.onerror = (evt) => this.onError(evt);
  }

  onDisconnect() {
    this.connection.close();
  }

  onOpen(evt) {
    const m = new Message('CONNECTED', new Date(), 'open', null);
    this.buffer.push(m);
    this.isConnected = 1;
  }

  onClose(evt) {
    const m = new Message('DISCONNECTED', new Date(), 'close', null);
    this.buffer.push(m);
    this.isConnected = 0;
  }

  onMessage(evt) {
    const m = JSON.parse(evt.data);
    this.buffer.push(m);
  }

  onError(evt) {
    const m = new Message('DISCONNECTED', new Date(), 'Error', evt.data);
    this.buffer.push(m);
  }

  onSend(theText) {
    const m = new Message('text', new Date(), this.user, theText);
    this.connection.send(JSON.stringify(m));
  }


}
