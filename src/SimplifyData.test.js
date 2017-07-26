const {SimplifyData} = require('./SimplifyData');
const test = require('tape');

test('Simplify data simplifies', (t) => {
  // append a div with id of viz for function to target
  const fakeData = [
    {horse: 93, pig: 40, chicken: 40},
    {horse: 43, pig: 50, chicken: 20},
    {horse: 5, pig: 0, chicken: 90},
    {horse: 23, pig: 23, chicken: 3},
  ];

  t.deepEqual(
    SimplifyData(fakeData, 'horse', 'pig'),
    [
      {x: 93, y: 40, chicken: 40},
      {x: 43, y: 50, chicken: 20},
      {x: 5, y: 0, chicken: 90},
      {x: 23, y: 23, chicken: 3},
    ],
    'properly fixes data'
  );

  t.deepEqual(
    fakeData,
    [
      {horse: 93, pig: 40, chicken: 40},
      {horse: 43, pig: 50, chicken: 20},
      {horse: 5, pig: 0, chicken: 90},
      {horse: 23, pig: 23, chicken: 3},
    ],
    'didnt mutate original data'
  );

  t.end();
});
