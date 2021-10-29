import { Component, OnInit } from '@angular/core';
import { ListCourses } from '../courses';

@Component({
  selector: 'app-list-courses',
  templateUrl: './list-courses.component.html',
  styleUrls: ['./list-courses.component.scss'],
})
export class ListCoursesComponent implements OnInit {
  listCourses: ListCourses[] = [];
  message: string = "";

  recibirMensaje($event: any): void {
    this.message = $event;
    console.log(this.message);
  }


  constructor() {}

  ngOnInit(): void {
    for (let i = 0; i < 10; i++) {
      const course: ListCourses = {
        name: `Curso #${i + 1}`,
        image: 'https://material.angularjs.org/1.1.1/img/list/60.jpeg',
        wordsLearned: this.rand(0, 10),
        totalWords: this.rand(0, 100),
        progress: this.rand(0, 40),
        reviewIn: this.rand(1, 3),
      };
      this.listCourses.push(course);
    }
  }

  rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
