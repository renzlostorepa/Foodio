import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {MatDialog} from "@angular/material/dialog";
import {Shop} from "../assets/models";
import {HttpService} from "../http.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Coordinate} from "../assets/coordinate";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {

  allShops!: Array<Shop>;
  @Input()
  userInfo!: any
  @Input()
  customerCoordinates!: Coordinate
  @Output()
  onLocations = new EventEmitter()

  constructor(private dialog: MatDialog, private httpService: HttpService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.httpService.getAllMenu(this.userInfo.geolocation.coordinates).subscribe(res => {
        this.allShops = res;
        this.onLocations.emit(res.map(val => {
          return {
            name: val.restaurant_name,
            geolocation: {_latitude: val.geolocation.coordinates[1], _longitude: val.geolocation.coordinates[0]}
          }
        }))
      }
    );
  }

  openDialog(shop: Shop) {
    // @ts-ignore
    const dialogRef = this.dialog.open(MenuComponent, {width: '600px', data: {shop}});
    dialogRef.afterClosed().subscribe(result => {
      let bill = this.calculateBill(result)
      let order = {
        restaurant_name: shop.restaurant_name,
        order: result,
        bill: bill,
        customerPosition: this.customerCoordinates
      }

      if (this.userInfo.credit >= order.bill) {
        this.httpService.sendOrder(order).subscribe((res) => {
          console.log(res)
        })
        this.userInfo.credit -= order.bill
        this.httpService.updateCredit(this.userInfo).subscribe(res => console.log(res))
      } else {
        this.snackBar.open("Unsufficient credit. Charge your funds.", "Ok")
      }
    });
  }

  calculateBill(order: any) {
    let bill = 0
    // @ts-ignore
    order.forEach((val) => {
      // @ts-ignore
      val.elements.forEach((res) => {
        bill += parseInt(res.price.replace(/[^0-9]/g, ''))
      })
    })
    return bill
  }

}
