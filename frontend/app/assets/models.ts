export interface Shop {
  restaurant_name: string,
  menu: [{
    category: string,
    elements: [{
      name: string,
      price: number
    }]
  }],
  geolocation: {
    type: string
    coordinates: [number, number]
  }
}
