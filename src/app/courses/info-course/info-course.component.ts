import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { course, Words } from '../courses';
import { CoursesService } from '../courses.service';
import { UsersService } from '../../users/users.service';
import { user } from 'src/app/users/users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-course',
  templateUrl: './info-course.component.html',
  styleUrls: ['./info-course.component.scss'],
})
export class InfoCourseComponent implements OnInit {
  @ViewChild('listWords') listWords!: MatTable<Words>;

  displayedColumns: string[] = ['concept', 'answer', 'review'];
  dataSource: Words[] = [];

  courseId!: number;
  course!: course;

  user!: user;

  courseOwner!: string;

  isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private CoursesService: CoursesService,
    private UsersService: UsersService
  ) {
    this.user = this.UsersService.getCurrentUser();
    this.courseId = this.route.snapshot.params.id;

    this.CoursesService.getCourse(this.courseId).subscribe((course) => {
      if (!course.image) {
        course.image =
          'https://www.welivesecurity.com/wp-content/uploads/2018/04/cursos-online-gratuitos-seguridad-inform%C3%A1tica.jpg';
      }

      this.course = course;
      this.dataSource = course.words;

      this.UsersService.getUser(course.user_id).subscribe((user) => {
        this.courseOwner = user.user;

        if (user.id === this.user.id) {
          this.isOwner = true;
        }
      });
    });
  }

  ngOnInit(): void {}

  unjoin() {
    this.CoursesService.unjoin(this.user.id, this.courseId).subscribe(() => {
      this.router.navigate(['/courses']);
    });
  }

  restartProgress() {
    this.CoursesService.restartProgress(this.user.id, this.courseId).subscribe(
      () => {
        this.router.navigate(['/courses']);
      }
    );
  }
}
