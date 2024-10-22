import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Empleado {
  matricula: string;
  nombre: string;
  correo: string;
  edad: number;
  horas: number;
}

@Component({
  selector: 'empleados',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './empleados.component.html',
  styles: []
})
export default class EmpleadosComponent implements OnInit {
  formulario!: FormGroup;
  listaEmpleados: Empleado[] = [];

  constructor(private readonly formBuilder: FormBuilder) {}

  private crearFormulario(): FormGroup {
    return this.formBuilder.group({
      matricula: ['', Validators.required],
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      edad: [0, [Validators.required, Validators.min(18)]],
      horas: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.formulario = this.crearFormulario();
    this.cargarEmpleados(); 
  }

  agregarEmpleado() {
    const nuevoEmpleado: Empleado = {
      matricula: this.formulario.get('matricula')?.value,
      nombre: this.formulario.get('nombre')?.value,
      correo: this.formulario.get('correo')?.value,
      edad: this.formulario.get('edad')?.value,
      horas: this.formulario.get('horas')?.value
    };
    
    this.listaEmpleados.push(nuevoEmpleado);
    this.guardarEnLocalStorage();
    this.formulario.reset();
    this.cargarEmpleados(); 
  }

  calcularPagoHorasNormales(horas: number): number {
    return horas > 40 ? 40 * 70 : horas * 70;
  }

  calcularPagoHorasAdicionales(horas: number): number {
    return horas > 40 ? (horas - 40) * 140 : 0;
  }

  calcularSubtotal(horas: number): number {
    return this.calcularPagoHorasNormales(horas) + this.calcularPagoHorasAdicionales(horas);
  }

  calcularTotal(): number {
    return this.listaEmpleados.reduce((acumulador, empleado) => {
      return acumulador + this.calcularSubtotal(empleado.horas);
    }, 0);
  }

  cargarEmpleados() {
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      this.listaEmpleados = JSON.parse(empleadosGuardados);
    }
  }

  eliminarEmpleado() {
    const matricula = this.formulario.get('matricula')?.value;
    this.listaEmpleados = this.listaEmpleados.filter(emp => emp.matricula !== matricula);
    this.guardarEnLocalStorage();
    this.cargarEmpleados(); 
  }

  actualizarEmpleado() {
    const matricula = this.formulario.get('matricula')?.value;
    const empleado = this.listaEmpleados.find(emp => emp.matricula === matricula);
    if (empleado) {
      empleado.nombre = this.formulario.get('nombre')?.value;
      empleado.correo = this.formulario.get('correo')?.value;
      empleado.edad = this.formulario.get('edad')?.value;
      empleado.horas = this.formulario.get('horas')?.value;
      this.guardarEnLocalStorage();
      this.cargarEmpleados(); 
    }
  }

  guardarEnLocalStorage() {
    localStorage.setItem('empleados', JSON.stringify(this.listaEmpleados));
  }
}
