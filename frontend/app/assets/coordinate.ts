export class Coordinate {
  private _latitude: number;
  private _longitude: number;

  constructor(latitude: number, longitude: number) {
    this._latitude = latitude;
    this._longitude = longitude;
  }

  get latitude(): number {
    return this._latitude;
  }

  set latitude(value: number) {
    this._latitude = value;
  }

  get longitude(): number {
    return this._longitude;
  }

  set longitude(value: number) {
    this._longitude = value;
  }
}
