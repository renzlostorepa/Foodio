import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {lastValueFrom, type Observable} from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private readonly USER_URL = "http://localhost:4000/users";
  private readonly GEO_API = "https://api.geoapify.com/v1/geocode/search"
  private readonly API_KEY = "19209231415548aa834ece1ea5c6458a"

  constructor(private readonly http: HttpClient, private router: Router) {
  }

  loginService(
    role: string,
    username: string | null,
    password: string | null
  ): Observable<any> {
    return this.http.post<Response>(this.USER_URL + '/login', {
      role: role,
      username: username,
      password: password,
    });
  }

  logoutService() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['login'])
  }

  async signUp(user: any) {
    const addressForGeoCode = user.address + ", " + user.cap + ", " + user.city
    let params = new HttpParams().set('text', encodeURI(addressForGeoCode)).set('apiKey', this.API_KEY)

    return await lastValueFrom(this.http.get(this.GEO_API, {params})).then((res: any) => {
      user.geolocation = res.features[0].geometry
      delete user.address
      delete user.cap
      delete user.city
      
      return lastValueFrom(this.http.post(this.USER_URL + '/signup', {user}))
    })
  }
}


