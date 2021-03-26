import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  @HostBinding('class') className = '';
  toggleControl = new FormControl(false);

  showFiller = false;

  constructor(private overlay: OverlayContainer, private userService: UserService) { }

  ngOnInit(): void {
    this.toggleControl.valueChanges.subscribe( darkMode => {
      console.log(darkMode);
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
  }

  logOut(){
    this.userService.logOut();
  }

}
