import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

currentUser: any;

  constructor() { 
    console.log('der jetzige user ist', this.currentUser);
    
  }




}
