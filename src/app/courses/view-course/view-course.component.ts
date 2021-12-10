import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { course, Words } from '../courses';
import { CoursesService } from '../courses.service';
import { UsersService } from '../../users/users.service';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss'],
})
export class ViewCourseComponent implements OnInit {
  @ViewChild('listWords') listWords!: MatTable<Words>;

  displayedColumns: string[] = ['concept', 'answer'];
  dataSource: Words[] = [];

  courseId!: number;
  course!: course;

  courseOwner!: string;

  constructor(
    private route: ActivatedRoute,
    private CoursesService: CoursesService,
    private UsersService: UsersService
  ) {
    this.courseId = this.route.snapshot.params.id;

    this.CoursesService.getCourse(this.courseId).subscribe((course) => {
      this.course = course;
      this.dataSource = course.words;

      this.UsersService.getUser(course.user_id).subscribe((user) => {
        this.courseOwner = user.user;
      });
    });
  }

  ngOnInit(): void {}
}
