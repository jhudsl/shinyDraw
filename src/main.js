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
  addToClosest,
  drawStartValue
} = require('./helpers');

class drawIt{
  constructor(params){
    const {
      data: fullData,
      dom_target,
      x_key,
      y_key,
      y_domain,
      reveal_extent,
      total_height = 400,
      raw_draw = false, //does the user want to just draw with no data to show?
      on_done_drawing = ( d => console.table(d) )
    } = params;

    console.log("THis is working!");
    
    const sel       = d3.select(dom_target).html(''),
      data          = simplifyData({fullData, x_key, y_key}),
      margin        = {left: 50, right: 50, top: 30, bottom: 30},
      width         = sel.node().offsetWidth - margin.left - margin.right,
      height        = total_height - margin.top - margin.bottom,
      svg           = appendSVG({sel, height, width, margin}),
      [y_min,y_max] = y_domain,
      scales        = makeScales({data, y_domain, height, width, margin}),
      x_max         = scales.x.domain()[1],
      line          = makeLine({scales}),
      clipRect      = makeClip({svg, scales, reveal_extent, height});

    //user's drawn data
    const userLine = svg
      .append('path')
      .style("stroke", "steelblue")
      .style("stroke-width", 3)
      .style("stroke-dasharray", "5 5")

    let usersData = makeUserData({data, reveal_extent});

    //background for d3 drag to work on.
    const background = dragCanvas({svg, width,height});

    const trueLine = svg
        .append('g')
        .attr('clip-path', 'url(#clip)');

    if(!raw_draw){
      //Draw the data's true line.
      trueLine
        .append('path')
        .attr("d", line(data))
        .style("stroke", "black")
        .style("stroke-width", 3)
        .style("fill", "none");
    }

    //plot the axes
    drawAxes({svg, scales, height})

    //define the logic on user drag on the chart.
    
    const makeDragger = ({scales, reveal_extent, raw_draw}) => d3.drag()
      .on('drag', function(){

        const pos = d3.mouse(this);          //current drag position
        const drawStart = drawStartValue({   //find the x value that we can start appending values at.
          usersData,
          reveal_extent,
          raw_draw
        });

        //append drag point to closest point on x axis in the in data.
        addToClosest({
          usersData,
          x_pos: clamp(drawStart, x_max, scales.x.invert(pos[0])),
          y_pos: clamp(    y_min, y_max, scales.y.invert(pos[1]))
        })

        //update the user's drawn line with the new data.
        userLine.attr('d', line.defined(d => d.defined)(usersData))

        //if we've drawn for all the hidden datapoints, reveal them.
        if (d3.mean(usersData, d => d.defined) === 1 && !this.raw_draw){
          clipRect.transition().duration(1000).attr('width', scales.x(x_max))
        }
      })
      .on('end',function(){
        on_done_drawing(usersData);
      })

    const dragger  = makeDragger({scales,reveal_extent, raw_draw});
    svg.call(dragger)
  }
}

module.exports = drawIt;
// const ourChart = new drawIt(params);
