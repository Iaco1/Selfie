import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { Observable } from "rxjs"
import { HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messaging;

  constructor(private http: HttpClient) {
    const app = initializeApp(environment.firebase);
    this.messaging = getMessaging(app);
  }

  async requestPermission(): Promise<string | undefined> {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(this.messaging, {
          vapidKey: environment.firebase.vapidKey
        });
        return token;
      }
      console.log('Permission denied');
      return undefined;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return undefined;
    }
  }

  async listenToMessages() {
    onMessage(this.messaging, (payload) => {
      if(!payload.notification) {
        console.log("no notification in payload");
        return;
      }
      console.log('Message received:', payload);

      if (payload.notification.title) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon
        });
      }
    });
  }

  post(FCMtoken: string, title: string, body: string): Observable<any>{
    return this.http.post(environment.baseURL + '/notification', {FCMtoken: FCMtoken, title: title, body: body});
  }
}
