import Rent from "../db/postgres/Rent.js";

let rent = new Rent();

test("Testing rent get", async () => {
  let data = [
    {
      expects: '166',
      equals: {
        type: 'Guesthouse',
        header: `Ontario Rental's Top`,
        user_id: '16'
      }
    },
    {
      expects: '167',
      equals: {
        type: 'Room',
        header: `Brooklyn Studio`,
        user_id: '16'
      }
    },
    {
      expects: '168',
      equals: {
        type: 'House',
        header: `Tiny Patio`,
        user_id: '16'
      }
    },
  ];
  for(let element of data) {
    expect(await rent.getRentById(element.expects)).toMatchObject(element.equals)
  };
})

test('Testing unique check', async () => {
  let data = [
    {
      expects: 'Overlord',
      equals: 1
    },
    {
      expects: 'over',
      equals: 1
    },
    {
      expects: 'overover',
      equals: 0
    },
    {
      expects: 'Overlord132',
      equals: 0
    },
  ];
  for(let value of data) {
    expect(await rent.checkUsernameUnique(value.expects)).toEqual(value.equals);
  };
})

test('Testing email unique check', async () => {
  let data = [
    {
      expects: 'jmullins1@ustream.tv',
      equals: 1,
    },
    {
      expects: 'pbrissenden0@cnn.com',
      equals: 1,
    },
    {
      expects: 'gudigudi@gmail.com',
      equals: 0,
    },
    {
      expects: 'overover@dog.com',
      equals: 1,
    }
  ];
  for(let elem of data) {
    expect(await rent.checkEmailUnique(elem.expects)).toEqual(elem.equals);
  }
})