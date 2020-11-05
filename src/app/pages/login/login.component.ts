import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
// Sweet Alert
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  recordarUsuario = false;
  constructor( private auth: AuthService,
               private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('email') ) {
      this.usuario.email = localStorage.getItem('email');
      this.recordarUsuario = true;
    }
  }

  onSubmit( form: NgForm ) {
    let mensaje: string;
    if ( form.invalid ) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });

    Swal.showLoading();

    this.auth.logIn( this.usuario ).subscribe( resp => {

      console.log(resp);
      Swal.close();
      if (this.recordarUsuario) {
        localStorage.setItem('email', this.usuario.email);
      }
      this.router.navigateByUrl('/home');
      }, (err) => {
        if (err.error.error.message === 'EMAIL_NOT_FOUND' || err.error.error.message === 'INVALID_PASSWORD') {
          mensaje = 'Usuario y/o contaseña invalidos, intenta nuevamente o registrate.';
          Swal.fire({
            icon: 'error',
            text: mensaje
          });
        }
      });
  }

}
