const d3 = require('d3');
const {ChartSetup} = require('./ChartSetup');
const {SimplifyData} = require('./SimplifyData');
const MakeDrawnData = require('./MakeDrawnData');

/**
 * Creates a simple drawer d3 chart. 
 * @param {Object} config - Object containing info about your environment/ data.
 * @param {Object[]} config.data - data to be plotted: array of objects
 * @param {string} config.domTarget - name (with # prefix) of the div you're chart is going in
 * @param {number} [config.revealExtent = null] - Point at which we start keeping data x >= revealExtent.
 * @param {number} [config.height = 400] - height in pixels of viz
 * @param {number} [config.width = 400] - width in pixels of viz
 * @param {string} [drawLineColor = 'steelblue'] - valid css color for the user drawn line. 
 * @param 
 */
function drawr(config) {
  const {
    domTarget,
    data: originalData,
    revealExtent = null,
    height: chartHeight = 400,
    width: chartWidth = 400,
    margin = {left: 50, right: 50, top: 50, bottom: 50},
    drawLineColor = 'steelblue',
  } = config;

  const data = SimplifyData(originalData, 'year', 'debt');
  const xDomain = d3.extent(data, (d) => d.x);
  const yDomain = d3.extent(data, (d) => d.y);
  const {svg, xScale, yScale, resize, width, height} = ChartSetup({
    domTarget,
    width: chartWidth,
    height: chartHeight,
    xDomain,
    yDomain,
    margin,
  });

  // set up environment for the drawn line to sit in.
  const userLine = svg
    .append('path')
    .attr('class', 'user_line')
    .style('stroke', drawLineColor)
    .style('stroke-width', 3)
    .style('stroke-dasharray', '5 5');

  const usersData = MakeDrawnData({data, revealExtent});

  // Make invisible rectangle over whole viz for the d3 drag behavior to watch
  const dragCanvas = svg
    .append('rect')
    .attr('class', 'drag_canvas')
    .attr('width', chartWidth)
    .attr('height', chartHeight)
    .attr('opacity', 0);

    console.log('reveal extent pixel location', xScale(revealExtent))
  // set up a clipping rectangle for the viz
  const clipRect = svg
    .append('clipPath')
    .attr('id', `${domTarget}_clipper`) // need unique clip id or we get colisions between multiple drawrs.
    // .append('rect')
    //   .attr('width', xScale(revealExtent))
    //   .attr('height', height);
}

module.exports = drawr;
