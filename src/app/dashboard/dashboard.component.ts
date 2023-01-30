import { Component, Inject, OnInit } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable, ReplaySubject} from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Producto } from '../interface/producto';
import { ProductosService } from '../services/productos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  displayedColumns: string[] = ['Codigo', 'Descripcion', 'Precio', 'Opciones']; //Encabezados de la Tabla
  productos!:Producto[]; //almacenara los producto desde el servicio
  constructor(public dialog: MatDialog,private productoService: ProductosService) {}

  ngOnInit(): void {
    this.getProducto();
  }

  getProducto(){
    this.productoService.getProducto().subscribe(productos => {
      this.productos = productos; //lo guardamos en el array
      this.productos.sort((a, b) => a.codigo - b.codigo); //lo ordenamos ascendente
      this.dataSource = new ExampleDataSource(this.productos); //actualizamos la tabla
      
    });
  }
  

  //Métodos para la Tabla
  dataSource = new ExampleDataSource(this.productos);
  //Agregar Producto después de cerrar el dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewProducto)

    dialogRef.afterClosed().subscribe(result => {
      this.getProducto()
      this.dataSource.setData(result); //el result almacena los valores del formulario solo si existe valores enviados
    });
  }
  //Eliminar Producto
  removeData(producto:Producto) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.value) {
        this.productoService.deleteProducto(producto);
        Swal.fire(
          'Eliminado!',
          'El producto ha sido eliminado.',
          'success'
        )
      }
    });
  }

}

class ExampleDataSource extends DataSource<Producto> {
  private _dataStream = new ReplaySubject<Producto[]>();

  constructor(initialData: Producto[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Producto[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: Producto[]) {
    this._dataStream.next(data);
  }
}

// Formulario para Ingresar los Datos del Producto

@Component({
  selector: 'dialog-overview-producto',
  templateUrl: './producto-dialog.html',
  styleUrls: ['./dashboard.component.css']
})
export class DialogOverviewProducto implements OnInit{
  codigo!: string;
  descripcion!: string;
  precio!: number;
  public formRegistro !: FormGroup;

  constructor(private productoService: ProductosService, private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<DialogOverviewProducto>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    //declaramos las validaciones del formulario reactivo
    this.formRegistro = this.formBuilder.group({
      codigo:['',[
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(/^[0-9]+$/)
      ]] ,
      descripcion:['',[
        Validators.required,
        Validators.minLength(4)
      ]] ,
      precio:['',[
        Validators.required,
        Validators.pattern(/^[0-9.]+$/) //solo números y punto
      ]]
    })
  }
  //registraremos nuestro producto en Firebase
  async register(){
    this.productoService.addProducto(this.formRegistro.value)
  .then(() => {
    Swal.fire(
      'Agregado!',
      'El producto ha sido agregado.',
      'success'
    );
    this.dialogRef.close(this.formRegistro.value);
  })
  .catch(error => {
    Swal.fire(
      'Error!',
      'Ha ocurrido un error al agregar el producto.',
      'error'
    );
  });
  }

  onNoClick(): void {
    //si le da en cancelar no enviamos nada
    this.dialogRef.close();
  }
}