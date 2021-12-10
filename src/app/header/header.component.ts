import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isOpenMenu: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  openMenu() {
    this.isOpenMenu = !this.isOpenMenu;
  }

  closeMenu() {
    this.isOpenMenu = false;
  }
}
