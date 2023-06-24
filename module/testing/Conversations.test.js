import Conversations from "../db/postgres/Conversations.js";

let conversations = new Conversations();

test('Testing conversation check', async () => {
  expect(await conversations.checkConversation(120, 16)).toEqual(1);
})

// test('Testing converstion creation', async () => {
//   expect(await conversations.createConversation(120, 16)).toEqual('4')
// })

test('Testing conversations loading', () => {
  
})