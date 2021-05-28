import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  
  get theme(): string {
    return document.documentElement.getAttribute('theme');
  }

  set theme(name: string) {
    document.documentElement.setAttribute('theme', name);
    if(name){
      localStorage.setItem('theme', name) 
    }else{
      localStorage.setItem('theme', 'light')
    }
  }
}