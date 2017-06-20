const d3 = require('d3');

//changes from whatever key the user has for x and y to just x and why for simplification of future manipulation
const simplifyData = ({fullData, x_key, y_key}) => fullData
  .map(d => ( {x: d[x_key], y: d[y_key]} ));

const appendSVG = ({sel, height, width, margin}) => sel
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const makeScales = ({data, y_max, height, width}) => {
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d.y), y_max])
    .range([height, 0])

  return {x,y}
}

const drawAxes = ({svg, scales, height}) => {
  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(scales.x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(scales.y));
}

const makeLine = ({scales}) => d3.area()
  .x(d => scales.x(d.x))
  .y(d => scales.y(d.y));

const makeClip = ({svg, scales, draw_start, height}) => svg
  .append('clipPath')
  .attr("id", "clip")
  .append('rect')
    .attr("width", scales.x(draw_start) - 2)
    .attr("height", height);


const clamp = (a, b, c) => Math.max(a, Math.min(b, c))

const makeUserData = ({data, draw_start}) => data
  .map( d => ( {
    x: d.x,
    y: d.y,
    defined: d.x == draw_start
  } ) )
  .filter( d => d.x >= draw_start)

//append invisible rectangle covering plot so d3drag can see what's going on
const dragCanvas = ({svg, width, height}) => svg
  .append('rect')
  .attr("width", width)
  .attr("height", height)
  .attr("opacity", 0);

module.exports = {
  simplifyData,
  appendSVG,
  makeScales,
  makeLine,
  makeClip,
  drawAxes,
  makeUserData,
  dragCanvas,
  clamp
}
