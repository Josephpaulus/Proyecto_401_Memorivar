import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatTab } from '@angular/material/tabs';
import { MatTabGroup } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  ngOnInit(): void {
  }

  mensaje: string = "test";
  @Output() messageEvent = new EventEmitter<string>();

  enviarMensaje(): void {
    this.messageEvent.emit(this.mensaje);
  }


  email:string = "";
  password:string = "";
  remail:string = "";
  rpassword:string = "";
  rcpassword:string = "";
 
  
   constructor(private snackBar:MatSnackBar, private router: Router){
 
   }

   selected = new FormControl(0);

   public register(tabGroup: MatTabGroup) {
    this.snackBar.open(`Bienvenido ${this.remail}` ,'',{duration:1000})

    this.selected.setValue(0);

    this.remail = "";
    this.rpassword = "";
    this.rcpassword = "";


  }
   login() {



    if(this.email=="admin" && this.password=="admin"){
        this.snackBar.open('Login Exitoso','',{duration:1000})
        this.router.navigate(["./list"])
        //this.enviarMensaje();
    }else{
      this.snackBar.open('Usuario y/o contraseña equivocados','',{duration:1000})
    }

    this.email = "";
    this.password = "";
   }

 

}
