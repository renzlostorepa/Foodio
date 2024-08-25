import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatListModule} from "@angular/material/list";
import {CommonModule, NgFor} from "@angular/common";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatListModule, NgFor, FormsModule, ReactiveFormsModule, CommonModule, MatOptionModule, MatSelectModule]
})
export class MenuComponent implements OnInit {

  shop: any

  add: any;

  dataCopy = {name: "", price: 0, _id: 0};

  selectedOption: SelectedItems[] = [];

  constructor(public dialogRef: MatDialogRef<MenuComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {

    this.add = {
      "role": "Category",
      "name": "",
      "price": -1,
      "category": ""
    }
    console.log(this.data)
    if (this.data.owner) {
      this.dataCopy.name = this.data.shop.name
      this.dataCopy.price = this.data.shop.price
      this.dataCopy._id = this.data.shop._id
    }

  }


  save() {

    this.selectedOption.forEach((val) => {
      const temp = val.elements
      val.elements = []

      temp.forEach((el: any) => {

        val.elements.push({name: el[0], price: el[1]})
      })
    })


    this.dialogRef.close(this.selectedOption)
  }


  // @ts-ignore
  onGroupsChange(options: any, categoryName: string) {

    let flag = true
    let result = {
      categoryName: categoryName,
      // @ts-ignore
      elements: options.map(o => o._elementRef.nativeElement.innerText.split('\n').filter(s => s != ""))
    }

    this.selectedOption.forEach((val) => {
      if (val.categoryName == Object.values(result)[0]) {
        val.elements = result.elements
        flag = false
      }
    })
    if (flag) {
      this.selectedOption.push(result)
    }

  }

  selectChange(event: any) {
    this.add.category = event.value
  }

}

export interface SelectedItems {
  categoryName: string,
  elements: Array<Element>
}

export interface Element {
  name: string,
  price: number
}
