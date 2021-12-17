import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from 'src/app/users/users';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss'],
})
export class ChallengeComponent implements OnInit {
  user!: user;
  courseId!: number;

  constructor(
    private UsersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.user = this.UsersService.getCurrentUser();
    this.courseId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {}

  restore() {}

  challenge() {
    this.router.navigate(['./courses/', this.courseId, 'challenge', 'users']);
  }
}
