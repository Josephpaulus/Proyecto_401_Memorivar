import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { user } from '../users';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.scss'],
})
export class HeaderProfileComponent implements OnInit {
  @Output() closeMenu = new EventEmitter<void>();

  user!: user;

  constructor(private UsersService: UsersService, private router: Router) {
    this.user = this.UsersService.getCurrentUser();
  }

  ngOnInit(): void {}

  openProfile() {
    this.closeMenu.emit();
    this.router.navigate(['/profile']);
  }

  logout() {
    this.closeMenu.emit();
    this.UsersService.isLoggedIn.subscribe((res) => {
      if (res) {
        this.UsersService.logout();
      }
    });
  }
}
