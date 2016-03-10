// first, initialize the variables that are independent of the data
var margin = { top: 30, right: 10, bottom: 30, left: 30 },
    width = 1000 - margin.left - margin.right,
    gridSize = Math.floor(width / 54),
    height = (gridSize * 10) - margin.top - margin.bottom,
    legendElementWidth = gridSize * 3,

    days = ["S", "M", "T", "W", "T", "F", "S"],
    values = ['coffee', 'water'],
    colors = ["522F1D", "97E6F7"],
    dataArray,
    dataLength;

var weekNow = moment(new Date()).week();
var weeksInYear = 53;
var weeks = [];

var svg = d3.select("#chart").append("svg") // attach chart to the DOM and center it within an svg element based on margins
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g") // an svg "group", similar to an html "div"
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var colorScale = d3.scale.ordinal() // map array of values to array of colors
  .domain(values) // move this inside of data callback and change this to newValues if you use option code to generate domain from the data
  .range(colors);

var xscale = d3.scale.ordinal()
  .domain(d3.range(-53, 1))
  .rangePoints([0, width], 1);

var yscale = d3.scale.ordinal()
  .domain(d3.range(0,7))
  .rangePoints([0, height], 1);

  var generateXaxis = function () {
      for (var i = 0; i < weeksInYear; i++) {
        var month = moment((((weekNow - i) + weeksInYear) % weeksInYear) , 'w').format('MMM');
        if (temp === month || i === 0) {
          weeks.push("");
        } else {
          weeks.push(month);
        }
        var temp = month;
      }
  }

  generateXaxis()

  var weekLabels = svg.selectAll(".week") // add week labels
      .data(weeks)
      .enter().append("text")
        .text(function(d) {return d; })
        .attr("x", function(d, i) {
          return xscale( -(i + 1) ); })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        .attr("class", "label");

  var dayLabels = svg.selectAll(".day") // add day labels
      .data(days)
      .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * gridSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.3 + ")")
        .attr("class", "label");


d3.json("coffee-data.json", function(error, json) {
  if (error) return console.warn(error);
  dataArray = json;
  dataLength = dataArray.length;

  nio.source.generate(function(iter) {
    return dataArray[iter]}
    , dataLength, 1).pipe(nio.filter(function(chunk) {
      return chunk.name === 'jenny'
  })).pipe(nio.func( function (d) {

    d.day = moment(d.date, "MM DD YYYY").day()
    d.week = moment(d.date, "MM DD YYYY").week()
    d.month = moment(d.date, "MM DD YYYY").month()
    d.weekNow = moment().week()
    d.weeksAgo = d.weekNow - d.week

    var heatMap = svg
      .append("rect")
      .datum(d)
      .attr("width", gridSize)
      .attr("height", gridSize)
      .attr("x", function(d) { return xscale( - d.weeksAgo); })
      .attr("y", function(d) { return yscale(d.day); })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", "bordered")
      .style("fill", function(d) { return colorScale(d.beverage)}) // use this line if you are not using the transition() to a new color
      // .style("transform", "translate("+(-gridSize/2)+", "+(-gridSize/2)+")")
      .style("fill-opacity", "50%");
  }));
});
