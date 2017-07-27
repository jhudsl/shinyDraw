const d3 = require('d3');
const {ChartSetup} = require('./ChartSetup');
const {SimplifyData} = require('./SimplifyData');
const MakeDrawnData = require('./MakeDrawnData');
const MakeDragger = require('./MakeDragger');
const AddDrawnData = require('./AddDrawnData');

/**
 * Creates a simple drawer d3 chart. 
 * @param {Object} config - Object containing info about your environment/ data.
 * @param {Object[]} config.data - data to be plotted: array of objects
 * @param {string} config.domTarget - name (with # prefix) of the div you're chart is going in
 * @param {boolean} config.freeDraw - Are we just using this as a drawer and no reveal?
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
    freeDraw = false,
    height: chartHeight = 400,
    width: chartWidth = 400,
    margin = {left: 50, right: 50, top: 50, bottom: 50},
    drawLineColor = 'steelblue',
  } = config;

  let {revealExtent = null} = config;

  let clipRect; // Define the clip rectangle holder so it isn't hidden in the if freeDraw scope.
  let allDrawn; // Boolean recording if we've drawn all the values already. Used to trigger reveal animation.

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

  // If we have a freedraw chart we need to make sure the reveal extent is beyond the min of the x axis
  if (freeDraw) {
    revealExtent = xDomain[0] - 1;
  }

  const lineGenerator = d3.area().x((d) => xScale(d.x)).y((d) => yScale(d.y));

  // set up environment for the drawn line to sit in.
  const userLine = svg
    .append('path')
    .attr('class', 'user_line')
    .style('stroke', drawLineColor)
    .style('stroke-width', 3)
    .style('stroke-dasharray', '5 5');

  // Dont pin the first value to the existing y data unless the user has selected freedraw
  const drawDataConfig = {data, revealExtent, pinStart: !freeDraw};

  const userData = MakeDrawnData(drawDataConfig);

  // Make invisible rectangle over whole viz for the d3 drag behavior to watch
  const dragCanvas = svg
    .append('rect')
    .attr('class', 'drag_canvas')
    .attr('width', chartWidth)
    .attr('height', chartHeight)
    .attr('opacity', 0);

  // set up a clipping rectangle for the viz. Only needed if we're showing some data.
  if (!freeDraw && revealExtent) {
    clipRect = svg
      .append('clipPath')
      .attr('id', `${domTarget.replace('#', '')}_clipper`) // need unique clip id or we get colisions between multiple drawrs.
      .append('rect')
      .attr('width', xScale(revealExtent))
      .attr('height', chartHeight);

    // set up a holder to draw the true line with that is clipped by our clip rectangle we just made
    const dataLine = svg
      .append('g')
      .attr('class', 'data_line')
      .attr('clip-path', `url(${domTarget}_clipper)`)
      .append('path')
      .attr('d', lineGenerator(data))
      .style('stroke', 'black')
      .style('stroke-width', 3)
      .style('fill', 'none');
  }

  const onDrag = (xPos, yPos) => {
    // Update the drawn line with the latest position.
    AddDrawnData({userData, xPos, yPos, freeDraw});
    userLine.attr('d', lineGenerator.defined((d) => d.defined)(userData));

    // if we've drawn for all the hidden datapoints, reveal them.
    allDrawn = d3.mean(userData, (d) => d.defined) === 1;

    if (allDrawn && !freeDraw) {
      clipRect.transition().duration(1000).attr('width', xScale(xDomain[1]));
    }
  };

  const onDragEnd = () => {
    if (allDrawn) {
      console.table(userData);
    }
  };

  const dragger = MakeDragger({
    xScale,
    yScale,
    revealExtent,
    onDrag,
    onDragEnd,
  });

  svg.call(dragger);
}

module.exports = drawr;
