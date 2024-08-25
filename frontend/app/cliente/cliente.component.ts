import {Component, type OnInit} from '@angular/core';
import {Coordinate} from '../assets/coordinate';
import {AuthenticationService} from "../authentication.service";
import {io} from "socket.io-client";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpService} from "../http.service";

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  coordinates!: Coordinate
  socket: any
  pendingOrder!: boolean
  order: any
  riderLocation!: Coordinate
  username!: string
  userInfo: any
  onTravel!: boolean
  restaurantGeolocations: any
  customer: string = 'customer'

  constructor(private auth: AuthenticationService, private router: Router, private snackBar: MatSnackBar, private httpService: HttpService) {

  }

  ngOnInit(): void {
    // @ts-ignore
    this.username = localStorage.getItem('username');
    this.httpService.getUserInfo(this.username).subscribe((userInfo: any) => {
      this.userInfo = userInfo
      this.coordinates = new Coordinate(userInfo.geolocation.coordinates[1], userInfo.geolocation.coordinates[0])
    })

    this.socket = io("http://localhost:4000/customer", {auth: {token: localStorage.getItem('token')}});

    // @ts-ignore
    this.socket.on('pending_order', order => {
      // @ts-ignore
      this.pendingOrder = true
      this.order = order
      this.openSnack("Order submitted")
    })


    // @ts-ignore
    this.socket.on('orderDeclined', (message) => {

      this.userInfo.credit += this.order.bill

      this.httpService.updateCredit(this.userInfo).subscribe(res => console.log(res))
      this.pendingOrder = false
      this.order = null
      this.openSnack(message)
    })


    // @ts-ignore
    this.socket.on('rider_location', riderCoordinate => {
      this.onTravel = true
      this.riderLocation = new Coordinate(riderCoordinate._latitude, riderCoordinate._longitude)
    })
    this.socket.on('orderCompleted', () => this.openSnack("Order completed"))
  }


  logout() {
    this.auth.logoutService();
  }

  openSnack(message: string) {

    this.snackBar.open(message, "Ok")

  }

  initializeRestaurantLocation(geoLocation: any) {
    this.restaurantGeolocations = geoLocation
  }

}
