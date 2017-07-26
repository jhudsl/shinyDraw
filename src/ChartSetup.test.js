const d3 = require('d3');
const test = require('tape');
const {ChartSetup} = require('./ChartSetup');

test('ChartSetup works properly', (t) => {
  // append a div with id of viz for function to target
  d3.select('body').append('div').attr('id', 'viz');

  const myChart = ChartSetup({
    domTarget: '#viz',
    width: 200,
    height: 250,
    xDomain: [0, 100],
    yDomain: [100, 200],
  });

  const svg = d3.select('#viz').select('svg');

  t.deepEqual(
    Object.keys(myChart),
    ['svg', 'xScale', 'yScale', 'resize'],
    'returns the values and methods we expect.'
  );
  t.equal(+svg.attr('height'), 250, 'Svg is correct height');
  t.equal(+svg.attr('width'), 200, 'Svg is correct width');
  t.deepEqual(myChart.xScale.domain(), [0, 100], 'xScale domain is correct');
  t.deepEqual(
    myChart.xScale.range(),
    [0, 200],
    'xScale original range is correct'
  );
  t.deepEqual(myChart.yScale.domain(), [100, 200], 'yScale domain is correct');
  t.deepEqual(
    myChart.yScale.range(),
    [250, 0],
    'yScale original range is correct'
  );

  // resize chart
  myChart.resize(400, 500);
  t.equal(+svg.attr('height'), 400, 'new svg height correct');
  t.equal(+svg.attr('width'), 500, 'new svg width is correct');
  t.deepEqual(myChart.xScale.range(), [0, 500], 'new xScale range is correct');
  t.deepEqual(myChart.yScale.range(), [400, 0], 'new yScale range is correct');

  t.end();
});
