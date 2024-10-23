import { Component, OnInit } from '@angular/core';
import { MessageserviceService } from '../messageservice.service';
import { FormBuilder,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-add-message',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-message.component.html',
  styles: ``
})
export class AddMessageComponent {
  forGroup!: FormGroup
  constructor(private readonly fb: FormBuilder,public messageServidce: MessageserviceService ){}
    alumno:string="";

    ngOnit(): void{
      this.forGroup = this.initForm();
    }

    initForm():FormGroup{
      return this.fb.group({
        nombre:[''],
      })
    }

    addAlumno(){
      let {nombre} =this.forGroup.value;
      console.log(nombre)
      this.messageServidce.add(nombre);
      this.forGroup.get('nombre')?.setValue('')
    }
}
