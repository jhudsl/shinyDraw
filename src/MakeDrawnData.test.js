const test = require('tape');
const MakeDrawnData = require('./MakeDrawnData');

const data = [
  {x: 2001, y: 31.4},
  {x: 2002, y: 32.6},
  {x: 2003, y: 34.5},
  {x: 2004, y: 35.5},
  {x: 2005, y: 35.6},
  {x: 2006, y: 35.3},
  {x: 2007, y: 35.2},
  {x: 2008, y: 39.3},
  {x: 2009, y: 52.3},
  {x: 2010, y: 60.9},
  {x: 2011, y: 65.9},
  {x: 2012, y: 70.4},
  {x: 2013, y: 72.6},
  {x: 2014, y: 74.4},
  {x: 2015, y: 73.6},
];

test('test()', (t) => {
  t.deepEqual(
    MakeDrawnData({data, revealExtent: 2007, pinStart: true}),
    [
      {x: 2007, y: 35.2, defined: true},
      {x: 2008, y: 39.3, defined: false},
      {x: 2009, y: 52.3, defined: false},
      {x: 2010, y: 60.9, defined: false},
      {x: 2011, y: 65.9, defined: false},
      {x: 2012, y: 70.4, defined: false},
      {x: 2013, y: 72.6, defined: false},
      {x: 2014, y: 74.4, defined: false},
      {x: 2015, y: 73.6, defined: false},
    ],
    'Cuts away earlier data and pins first value.'
  );

  t.deepEqual(
    MakeDrawnData({data, revealExtent: 2007, pinStart: false}),
    [
      {x: 2007, y: 35.2, defined: false},
      {x: 2008, y: 39.3, defined: false},
      {x: 2009, y: 52.3, defined: false},
      {x: 2010, y: 60.9, defined: false},
      {x: 2011, y: 65.9, defined: false},
      {x: 2012, y: 70.4, defined: false},
      {x: 2013, y: 72.6, defined: false},
      {x: 2014, y: 74.4, defined: false},
      {x: 2015, y: 73.6, defined: false},
    ],
    'Cuts away earlier data and doesnt pin first value.'
  );
  t.end();
});
