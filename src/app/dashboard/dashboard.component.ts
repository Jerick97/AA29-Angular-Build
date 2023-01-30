import { Component, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import {DataSource} from '@angular/cdk/collections';
import {Observable, ReplaySubject} from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface PeriodicElement {
  codigo: number;
  descripcion: string;
  precio: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {codigo: 1, descripcion: 'Hydrogen', precio: 1.0079, symbol: 'H'},
  {codigo: 2, descripcion: 'Helium', precio: 4.0026, symbol: 'He'},
  {codigo: 3, descripcion: 'Lithium', precio: 6.941, symbol: 'Li'},
  {codigo: 4, descripcion: 'Beryllium', precio: 9.0122, symbol: 'Be'},
  {codigo: 5, descripcion: 'Boron', precio: 10.811, symbol: 'B'},
  {codigo: 6, descripcion: 'Carbon', precio: 12.0107, symbol: 'C'},
  {codigo: 7, descripcion: 'Nitrogen', precio: 14.0067, symbol: 'N'},
  {codigo: 8, descripcion: 'Oxygen', precio: 15.9994, symbol: 'O'},
  {codigo: 9, descripcion: 'Fluorine', precio: 18.9984, symbol: 'F'},
  {codigo: 10, descripcion: 'Neon', precio: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataToDisplay = [...ELEMENT_DATA];

  //Almacena los valores del producto a eliminar
  codigo!: number;
  descripcion!: string;
  precio!: number;

  //Métodos para Borrar Producto
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewProducto, {
      data: {codigo: this.codigo, descripcion: this.descripcion, precio: this.precio},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.descripcion = result;
    });
  }
  
  //Métodos para la Tabla
  dataSource = new ExampleDataSource(this.dataToDisplay);

  addData() {
    const randomElementIndex = Math.floor(Math.random() * ELEMENT_DATA.length);
    this.dataToDisplay = [...this.dataToDisplay, ELEMENT_DATA[randomElementIndex]];
    this.dataSource.setData(this.dataToDisplay);
  }

  removeData() {
    this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
  }

}

class ExampleDataSource extends DataSource<PeriodicElement> {
  private _dataStream = new ReplaySubject<PeriodicElement[]>();

  constructor(initialData: PeriodicElement[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<PeriodicElement[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: PeriodicElement[]) {
    this._dataStream.next(data);
  }
}

// Formulario para Ingresar los Datos del Producto

@Component({
  selector: 'dialog-overview-producto',
  templateUrl: './producto-dialog.html',
})
export class DialogOverviewProducto {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewProducto>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}