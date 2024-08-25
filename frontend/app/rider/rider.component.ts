import {Component, OnInit} from '@angular/core';
import {Coordinate} from "../assets/coordinate";
import {AuthenticationService} from "../authentication.service";
import {io} from "socket.io-client";
import {HttpService} from "../http.service";

@Component({
  selector: 'app-rider',
  templateUrl: './rider.component.html',
  styleUrls: ['./rider.component.css']
})
export class RiderComponent implements OnInit {

  coordinates!: Coordinate

  destinationCoordinate!: Coordinate

  socket!: any;

  orders: any = [];

  intervalId: any

  username!: string

  userInfo: any

  onTravel!: boolean

  currentOrder: any = []

  rider: string = 'rider'

  constructor(private auth: AuthenticationService, private httpService: HttpService) {
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.coordinates = new Coordinate(
        position.coords.latitude,
        position.coords.longitude
      );
    });
    // @ts-ignore
    this.username = localStorage.getItem('username');
    this.httpService.getUserInfo(this.username).subscribe(userInfo => {
      this.userInfo = userInfo
      if (this.userInfo.working) {
        this.initializeSocket()
      }
    })
  }

  logout() {
    this.auth.logoutService();
  }

  acceptOrder(order: any) {
    this.onTravel = true
    order.state = 'confirmed'
    this.currentOrder = order
    this.httpService.updateOrder(order).subscribe()
    this.destinationCoordinate = new Coordinate(order.restaurantPosition._latitude, order.restaurantPosition._longitude)
    this.shareLocation(order._id)
    this.socket.emit('riderAcceptedOrder')
    this.userInfo.credit += (order.bill * 0.3)
    this.httpService.updateCredit(this.userInfo).subscribe(() => window.location.reload())
  }

  declineOrder(order: any) {
    // @ts-ignore
    this.orders = this.orders.filter(item => item._id != order._id)

    this.socket.emit('refuse', order)

  }

  shareLocation(id: string) {
    // @ts-ignore
    this.intervalId = setInterval(() => {
      this.socket.emit('sharelocation', {id: id, coordinates: this.coordinates})
    }, 2000)
  }

  confirmPickup() {
    this.destinationCoordinate = this.currentOrder.customerPosition
    this.currentOrder.state = "delivering"

    this.httpService.updateOrder(this.currentOrder).subscribe()
    window.location.reload()
  }

  confirmDelivered() {
    this.currentOrder.state = "completed"
    this.onTravel = false
    clearInterval(this.intervalId)
    this.httpService.updateOrder(this.currentOrder).subscribe()
    this.socket.emit('orderCompleted', this.currentOrder._id)
    window.location.reload()
  }

  work(newValue: any) {
    this.userInfo.working = newValue
    this.httpService.updateUserInfo(this.userInfo).subscribe(res => {
      console.log(res)
    })
    newValue ? this.socket = io("http://localhost:4000/rider", {
      auth: {
        token: localStorage.getItem('token'),
      }
    }) : this.socket.disconnect()
  }

  initializeSocket() {
    this.socket = io("http://localhost:4000/rider", {
      auth: {
        token: localStorage.getItem('token'),
      }
    });
    // @ts-ignore
    this.socket.on('newOrder', (order) => {
      this.orders.unshift(order)
    })

    // @ts-ignore
    this.socket.on('pendingOrder', (orderId) => {

      if (orderId) {
        this.httpService.getOrderById(orderId).subscribe((pendingOrder: any) => {

          if (pendingOrder[0].state != 'waiting_rider') {

            // @ts-ignore
            this.currentOrder = pendingOrder[0]
            this.onTravel = true
            if (pendingOrder[0].state == 'confirmed') {
              this.destinationCoordinate = new Coordinate(this.currentOrder.restaurantPosition._latitude, this.currentOrder.restaurantPosition._longitude)
            } else if (pendingOrder[0].state == 'delivering') {
              this.destinationCoordinate = new Coordinate(this.currentOrder.customerPosition._latitude, this.currentOrder.customerPosition._longitude)
              this.shareLocation(pendingOrder[0]._id)
            }
          } else {
            // @ts-ignore
            this.orders.unshift(pendingOrder[0])
          }
        })
      }
    })
  }
}


