import StaticPhotos from '../serve-static/rent-photos.js';

import __dirname from '../../dirname.js';

import path from 'path';

let dirname = path.resolve(__dirname, 'public', 'rent-photos')

let staticPhotos = new StaticPhotos();

test('Read photos', async () => {
  const data = [
    {
      expects: '167',
      equals: [
        path.resolve(dirname, '167', '0.png'),
        path.resolve(dirname, '167', '1.png'),
        path.resolve(dirname, '167', '2.png'),
        path.resolve(dirname, '167', '3.png'),
        path.resolve(dirname, '167', '4.png')
      ]
    },
    {
      expects: '168',
      equals: [
        path.resolve(dirname, '168', '0.png'),
        path.resolve(dirname, '168', '1.png'),
        path.resolve(dirname, '168', '2.png'),
        path.resolve(dirname, '168', '3.png'),
        path.resolve(dirname, '168', '4.png')
      ]
    },
    {
      expects: '169',
      equals: [
        path.resolve(dirname, '169', '0.png'),
        path.resolve(dirname, '169', '1.png'),
        path.resolve(dirname, '169', '2.png'),
        path.resolve(dirname, '169', '3.png'),
        path.resolve(dirname, '169', '4.png')
      ]
    },
  ]
  data.forEach(async (elem) => {
    expect(await staticPhotos.readAllPhotos(elem.expects)).toEqual(elem.equals)
  })
})

