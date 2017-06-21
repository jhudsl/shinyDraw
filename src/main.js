const d3 = require('d3');

const {
  simplifyData,
  appendSVG,
  makeScales,
  makeLine,
  makeClip,
  testImport,
  drawAxes,
  dragCanvas,
  makeUserData,
  clamp,
  addToClosest
} = require('./helpers');

var data = [
  {"year": 2001, "debt": 31.4},
  {"year": 2002, "debt": 32.6},
  {"year": 2003, "debt": 34.5},
  {"year": 2004, "debt": 35.5},
  {"year": 2005, "debt": 35.6},
  {"year": 2006, "debt": 35.3},
  {"year": 2007, "debt": 35.2},
  {"year": 2008, "debt": 39.3},
  {"year": 2009, "debt": 52.3},
  {"year": 2010, "debt": 60.9},
  {"year": 2011, "debt": 65.9},
  {"year": 2012, "debt": 70.4},
  {"year": 2013, "debt": 72.6},
  {"year": 2014, "debt": 74.4},
  {"year": 2015, "debt": 73.6},
]

const params = {
  data: data,
  dom_target: "#viz",
  x_key: "year",
  y_key: "debt",
  y_max: 80,
  draw_start: 2008 //currently pins drawn line to this point but let's users line start one unit beyond. May need to be more flexible.
}

class drawIt{
  constructor(params){
    const {
      data: fullData,
      dom_target,
      x_key,
      y_key,
      y_max,
      draw_start,
      total_height = 400,
    } = params;

    const sel  = d3.select(dom_target).html(''),
      data     = simplifyData({fullData, x_key, y_key}),
      margin   = {left: 50, right: 50, top: 30, bottom: 30},
      width    = sel.node().offsetWidth - margin.left - margin.right,
      height   = total_height - margin.top - margin.bottom,
      svg      = appendSVG({sel, height, width, margin}),
      scales   = makeScales({data, y_max,height, width, margin}),
      line     = makeLine({scales}),
      clipRect = makeClip({svg, scales, draw_start, height});

    //user's drawn data
    const userLine = svg
      .append('path')
      .style("stroke", "#f0f")
      .style("stroke-width", 3)
      .style("stroke-dasharray", "5 5")

    let usersData = makeUserData({data, draw_start});

    //background for d3 drag to work on.
    const background = dragCanvas({svg, width,height});

    const trueLine = svg
      .append('g')
      .attr('clip-path', 'url(#clip)');

    //The data's true line.
    trueLine
      .append('path')
      .attr("d", line(data))
      .style("stroke", "black")
      .style("stroke-width", 3)
      .style("fill", "none");

    //plot the axes
    drawAxes({svg, scales, height})

    //define the logic on user drag on the chart.
    const makeDragger = ({scales,draw_start}) => d3.drag()
      .on('drag', function(){
        const pos   = d3.mouse(this);
        const x_max = scales.x.domain()[1];
        //have to start user defined drawing one point after drawstart so that line is connected.
        const start_index = usersData.map(d=>d.x).indexOf(draw_start) + 1;
        const start_x = usersData[start_index].x;

        //append drag point to closest point on x axis in the in data.
        addToClosest({
          usersData,
          x_pos: clamp(start_x, x_max, scales.x.invert(pos[0])),
          y_pos: clamp(0, scales.y.domain()[1], scales.y.invert(pos[1]))
        })

        //update the user's drawn line with the new data.
        userLine.attr('d', line.defined(d => d.defined)(usersData))

        //if we've drawn for all the hidden datapoints, reveal them.
        if (d3.mean(usersData, d => d.defined) === 1){
          clipRect.transition().duration(1000).attr('width', scales.x(x_max))
        }
      })
      .on('end',function(){
        console.log("The user dragged these values. Sending to shiny")
        console.table(usersData)
      })

    const dragger  = makeDragger({scales,draw_start});
    svg.call(dragger)
  }
}

const ourChart = new drawIt(params);
