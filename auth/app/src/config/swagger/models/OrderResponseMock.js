const OrderResponseMock = {
  _id: '65284455347fddffcc3bfb97',
  username: 'walter',
  state: 'waiting_rider',
  bill: 18,
  order: [
    {
      categoryName: 'Pasta',
      elements: [
        {
          name: ' Risotto alla milanese',
          price: '€ 12',
          _id: '65284456347fddffcc3bfb99'
        }
      ],
      _id: '65284456347fddffcc3bfb98'
    }
  ],
  customerPosition: {
    _latitude: 44.142268,
    _longitude: 12.249141,
    _id: '65284456347fddffcc3bfb9b'
  },
  time: '2023-10-12T19:09:10.006+0000',
  restaurantPosition: {
    _latitude: 44.142268,
    _longitude: 12.249141,
    _id: '6528445f347fddffcc3bfbc3'
  }
}

module.exports = OrderResponseMock
