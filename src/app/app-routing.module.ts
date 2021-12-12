import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCourseComponent } from './courses/add-course/add-course.component';
import { EditCourseComponent } from './courses/edit-course/edit-course.component';
import { ExploreCoursesComponent } from './courses/explore-courses/explore-courses.component';
import { InfoCourseComponent } from './courses/info-course/info-course.component';
import { LearnCourseComponent } from './courses/learn/learn-course/learn-course.component';
import { ListCoursesComponent } from './courses/list-courses/list-courses.component';
import { ViewCourseComponent } from './courses/view-course/view-course.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';
import { IsAuthenticatedGuard } from './users/is-authenticated.guard';
import { ProfileComponent } from './users/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // login
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  // usuarios
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'courses',
    component: ListCoursesComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  // cursos
  {
    path: 'explore',
    component: ExploreCoursesComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'courses/add',
    component: AddCourseComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'courses/:id',
    component: ViewCourseComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'courses/:id/info',
    component: InfoCourseComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'courses/:id/edit',
    component: EditCourseComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'courses/:id/learn',
    component: LearnCourseComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  // error 404
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
