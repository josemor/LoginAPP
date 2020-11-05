import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Sweet Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordarUsuario = false;
  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
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

    this.auth.registrarNuevoUsario( this.usuario ).subscribe( resp => {
        console.log(resp);
        Swal.close();
        if (this.recordarUsuario) {
          localStorage.setItem('email', this.usuario.email);
        }
        this.router.navigateByUrl('/home');
      }, (err) => {
        if (err.error.error.message === 'EMAIL_EXISTS') {
          mensaje = 'El correo electronico ya existe';
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            text: mensaje
          });
        }
      });
  }

}
