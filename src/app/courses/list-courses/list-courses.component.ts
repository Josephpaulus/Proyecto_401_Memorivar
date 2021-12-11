import { Component, OnInit } from '@angular/core';
import { user } from 'src/app/users/users';
import { UsersService } from 'src/app/users/users.service';
import { course, ListCourses } from '../courses';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-list-courses',
  templateUrl: './list-courses.component.html',
  styleUrls: ['./list-courses.component.scss'],
})
export class ListCoursesComponent implements OnInit {
  courses: course[] = [];
  user!: user;

  constructor(private CoursesService: CoursesService, private UsersService: UsersService) {
    this.user = this.UsersService.getCurrentUser();
  }
  ngOnInit(): void {
    this.CoursesService.userCourses(this.user.id).subscribe((courses) => {
      for (const course of courses) {
        if (!course.image) {
          course.image = 'https://www.welivesecurity.com/wp-content/uploads/2018/04/cursos-online-gratuitos-seguridad-inform%C3%A1tica.jpg';
        }
      }

      this.courses = courses;
    });
  }
}
