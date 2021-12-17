import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { CoursesService } from '../courses.service';
import { Words, course } from '../courses';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from 'src/app/users/users';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss'],
})
export class EditCourseComponent implements OnInit {
  user!: user;

  // datos del curso
  courseId!: number;
  nameInput: string = '';
  descriptionInput: string = '';
  imageInput: string = '';
  status: string = '1';

  // tabla
  displayedColumns: string[] = ['concept', 'answer', 'actions'];
  dataSource: Words[] = [];

  addIcon: string = 'add';

  // editar una palabra
  inEdit: boolean = false;
  wordInEdit = -1;

  @ViewChild('listWords') listWords!: MatTable<Words>;
  @ViewChild('wordInput') wordInput!: ElementRef;
  @ViewChild('answerInput') answerInput!: ElementRef;

  constructor(
    private UsersService: UsersService,
    private CoursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.user = this.UsersService.getCurrentUser();
    this.courseId = this.route.snapshot.params.id;

    this.CoursesService.getCourse(this.courseId).subscribe((course) => {
      if (!course.image) {
        course.image =
          'https://www.welivesecurity.com/wp-content/uploads/2018/04/cursos-online-gratuitos-seguridad-inform%C3%A1tica.jpg';
      }

      this.nameInput = course.name;
      this.descriptionInput = course.description;
      this.status = course.status.toString();
      this.dataSource = course.words;
    });
  }

  ngOnInit(): void {}

  addWord() {
    if (
      this.wordInput.nativeElement.value == '' ||
      this.answerInput.nativeElement.value == ''
    ) {
      return;
    }

    if (this.inEdit) {
      this.inEdit = false;
      this.addIcon = 'add';

      this.dataSource[this.wordInEdit].concept =
        this.wordInput.nativeElement.value;
      this.dataSource[this.wordInEdit].answer =
        this.answerInput.nativeElement.value;

      this.clearInputs();

      this.wordInEdit = -1;

      this.listWords.renderRows();

      return;
    }

    // insertar palabra en la tabla
    this.dataSource.push({
      concept: this.wordInput.nativeElement.value,
      answer: this.answerInput.nativeElement.value,
    });

    this.clearInputs();

    // actualizar tabla
    this.listWords.renderRows();
  }

  wordsToRemove: Words[] = [];

  removeWord(row: Words) {
    if (row.id) {
      row.deleted = true;
      this.wordsToRemove.push(row);
    }

    this.dataSource.splice(this.dataSource.indexOf(row), 1);
    this.listWords.renderRows();
  }

  updateWord(row: Words) {
    this.inEdit = true;

    this.wordInEdit = this.dataSource.indexOf(row);
    this.wordInput.nativeElement.value = row.concept;
    this.answerInput.nativeElement.value = row.answer;
    this.wordInput.nativeElement.focus();

    this.addIcon = 'save';
  }

  clearInputs() {
    this.wordInput.nativeElement.value = '';
    this.wordInput.nativeElement.focus();

    this.answerInput.nativeElement.value = '';
  }

  update() {
    const course: course = {
      id: this.courseId,
      user_id: this.user.id,
      name: this.nameInput,
      description: this.descriptionInput,
      image: this.imageInput,
      words: this.dataSource,
      status: Number(this.status),
    };

    course.words = [...course.words, ...this.wordsToRemove];

    console.table(course.words);

    this.CoursesService.update(course).subscribe(() => {
      this.router.navigate(['./courses/', this.courseId, 'info']);
    });
  }

  delete() {
    this.CoursesService.delete(this.courseId).subscribe(() => {
      this.router.navigate(['./courses']);
    });
  }
}
