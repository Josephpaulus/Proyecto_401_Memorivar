import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { CoursesService } from '../courses.service';
import { Words, course } from '../courses';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { user } from 'src/app/users/users';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss'],
})
export class AddCourseComponent implements OnInit {
  user!: user;

  // datos del curso
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
    private router: Router
  ) {
    this.user = this.UsersService.getCurrentUser();
  }

  ngOnInit(): void {}

  addWord() {
    if (this.wordInput.nativeElement.value == '') {
      this.wordInput.nativeElement.focus();
      return;
    }

    if (this.answerInput.nativeElement.value == '') {
      this.answerInput.nativeElement.focus();
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

  removeWord(row: Words) {
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

  create() {
    const course: course = {
      id: -1,
      user_id: this.user.id,
      name: this.nameInput,
      description: this.descriptionInput,
      image: this.imageInput,
      words: this.dataSource,
      status: Number(this.status),
    };

    console.log(course);

    this.CoursesService.create(course).subscribe((res) => {
      this.router.navigate(['./courses']);
    });
  }
}
