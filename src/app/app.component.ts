import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/Usuario.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = { id: 0, nombre: '', email: '', empresa: '' };
  cambiarUsuario: Usuario = { id: 0, nombre: '', email: '', empresa: '' }; 
  idEliminar: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe(data => {
        this.usuarios = data.map(user => ({
          id: user.id, 
          nombre: user.name,
          email: user.email,
          empresa: user.company.name
        }));
      });
  }

  agregarUsuario() {
    const body = {
      name: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {
        name: this.nuevoUsuario.empresa
      }
    };

    this.http.post('https://jsonplaceholder.typicode.com/users', body)
      .subscribe(response => {
        console.log('Usuario agregado:', response);
        this.usuarios.push({ ...this.nuevoUsuario });
        this.nuevoUsuario = { id: 0, nombre: '', email: '', empresa: '' }; 
      });
  }

  // Método para cargar los datos de un usuario al formulario de modificación
  cargarDatosUsuario(id: number) {
    const usuarioEncontrado = this.usuarios.find(usuario => usuario.id === id);
    if (usuarioEncontrado) {
      this.cambiarUsuario = { ...usuarioEncontrado };
    } else {
      console.log('Usuario no encontrado');
    }
  }

  modificarUsuario() {
    const index = this.usuarios.findIndex(usuario => usuario.id === this.cambiarUsuario.id);
    
    const body = {
      name: this.cambiarUsuario.nombre,
      email: this.cambiarUsuario.email,
      company: {
        name: this.cambiarUsuario.empresa
      }
    };

    this.http.put(`https://jsonplaceholder.typicode.com/users/${this.cambiarUsuario.id}`, body)
      .subscribe(response => {
        console.log('Usuario modificado:', response);
        if (index !== -1) {
          this.usuarios[index] = { ...this.cambiarUsuario };
        }
        this.cambiarUsuario = { id: 0, nombre: '', email: '', empresa: '' }; 
      });
  }

  eliminarUsuario() {
    const usuarioIndex = this.usuarios.findIndex(u => u.id === this.idEliminar);
    if (usuarioIndex !== -1) {
      this.http.delete(`https://jsonplaceholder.typicode.com/users/${this.idEliminar}`)
        .subscribe(response => {
          console.log('Usuario eliminado:', response);
          this.usuarios.splice(usuarioIndex, 1);
          console.log('Usuario eliminado de la lista local');
        });
    } else {
      console.log('Usuario no encontrado');
    }
  }
}