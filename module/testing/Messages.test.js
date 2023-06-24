import Messages from "../db/postgres/Messages.js";

let messages = new Messages();

test('Testing messages add', async () => {
  expect(await messages.addMessage('hihihihihih', 16, 4)).toEqual('3');
})