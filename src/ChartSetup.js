const d3 = require('d3');

/**
 * A helper that gets passed some basic information about your chart, appends an svg and a centered g using margin conventions.
 * @param {Object} config - Object containing info about your environment/ data.
 * @param {string} config.domTarget - name (with # prefix) of the div you're chart is going in
 * @param {number} config.width - width in pixels of the svg for your chart
 * @param {number} config.height - height in pixels of the svg for your chart
 * @param {number[]} config.xDomain - minimum and maximum of your data's x value
 * @param {number[]} config.yDomain - minimum and maximum of your data's y value
 * @param {Object} config.margin - object declaring the margin conventions in left, right, top, bottom.
 * @param {number} config.margin.left - left padding.
 * @param {number} config.margin.right - right padding.
 * @param {number} config.margin.top - top padding.
 * @param {number} config.margin.bottom - bottom padding.
 * @param {boolean} config.drawAxes - do we desire to append axes for the chart?
 * @return {Object} returns scales for the x and y values and a resize option that updates the svg size and recalculates the scales.
 */
export function ChartSetup(config) {
  let {
    domTarget,
    width,
    height,
    xDomain,
    yDomain,
    margin = {left: 50, right: 50, top: 30, bottom: 30},
    drawAxes = true,
  } = config;

  // grab a d3 selection of the div we're going to be putting our chart in;
  const sel = d3.select(domTarget).html('');

  // append the svg to the div
  const svg = sel
    .append('svg')
    .attr('width', config.width)
    .attr('height', config.height);

  // append a g element shifted up by margins
  const svgG = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // initialize the scales to the supplied domains
  const xScale = d3.scaleLinear().domain(xDomain);
  const yScale = d3.scaleLinear().domain(yDomain);

  // set up axes if we have them.
  let xAxis;
  let yAxis;
  if (drawAxes) {
    xAxis = svgG.append('g').attr('class', 'x_axis');
    yAxis = svgG.append('g').attr('class', 'y_axis');
  }

  const resize = (newHeight, newWidth) => {
    // resize the svg
    svg.attr('width', newWidth).attr('height', newHeight);

    // set the scale ranges
    xScale.range([0, newWidth]);
    yScale.range([newHeight, 0]);

    // if applicable redraw the axes
    if (drawAxes) {
      xAxis
        .attr(
          'transform',
          `translate(0,${newHeight - margin.top - margin.bottom})`
        )
        .call(d3.axisBottom(xScale));

      yAxis.call(d3.axisLeft(yScale));
    }
  };

  // kick it off
  resize(height, width);

  return {
    svg: svgG,
    xScale,
    yScale,
    resize,
  };
}
