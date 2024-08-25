import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Shop} from "./assets/models";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // @ts-ignore
  headers: HttpHeaders = new HttpHeaders().set('Authorization', localStorage.getItem('token'))
  private readonly BASE_URL = "http://localhost:4000";
  private readonly USER_URL = this.BASE_URL + "/users";
  private readonly SHOP_URL = this.BASE_URL + "/shops";
  private readonly ORDER_URL = this.BASE_URL + "/orders";

  constructor(private http: HttpClient) {
  }

  getAllMenu(coordinates: any) {
    let headers = this.headers
    let params = new HttpParams().set('lat', coordinates[1]).set('lon', coordinates[0])
    return this.http.get<Array<Shop>>(this.SHOP_URL, {params: params, headers: headers});
  }

  getMenu(username: string) {
    let headers = this.headers
    return this.http.get<any>(this.SHOP_URL + `/${username}`, {headers});
  }

  updateMenu(username: string, shop: any) {
    let headers = this.headers
    return this.http.put(this.SHOP_URL + `/${username}`, shop, {headers})
  }

  sendOrder(order: any) {
    let headers = this.headers
    return this.http.post(this.ORDER_URL, order, {headers})
  }

  getOrders(username: string) {
    let headers = this.headers
    return this.http.get(this.ORDER_URL + `/${username}`, {headers})
  }

  getOrderById(id: string) {
    let params = new HttpParams().set('id', id)
    return this.http.get(this.ORDER_URL, {params: params, headers: this.headers})
  }

  updateOrder(order: any) {
    let headers = this.headers
    let body
    order.restaurantPosition ? body = {
      state: order.state,
      restaurantPosition: order.restaurantPosition
    } : body = {state: order.state}
    return this.http.put(this.ORDER_URL + `/${order._id}`, body, {headers})
  }

  deleteOrder(order: any) {
    let headers = this.headers
    return this.http.delete(this.ORDER_URL + `/${order._id}`, {headers})
  }

  getUserInfo(username: string) {
    let headers = this.headers
    return this.http.get(this.USER_URL + `/${username}`, {headers})
  }

  updateCredit(userInfo: any) {
    let headers = this.headers
    return this.http.put(this.USER_URL + `/${userInfo.username}`, {credit: userInfo.credit}, {headers})
  }

  updateUserInfo(userInfo: any) {
    let headers = this.headers
    return this.http.put(this.USER_URL + `/${userInfo.username}`, {working: userInfo.working}, {headers})
  }
}
