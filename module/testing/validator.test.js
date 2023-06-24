import validation from "../user-properties-change/validation";

test('Testing validation functions', () => {
  let data = [
    {
      expects: new Date(2050, 9, 12),
      equals: new Error('Invalid birth date')
    },
    {
      expects: new Date(2023, 9, 12),
      equals: new Error('Invalid birth date')
    },
    {
      expects: new Date(2023, 6, 15),
      equals: new Error('Invalid birth date')
    },
    {
      expects: 'some string data',
      equals: new Error('Invalid date format')
    },
    {
      expects: 908908098098,
      equals: new Error('Invalid date format')
    },
  ];
  for(let value of data) {
    expect(() => {validation.validateBirthDate(value.expects)}).toThrow(value.equals);
  }
})