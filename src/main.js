const d3 = require('d3');
const {ChartSetup} = require('./ChartSetup');
const {SimplifyData} = require('./SimplifyData');

/**
 * Creates a simple drawer d3 chart. 
 * @param {Object} config - Object containing info about your environment/ data.
 * @param {string} config.domTarget - name (with # prefix) of the div you're chart is going in
 */
function drawr(config) {
  const {domTarget, data: originalData} = config;

  const data = SimplifyData(originalData, 'year', 'debt');
  const xDomain = d3.extent(data, (d) => d.x);
  const yDomain = d3.extent(data, (d) => d.y);

  const chart = ChartSetup({
    domTarget,
    width: 200,
    height: 250,
    xDomain,
    yDomain,
  });
}

module.exports = drawr;
