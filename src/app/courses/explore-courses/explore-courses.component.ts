import { Component, OnInit } from '@angular/core';
import { ListCourses } from '../courses';

@Component({
  selector: 'app-explore-courses',
  templateUrl: './explore-courses.component.html',
  styleUrls: ['./explore-courses.component.scss']
})
export class ExploreCoursesComponent implements OnInit {
  listCourses: ListCourses[] = [];
  message: string = "";

  recibirMensaje($event: any): void {
    this.message = $event;
    console.log(this.message);
  }


  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < 25; i++) {
      const course: ListCourses = {
        name: `Curso #${i + 1}`,
        image: `../assets/${this.rand(1,10) }.png`,
        wordsLearned: this.rand(0, 10),
        totalWords: this.rand(30, 100),
        progress: this.rand(0, 40),
        reviewIn: this.rand(4, 16),
      };
      this.listCourses.push(course);
    }
  }

  rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
