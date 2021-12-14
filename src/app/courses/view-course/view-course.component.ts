import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { course, Words } from '../courses';
import { CoursesService } from '../courses.service';
import { UsersService } from '../../users/users.service';
import { user } from 'src/app/users/users';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss'],
})
export class ViewCourseComponent implements OnInit {
  @ViewChild('listWords') listWords!: MatTable<Words>;

  displayedColumns: string[] = ['concept', 'answer'];
  dataSource: Words[] = [];

  user!: user;

  courseId!: number;
  course!: course;

  courseOwner!: string;

  join: string = 'Empezar';

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
      });
    });

    this.CoursesService.isUserJoined(this.user.id, this.courseId).subscribe(
      (isJoined) => {
        if (isJoined) {
          this.join = 'Ya estás inscrito';
        }
      }
    );
  }

  ngOnInit(): void {}

  async joinCourse() {
    const isJoined = await this.CoursesService.isUserJoined(
      this.user.id,
      this.courseId
    ).toPromise();

    if (!isJoined) {
      await this.CoursesService.join(
        this.user.id,
        this.courseId
      ).toPromise();

      this.router.navigate(['/courses/', this.courseId, 'learn']);
    }
  }
}
