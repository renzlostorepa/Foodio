import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {HttpService} from "../http.service";
import {MatDialog} from "@angular/material/dialog";
import {MenuComponent} from "../menu/menu.component";
import {io} from "socket.io-client";
import {Coordinate} from "../assets/coordinate";


@Component({
  selector: 'app-ristoratore',
  templateUrl: './ristoratore.component.html',
  styleUrls: ['./ristoratore.component.css'],
})
export class RistoratoreComponent implements OnInit {
  showMenu!: boolean;
  username!: string;
  shop!: any;
  socket: any;
  orders: any;
  userInfo: any;
  coordinates!: Coordinate

  constructor(private auth: AuthenticationService,
              private httpService: HttpService,
              private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {

    // @ts-ignore
    this.username = localStorage.getItem('username');
    this.httpService.getUserInfo(this.username).subscribe((userInfo: any) => {
      this.userInfo = userInfo
      this.coordinates = new Coordinate(userInfo.geolocation.coordinates[1], userInfo.geolocation.coordinates[0])
    })
    this.httpService.getMenu(this.username).subscribe(res => {
        this.shop = res
        this.showMenu = res.working
      }
    );
    this.httpService.getOrders(this.username).subscribe(res => {
      this.orders = res
    })
    this.socket = io("http://localhost:4000/restaurant", {auth: {token: localStorage.getItem('token')}});

    this.socket.emit('user', this.username)
    // @ts-ignore

    this.socket.on('order', (order) => {
      this.orders.unshift(order)
    })


  }

  ngOnDestroy() {
    this.socket.disconnect()
  }

  openDialog() {
    let dialogRef

    dialogRef = this.dialog.open(MenuComponent, {width: '270px', data: {owner: true, add: true, shop: this.shop.menu}});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // @ts-ignore
        if (result.role === "Category") {
          this.shop.menu.push({category: result.name, elements: []})
        } else {
          // @ts-ignore
          this.shop.menu.forEach(el => {
            if (el.category === result.category) {
              el.elements.push({name: result.name, price: result.price})
            }
          })
        }
        this.httpService.updateMenu(this.username, this.shop).subscribe()
      }
    })
  }

  delete(element: any, type: string) {
    if (type == 'element') {
      // @ts-ignore
      this.shop.menu.forEach(cat => {

        // @ts-ignore
        cat.elements = cat.elements.filter(el => el._id !== element._id)

      })
    } else {
      // @ts-ignore
      this.shop.menu = this.shop.menu.filter(el => el._id !== element._id)
    }
    this.httpService.updateMenu(this.username, this.shop).subscribe(res => {
      console.log(res)
    })
  }

  update(element: any) {
    let dialogRef = this.dialog.open(MenuComponent, {width: '270px', data: {shop: element, owner: true}})
    dialogRef.afterClosed().subscribe((updatedItem) => {
      if (updatedItem) {
        // @ts-ignore
        this.shop.menu.forEach(cat => {

          // @ts-ignore
          cat.elements = cat.elements.map(item => {
            return (item._id === element._id ? updatedItem : item)
          })
        })
        this.httpService.updateMenu(this.username, this.shop).subscribe()
      }
    })

  }

  logout() {
    this.auth.logoutService()
  }

  stampa(order: any) {
    order.state = 'waiting_rider'
    order.restaurantPosition = this.coordinates
    this.httpService.updateOrder(order).subscribe((updatedOrder) => {
      this.socket.emit('orderAccepted', updatedOrder)
    })
    this.userInfo.credit += order.bill * 0.7
    this.httpService.updateCredit(this.userInfo).subscribe(() => window.location.reload())
  }

  acceptOrder(order: any) {
    order.state = 'waiting_rider'
    order.restaurantPosition = this.coordinates
    this.httpService.updateOrder(order).subscribe((updatedOrder) => {
      this.socket.emit('orderAccepted', updatedOrder)
    })
    this.userInfo.credit += order.bill * 0.7
    this.httpService.updateCredit(this.userInfo).subscribe()
    window.location.reload()
  }

  declineOrder(order: any) {
    this.httpService.deleteOrder(order).subscribe()
    this.socket.emit('orderDeclined', order)
    window.location.reload()
  }

  show(newValue: any) {
    this.shop.working = newValue
    this.httpService.updateMenu(this.username, this.shop).subscribe(res => {
      console.log(res)
    })
  }
}
