import {AfterViewInit, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Coordinate} from '../assets/coordinate';
import * as L from "leaflet";
import 'leaflet-defaulticon-compatibility';
import 'leaflet-routing-machine'


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() coordinates!: Coordinate;
  @Input() destLocation!: Coordinate;
  @Input() onTravel!: boolean
  @Input() restaurantGeolocations!: any
  @Input() type!: string
  riderMarker!: any
  markerIconRestaurant = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png"
    })
  };
  markerIconUser = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    })
  };
  markerIconRider = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    })
  };
  private map: any;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.initMap();

  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName === 'destLocation') {
        this.destLocation.latitude = changes['destLocation'].currentValue.latitude
        this.destLocation.longitude = changes['destLocation'].currentValue.longitude
        if (this.riderMarker === undefined) {
          this.riderMarker = L.marker([this.destLocation.latitude, this.destLocation.longitude], this.markerIconRider).bindPopup("<b> Rider is here!</b>")
          this.addPopup(this.riderMarker)
          this.riderMarker.addTo(this.map)
        } else {
          var newLatLng = new L.LatLng(this.destLocation.latitude, this.destLocation.longitude);
          this.riderMarker.setLatLng(newLatLng)
        }
      }
      if (propName === 'restaurantGeolocations') {
        if (!this.onTravel) {
          this.initializeRestaurantLocation()
        }
      }
    }
  }

  initializeRestaurantLocation() {
    this.restaurantGeolocations.forEach((geo: any) => {
      //@ts-ignore
      const restaurant = L.marker([geo.geolocation._latitude, geo.geolocation._longitude], this.markerIconRestaurant)
      restaurant.bindPopup("<b>" + geo.name + "</b>")
      this.addPopup(restaurant)
      restaurant.addTo(this.map)
    })
  }

  addPopup(restaurant: any) {
    restaurant.on({
      mouseover: function () {
        this.openPopup();
      },
      mouseout: function () {
        this.closePopup();
      }
    });
  }

  private initMap(): void {
    this.map = L.map('map').setView(
      [this.coordinates.latitude, this.coordinates.longitude],
      15
    );

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    if (this.type === 'customer') {
      const customer = L.marker([this.coordinates.latitude, this.coordinates.longitude], this.markerIconUser)
      customer.bindPopup("<b>Delivery will be made here</b><br> Make sure that the address is right!")
      this.addPopup(customer)
      customer.addTo(this.map)
    } else {
      const rider = L.marker([this.coordinates.latitude, this.coordinates.longitude], this.markerIconUser)
      rider.bindPopup("<b>You are here</b><br>Customers are able to see your current position")
      this.addPopup(rider)
      rider.addTo(this.map)
    }

    if (this.onTravel && this.type === 'rider') {

      L.Routing.control({
        waypoints: [
          L.latLng(this.coordinates.latitude, this.coordinates.longitude),
          L.latLng(this.destLocation.latitude, this.destLocation.longitude)
        ]
      }).addTo(this.map);

      const restaurant = L.marker([this.destLocation.latitude, this.destLocation.longitude], this.markerIconRestaurant).bindPopup("<b>Complete the order!</b>")
      this.addPopup(restaurant)
      restaurant.addTo(this.map)

    }
  }

}
