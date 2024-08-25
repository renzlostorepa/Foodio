const UserMock = {
  _id: '65184f457ad1f7c30cbe4333',
  role: 'RISTORATORE',
  username: 'walter',
  credit: 100,
  restaurant_name: 'Ostreghetteria',
  geolocation: {
    type: 'Point',
    coordinates: [
      12.249141,
      44.142268
    ],
    _id: '65184f457ad1f7c30cbe4334'
  },
  working: true,
  menu: [
    {
      category: 'Pasta',
      elements: [
        {
          name: 'Carbonara',
          price: 6,
          _id: '65184fed7ad1f7c30cbe439f'
        },
        {
          name: 'Risotto alla milanese',
          price: 12,
          _id: '65184fed7ad1f7c30cbe43a0'
        },
        {
          name: 'Cacio e pepe',
          price: 8,
          _id: '65184fed7ad1f7c30cbe43a1'
        }
      ],
      _id: '65184fed7ad1f7c30cbe439e'
    }
  ]
}

module.exports = UserMock
