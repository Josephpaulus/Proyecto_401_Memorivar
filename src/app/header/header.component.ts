import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isOpenMenu: boolean = false;
  showNavbar: boolean = false;

  constructor(private UsersService: UsersService) {
    const user = this.UsersService.getCurrentUser();

    if (user) {
      this.showNavbar = true;
    }
  }

  ngOnInit(): void {}

  openMenu() {
    this.isOpenMenu = !this.isOpenMenu;
  }

  closeMenu() {
    this.isOpenMenu = false;
  }
}
