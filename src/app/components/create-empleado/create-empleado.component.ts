import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IdentificationDocument } from 'src/app/Validators/identification-document';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {

  createEmpleado: FormGroup;
  submited = false;
  loading = false;
  id: string | null;
  title = 'Agregar empleado';
  buttonText = 'Agregar';
  // To collect unfiltered data from db
  empleado:any;
  // To collect filtered data from db and later to collect update from screen
  data:any;
  // identificationDocument: any;

  constructor(private fb: FormBuilder,
    private _empleadoService: EmpleadoService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private identificationDocument: IdentificationDocument) { 

    // Set validators
    this.createEmpleado = this.fb.group({
      nombre: new FormControl('',[
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/[A-Zaz-z-áéíóúüÁÉÍÓÚÜ ]+/)
      ]),
      apellido:  new FormControl('',[
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/[A-Zaz-z-áéíóúüÁÉÍÓÚÜ]+/)
      ]),
      documento: new FormControl('',[ 
        Validators.required,
        this.identificationDocument.validate
      ]),
      salario:  new FormControl('',[ 
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(6),
        Validators.pattern(/[0-9]/)
      ]),
    });

    // Get id param if any
    this.id = this.aRoute.snapshot.paramMap.get('id');

  }

  ngOnInit(): void {
    // Call edit mode to load data
    this.isEdit();
    
  }

  // Deal with Add | Edit operation
  addOrEdit() {
    this.submited = true;

    // Refuse on invalid form
    if (this.createEmpleado.invalid) {
      return;
    }

    // Deal Add | edit
    if (this.id === null) {
      this.agregarEmpleado();
    } else {
      this.editarEmpleado();
    }

  }

  // Add new record
  agregarEmpleado() {
    this.submited = true;

    if (this.createEmpleado.invalid) {
      return;
    }

    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }

    this.loading = true;
     this._empleadoService.agregarEmpleado(empleado).then(() => {
      this.toastr.success('El empleado fue registrado con éxito', 'Empleado Registrado');
      this.router.navigate(['/list-empleados']);
      this.loading = false;
     }).catch(error => {
      console.log(error);
      this.loading = false;
     })
  }

  editarEmpleado() {
    this.loading = true;

    // Update object this.data
    this.data.nombre = this.createEmpleado.value.nombre;
    this.data.apellido = this.createEmpleado.value.apellido;
    this.data.documento = this.createEmpleado.value.documento;
    this.data.salario = this.createEmpleado.value.salario;
    this.data.fechaActualizacion = Date();

    this._empleadoService.updateEmpleado(this.id, this.data);

    this.toastr.success('El empleado fue actualizado con éxito', 'Empleado Actualizado');
      this.router.navigate(['/list-empleados']);
      this.loading = false;
  }

  // Edit method if id param received
  isEdit() {
    console.info('on isEdit')
    if (this.id !== null) {
      console.warn('id is not null so get single recor to print')

      this.title = 'Editar empleado';
      this.buttonText = 'Editar';
      this.loading = true;


      this.empleado = this._empleadoService.getEmpleado(this.id)
        .then( (data: any) => {
          this.loading = false;
          this.data = data;

          this.createEmpleado.setValue({
            nombre: data.nombre,
            apellido: data.apellido,
            documento: data.documento,
            salario: data.salario
          })

        }).catch(error => {
          console.log(error);
        });
    }

  }

}
