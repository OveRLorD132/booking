import Complains from "../../db/postgres/Complains.js";

let complains = new Complains();

test('Testing complains db module', async () => {
  await expect(complains.deleteComplain(5)).resolves.toBe(1);
})