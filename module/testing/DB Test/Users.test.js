import Users from "../../db/postgres/Users.js";

let users = new Users();

test('Testing property change', async () => {
  let data = [
    {
      expects: {
        property: 'username',
        value: 'over',
        id: 3
      },
      equals: 0
    },
    {
      expects: {
        property: 'username',
        value: 'overover',
        id: 4
      },
      equals: 0
    },
    {
      expects: {
        property: 'username',
        value: 'overover',
        id: 3
      },
      equals: 0
    },
    {
      expects: {
        property: 'username',
        value: 'Overlord',
        id: 4
      },
      equals: 0
    }
  ]
  for(let value of data) {
    expect(await users.changeUserProperty(value.expects.property, value.expects.value, value.expects.id)).toEqual(value.equals);
  }
})