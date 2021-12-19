import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from 'src/app/users/users';
import { UsersService } from 'src/app/users/users.service';
import { ChallengeService } from '../../challenge/challenge.service';
import { Challenge } from '../../challenge/challenge';
import { Action, Answer, Concept, LearnedConcept, View } from '../learn';
import { LearnService } from '../learn.service';
import { ShowAnswerInputComponent } from '../show-answer-input/show-answer-input.component';

@Component({
  selector: 'app-learn-course',
  templateUrl: './learn-course.component.html',
  styleUrls: ['./learn-course.component.scss'],
})
export class LearnCourseComponent implements OnInit {
  @ViewChild(ShowAnswerInputComponent)
  showAnswerInput!: ShowAnswerInputComponent;

  answerInput: string = '';

  user!: user;
  courseId: number;

  concepts: Concept[] = [];
  conceptsToLearn: Concept[] = [];
  conceptsLearnedBD: any[] = [];

  conceptsLearned: LearnedConcept[] = [];

  currentConcept: number = 0;
  startConcept: number = -1;
  advancedConcept: boolean = false;

  progress: number = 0;

  action: string = Action.next;

  concept: string = '';
  answer: string = '';

  currentSession: number = 0;

  View = View;
  currentView: View = View.init;

  // estado de la respuesta, -1: no se ha checado, 0: incorrecto, 1: correcto
  _statusAnswer: number = Answer.none;

  totalTransactions: number = 0;
  currentTransaction: number = 0;

  conceptShown: boolean = false;
  showInput: boolean = false;

  correctAnswers: number = 0;

  continueSession: boolean = false;

  startTime: number = 0;
  attempts: number = 0;

  points: number = 0;

  title: string = '';
  msg: string = '';

  review: boolean = false;

  challenge: boolean;
  challengeId: number;
  isOpponent: boolean;
  opponentId: number;

  constructor(
    private UsersService: UsersService,
    private LearnService: LearnService,
    private ChallengeService: ChallengeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.user = this.UsersService.getCurrentUser();
    this.courseId = this.route.snapshot.params.id;
    this.review = this.route.snapshot.data.review;

    const data = this.router.getCurrentNavigation()?.extras?.state;

    this.challenge = !!data?.challenge;
    this.challengeId = data?.challengeId;
    this.opponentId = data?.opponentId;
    this.isOpponent = !!data?.opponent;

    this.LearnService.getConcepts(this.courseId).subscribe((concepts) => {
      this.concepts = concepts;

      console.log(this.concepts);

      this.LearnService.getLearnedConcepts(
        this.user.id,
        this.courseId
      ).subscribe((concepts) => {
        this.conceptsLearnedBD = concepts;

        console.log(this.conceptsLearnedBD);

        if (this.review) {
          this.startReview();
        } else if (this.challenge) {
          this.startChallenge();
        } else {
          this.startSession();
        }

        this.updateTitle();
      });
    });
  }

  ngOnInit(): void {}

  startSession() {
    this.conceptsLearned = [];
    this.totalTransactions = 0;
    this.currentTransaction = 0;
    this.points = 0;

    const start = this.currentSession * this.LearnService.conceptsPerSession;
    const end =
      (this.currentSession + 1) * this.LearnService.conceptsPerSession;

    console.log(start, end);

    const concepts = this.concepts.slice(start, end);
    const conceptsLearned = this.conceptsLearnedBD.slice(start, end);

    console.log(concepts, conceptsLearned);

    if (concepts.length == 0) {
      this.msg = 'No hay más conceptos para aprender';
      this.view = View.msg;
      return;
    }

    for (let i = 0; i < concepts.length; i++) {
      if (conceptsLearned[i]) {
        const conceptLearned = conceptsLearned[i];

        const concept: LearnedConcept = {
          concept: concepts[i],
          user_id: conceptLearned.user_id,
          correct_answers: conceptLearned.correct_answers,
          learned: conceptLearned.learned,
          attempts: conceptLearned.attempts,
          time_spent: conceptLearned.time_spent,
          time_review: conceptLearned.time_review,
        };

        if (conceptLearned.correct_answers < this.LearnService.correctAnswers) {
          this.totalTransactions += conceptLearned.correct_answers;
          this.currentTransaction += conceptLearned.correct_answers;

          this.showInput = true;

          this.continueSession = true;

          if (
            conceptsLearned.length !== i + 1 &&
            conceptLearned.correct_answers >
              conceptsLearned[i + 1].correct_answers
          ) {
            this.advancedConcept = true;
            this.startConcept = i + 1;
          }

          this.totalTransactions +=
            this.LearnService.correctAnswers - conceptLearned.correct_answers;
        } else if (
          conceptLearned.correct_answers === this.LearnService.correctAnswers
        ) {
          if (
            conceptsLearned.length !== i + 1 &&
            conceptLearned.correct_answers >
              conceptsLearned[i + 1].correct_answers
          ) {
            this.advancedConcept = true;
            this.startConcept = i + 1;
          }

          this.totalTransactions += conceptLearned.correct_answers;
          this.currentTransaction += conceptLearned.correct_answers;
        }

        this.points +=
          conceptLearned.correct_answers *
          this.LearnService.pointsForAnsweingRight;

        this.conceptsLearned.push(concept);
      } else {
        if (this.startConcept === -1) {
          this.startConcept = i;
        }

        this.conceptsToLearn.push(concepts[i]);
      }
    }

    if (!this.advancedConcept && this.startConcept === -1) {
      this.startConcept = 0;
    }

    if (this.conceptsToLearn.length === 0) {
      if (this.continueSession) {
        this.startTime = this.getTime();

        this.view = View.input;
      } else {
        this.currentSession++;

        this.startSession();

        return;
      }
    } else {
      this.view = View.answer;

      this.totalTransactions +=
        this.conceptsToLearn.length * this.LearnService.correctAnswers;
    }

    this.concepts = concepts;

    this.currentConcept = this.startConcept;

    this.updateConcept();

    this.updateProgress();
  }

  startReview() {
    const conceptsLearned = this.conceptsLearnedBD;
    const expiredConcepts = [];

    for (let i = 0; i < conceptsLearned.length; i++) {
      const conceptLearned = conceptsLearned[i];

      if (conceptLearned.learned) {
        const concept: LearnedConcept = {
          concept: this.concepts[i],
          user_id: conceptLearned.user_id,
          correct_answers: conceptLearned.correct_answers,
          learned: conceptLearned.learned,
          attempts: conceptLearned.attempts,
          time_spent: conceptLearned.time_spent,
          time_review: conceptLearned.time_review,
        };

        if (conceptLearned.time_review <= this.getTime()) {
          if (this.startConcept === -1) {
            this.startConcept = i;
          }

          expiredConcepts.push(concept);
        } else {
          this.conceptsLearned.push(concept);
        }
      }
    }

    if (expiredConcepts.length !== 0) {
      this.conceptsLearned = expiredConcepts;
    }

    if (this.conceptsLearned.length === 0) {
      this.msg = 'No hay conceptos aprendidos para revisar';
      this.view = View.msg;
      return;
    }

    this.totalTransactions = this.conceptsLearned.length;

    this.currentConcept = this.startConcept !== -1 ? this.startConcept : 0;

    this.updateConcept();

    this.startTime = this.getTime();

    this.view = View.input;
  }

  async startChallenge() {
    if (this.concepts.length === 0) {
      this.msg = 'No hay conceptos para desafiar';
      this.view = View.msg;
      return;
    }

    this.msg = 'Cargando...';
    this.view = View.msg;

    if (this.isOpponent) {
      this.concepts = await this.ChallengeService.getConcepts({
        challengeId: this.challengeId,
        courseId: this.courseId,
        userId: this.user.id,
      }).toPromise();
    } else {
      this.concepts = this.concepts
        .sort(() => Math.random() - Math.random())
        .slice(0, this.ChallengeService.conceptsPerChallenge);

      const challenge: Challenge = {
        courseId: this.courseId,
        userId: this.user.id,
        opponentId: this.opponentId,
        creationTime: this.getTime(),
        concepts: this.concepts,
      };

      this.challengeId = await this.ChallengeService.createChallenge(
        challenge
      ).toPromise();
    }

    this.totalTransactions = this.concepts.length;

    this.currentConcept = 0;

    this.updateConcept();

    this.view = View.input;
  }

  updateConcept() {
    this.concept = this.concepts[this.currentConcept].concept;
    this.answer = this.concepts[this.currentConcept].answer;
  }

  checkAnswer($event: any) {
    this.answerInput = $event;
  }

  set view(view: View) {
    this.currentView = view;
  }

  get view() {
    return this.currentView;
  }

  set statusAnswer(status: Answer) {
    this._statusAnswer = status;
  }

  get statusAnswer() {
    return this._statusAnswer;
  }

  updateProgress() {
    this.progress = (this.currentTransaction / this.totalTransactions) * 100;
  }

  next() {
    if (this.view === View.answer || this.view === View.error) {
      this.answerInput = '';

      this.view = View.input;
      this.action = Action.CheckAnswer;

      this.startTime = this.getTime();
    } else if (this.view === View.input) {
      if (this.statusAnswer === Answer.none) {
        if (this.answerInput === this.answer) {
          this.statusAnswer = Answer.answered;
          this.action = Action.next;
        } else {
          this.statusAnswer = Answer.wrong;

          if (!this.challenge) {
            this.action = Action.seeAnswer;
          }
        }

        this.showAnswerInput.setStatus(this.statusAnswer);
      } else if (this.statusAnswer === Answer.wrong && !this.challenge) {
        if (this.answerInput === '') {
          this.view = View.answer;
        } else {
          this.view = View.error;
        }

        this.attempts++;

        this.action = Action.next;
        this.statusAnswer = Answer.none;
      } else if (this.challenge) {
        if (this.answerInput === this.answer) {
          this.ChallengeService.updateAnswer(
            this.challengeId,
            this.courseId,
            this.user.id,
            this.concepts[this.currentConcept].id,
            1
          ).toPromise();
        }

        this.statusAnswer = Answer.none;
        this.currentTransaction++;
        this.updateProgress();

        this.currentConcept++;

        if (this.currentConcept < this.concepts.length) {
          this.updateConcept();
        }

        this.view = View.init;

        setTimeout(() => {
          this.answerInput = '';
          this.view = View.input;
        }, 0);
      } else {
        const learnedConcept: LearnedConcept = {
          concept: this.concepts[this.currentConcept],
          user_id: this.user.id,
          correct_answers: 1,
          learned: false,
          attempts: this.attempts,
          time_spent: this.getTimeSpent(),
          time_review: 0,
        };

        if (
          this.conceptsLearned.find(
            (concept) => concept.concept.id === learnedConcept.concept.id
          )
        ) {
          const index = this.conceptsLearned.findIndex(
            (concept) => concept.concept.id === learnedConcept.concept.id
          );

          const concept = this.conceptsLearned[index];

          if (!this.review) {
            concept.correct_answers++;
            concept.attempts += this.attempts;
            concept.time_spent += this.getTimeSpent();
          }

          const learned =
            concept.correct_answers === this.LearnService.correctAnswers;

          concept.learned = learned;

          concept.time_review = learned ? this.getTime() + 30 : 0;

          this.LearnService.updateLearnedConcept(concept).toPromise();

          if (this.review) {
            concept.correct_answers = 1;
            concept.attempts += this.attempts;
            concept.time_spent = this.getTimeSpent();
          }
        } else {
          this.LearnService.addLearnedConcept(learnedConcept).toPromise();

          this.conceptsLearned.push(learnedConcept);
        }

        this.points += this.LearnService.pointsForAnsweingRight;

        this.statusAnswer = Answer.none;
        this.attempts = 0;

        this.currentTransaction++;
        this.updateProgress();

        if (
          !this.review &&
          this.conceptsLearned[this.currentConcept].correct_answers > 1
        ) {
          this.conceptShown = true;
        }

        if (this.currentConcept === this.concepts.length - 1) {
          if (this.advancedConcept) {
            this.startConcept--;
            this.advancedConcept = false;
          } else {
            this.startConcept = 0;
          }

          this.currentConcept = this.startConcept;

          if (
            !this.review &&
            this.conceptsLearned[this.currentConcept].correct_answers === 1
          ) {
            this.conceptShown = true;
          }
        } else {
          this.currentConcept++;
        }

        this.updateConcept();

        if (this.conceptShown || this.review) {
          this.view = View.init;

          setTimeout(() => {
            this.answerInput = '';
            this.view = View.input;
            this.startTime = this.getTime();
          }, 0);

          this.conceptShown = false;
        } else {
          this.view = View.answer;
        }
      }
    }

    if (this.currentTransaction === this.totalTransactions - 1) {
      this.action = Action.finish;
    }

    if (this.currentTransaction === this.totalTransactions) {
      if (this.challenge) {
        setTimeout(() => {
          this.msg = 'Cargando...';
          this.view = View.msg;
        }, 0);

        if (this.isOpponent) {
          this.ChallengeService.finishChallenge(this.challengeId).subscribe(
            () => {
              this.router.navigate(['./courses/', this.courseId, 'challenge']);
            }
          );
        } else {
          this.router.navigate(['./courses/', this.courseId, 'challenge']);
        }
      } else {
        setTimeout(() => {
          this.view = View.results;
        }, 0);
      }

      console.log('session finished');
    }

    console.log(
      this.currentConcept,
      this.concepts,
      this.conceptShown,
      this.conceptsToLearn,
      this.answerInput,
      this.answer,
      this.currentTransaction,
      this.totalTransactions,
      this.startTime,
      this.getTimeSpent(),
      this.attempts
    );
  }

  updateTitle() {
    if (this.review) {
      this.title = 'Repaso';
    } else if (this.challenge) {
      this.title = 'Desafío';
    } else {
      this.title = `Sesión ${this.currentSession + 1}`;
    }
  }

  exit() {
    if (this.challenge) {
      this.router.navigate(['./courses/', this.courseId, 'challenge']);
      return;
    }

    this.router.navigate(['./courses/', this.courseId, 'info']);
  }

  getTime() {
    return Math.round(Date.now() / 1000);
  }

  getTimeSpent() {
    return this.getTime() - this.startTime;
  }
}
