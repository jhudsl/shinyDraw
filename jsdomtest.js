const {JSDOM} = require('jsdom');
// const {GetContainerSize} = require('./src/GetContainerSize');
const d3 = require('d3');

const dom = new JSDOM(
  ``,
  {includeNodeLocations: true}
);

let document = dom.window.document;
d3.select = d3.select(document);

// Setup DOM
d3.select('body').append('div').attr('id', 'viz');

// const selection = body.select('#viz');

console.log(body.html());
