import { Component } from '@angular/core';
import { MessageserviceService } from '../messageservice.service';

@Component({
  selector: 'app-add-message',
  standalone: true,
  imports: [],
  templateUrl: './add-message.component.html',
  styles: ``
})
export class AddMessageComponent {

  constructor(public messageServidce: MessageserviceService){}
    alumno:string="";

    addAlumno(){
      this.messageServidce.add(this.alumno);
      this.alumno="";
    
  }
}
