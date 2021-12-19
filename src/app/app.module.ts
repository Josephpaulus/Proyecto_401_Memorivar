import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ListCoursesComponent } from './courses/list-courses/list-courses.component';
import { LoginComponent } from './login/login.component';
import { ExploreCoursesComponent } from './courses/explore-courses/explore-courses.component';
import { AddCourseComponent } from './courses/add-course/add-course.component';
import { HeaderProfileComponent } from './users/header-profile/header-profile.component';
import { ProfileComponent } from './users/profile/profile.component';
import { ViewCourseComponent } from './courses/view-course/view-course.component';
import { InfoCourseComponent } from './courses/info-course/info-course.component';
import { EditCourseComponent } from './courses/edit-course/edit-course.component';
import { LearnCourseComponent } from './courses/learn/learn-course/learn-course.component';
import { ShowAnswerComponent } from './courses/learn/show-answer/show-answer.component';
import { ShowAnswerInputComponent } from './courses/learn/show-answer-input/show-answer-input.component';
import { ShowAnswerErrorComponent } from './courses/learn/show-answer-error/show-answer-error.component';
import { ResultsLearningComponent } from './courses/learn/results-learning/results-learning.component';
import { MsgLearnComponent } from './courses/learn/msg-learn/msg-learn.component';
import { ChallengeComponent } from './courses/challenge/challenge/challenge.component';
import { UsersChallengeComponent } from './courses/challenge/users-challenge/users-challenge.component';
import { ChallengeDetailsComponent } from './courses/challenge/challenge-details/challenge-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ListCoursesComponent,
    LoginComponent,
    ExploreCoursesComponent,
    AddCourseComponent,
    HeaderProfileComponent,
    ProfileComponent,
    ViewCourseComponent,
    InfoCourseComponent,
    EditCourseComponent,
    LearnCourseComponent,
    ShowAnswerComponent,
    ShowAnswerInputComponent,
    ShowAnswerErrorComponent,
    ResultsLearningComponent,
    MsgLearnComponent,
    ChallengeComponent,
    UsersChallengeComponent,
    ChallengeDetailsComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressBarModule,
    MatTableModule,
    MatRadioModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
