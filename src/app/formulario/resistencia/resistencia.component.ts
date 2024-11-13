import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Resistencia {
  banda1: string;
  banda2: string;
  banda3: string;
  valorRadio: string;
  multiplicacion: number;
  valorMinimo: number;
  valorMaximo: number;
}

interface ResistenciaColores {
  banda1: string;
  banda2: string;
  banda3: string;
  valorRadio: string;
}

@Component({
  selector: 'app-resistencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resistencia.component.html',
  styles: []
})
export default class ResistenciaComponent {
  resistencias: Resistencia[] = [];
  mostrarTablaFlag: boolean = false; // Variable para controlar la visibilidad de la tabla

  // Mapeo de colores a sus valores
  private valoresBanda1: { [key: string]: number } = {
    Negro: 0,
    Cafe: 1,
    Rojo: 2,
    Naranja: 3,
    Amarillo: 4,
    Verde: 5,
    Azul: 6,
    Violeta: 7,
    Gris: 8,
    Blanco: 9,
  };

  private valoresBanda2: { [key: string]: number } = {
    Negro: 0,
    Cafe: 1,
    Rojo: 2,
    Naranja: 3,
    Amarillo: 4,
    Verde: 5,
    Azul: 6,
    Violeta: 7,
    Gris: 8,
    Blanco: 9,
  };

  private valoresBanda3: { [key: string]: number } = {
    Negro: 1,
    Cafe: 10,
    Rojo: 100,
    Naranja: 1000,
    Amarillo: 10000,
    Verde: 100000,
    Azul: 1000000,
    Violeta: 10000000,
    Gris: 100000000,
    Blanco: 1000000000,
  };

  constructor() {
    // Cargar resistencias desde el localStorage al iniciar el componente
    this.cargarResistencias();
  }

  guardar() {
    const banda1Select = (document.getElementById('countries1') as HTMLSelectElement);
    const banda2Select = (document.getElementById('countries2') as HTMLSelectElement);
    const banda3Select = (document.getElementById('countries3') as HTMLSelectElement);
    const valorRadio = (document.querySelector('input[name="default-radio"]:checked') as HTMLInputElement).value;

    // Guardar los colores seleccionados como texto
    const banda1 = banda1Select.options[banda1Select.selectedIndex].text;
    const banda2 = banda2Select.options[banda2Select.selectedIndex].text;
    const banda3 = banda3Select.options[banda3Select.selectedIndex].text;

    // Crear un objeto para guardar en la lista con todos los datos
    const nuevaResistencia: Resistencia = {
      banda1,
      banda2,
      banda3,
      valorRadio,
      multiplicacion: 0,
      valorMinimo: 0,
      valorMaximo: 0,
    };

    // Agregar el objeto al array
    this.resistencias.push(nuevaResistencia);

    // Crear un objeto para guardar solo los colores en localStorage
    const coloresResistencia: ResistenciaColores = {
      banda1,
      banda2,
      banda3,
      valorRadio,
    };

    // Guardar solo los colores en localStorage
    localStorage.setItem('resistencias', JSON.stringify([...this.getStoredColores(), coloresResistencia]));
    
    // Mostrar la tabla después de guardar
    this.mostrarTabla();
  }

  cargarResistencias() {
    const storedResistencias = localStorage.getItem('resistencias');
    if (storedResistencias) {
      const coloresResistencias: ResistenciaColores[] = JSON.parse(storedResistencias);
      this.resistencias = coloresResistencias.map(res => ({
        ...res,
        multiplicacion: 0,
        valorMinimo: 0,
        valorMaximo: 0,
      }));
    }
  }

  getStoredColores(): ResistenciaColores[] {
    const storedResistencias = localStorage.getItem('resistencias');
    return storedResistencias ? JSON.parse(storedResistencias) : [];
  }

  calcularValores(resistencia: Resistencia) {
    const valorBanda1 = this.valoresBanda1[resistencia.banda1];
    const valorBanda2 = this.valoresBanda2[resistencia.banda2];
    const valorBanda3 = this.valoresBanda3[resistencia.banda3];

    // Combinar banda1 y banda2 en un solo valor
    const valorCombinado = parseInt(`${valorBanda1}${valorBanda2}`);

    // Multiplicar el valor combinado por el valor de banda3
    const multiplicacion = valorCombinado * valorBanda3;

    // Obtener el valor de tolerancia según el radio seleccionado
    const valorTolerancia = resistencia.valorRadio === 'Oro' ? 0.05 : 0.1; // 5% para oro, 10% para plata

    // Calcular el valor mínimo y máximo
    const minimo = multiplicacion - (multiplicacion * valorTolerancia);
    const maximo = multiplicacion + (multiplicacion * valorTolerancia);

    return { multiplicacion, minimo, maximo };
}


  mostrarTabla() {
    for (let resistencia of this.resistencias) {
      const { multiplicacion, minimo, maximo } = this.calcularValores(resistencia);
      resistencia.multiplicacion = multiplicacion;
      resistencia.valorMinimo = minimo;
      resistencia.valorMaximo = maximo;
    }
    this.mostrarTablaFlag = true; // Cambiar el estado para mostrar la tabla
  }

  borrarResistencias() {
    localStorage.removeItem('resistencias');
    this.resistencias = []; // Limpiar la lista de resistencias
    this.mostrarTablaFlag = false; // Ocultar la tabla
  }

  obtenerColor(banda: string): string {
    const colores: { [key: string]: string } = {
      Negro: '#000000',
      Cafe: '#8B4513',
      Rojo: '#FF0000',
      Naranja: '#FFA500',
      Amarillo: '#FFFF00',
      Verde: '#008000',
      Azul: '#0000FF',
      Violeta: '#EE82EE',
      Gris: '#808080',
      Blanco: '#FFFFFF',
      Plata: '#C0C0C0', // Para valor de tolerancia Plata
      Oro: '#FFD700'    // Para valor de tolerancia Oro
    };
    return colores[banda] || '#FFFFFF'; // Blanco por defecto si no coincide
  }
}
