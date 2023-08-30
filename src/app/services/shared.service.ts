import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  setLoggedInStatus(status: boolean): void {
    this.isLoggedInSubject.next(status);
  }

  getLoggedInStatus(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
}
