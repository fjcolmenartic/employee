import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Empleados } from 'src/app/interfaces/empleados';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit {

  empleados:Empleados[] = [];

  constructor(private _empleadoService: EmpleadoService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    // Get data
    this._empleadoService.getEmpleados().subscribe(empleados => {
      this.empleados = empleados;
      console.log(this.empleados);

    })
  }

  deleteEmpleado(id: any) {
    this._empleadoService.deleteEmpleado(id).then(() => {
      this.toastr.error('El empleado fue eleminado exitosamente', 'Registro eliminado');
    }).catch(error => {
      console.log(error);
    })
  }

}
