// first, initialize the variables that are independent of the data
var margin = { top: 30, right: 10, bottom: 30, left: 30 },
    width = 1000 - margin.left - margin.right,
    gridSize = Math.floor(width / 54),
    height = (gridSize * 10) - margin.top - margin.bottom,
    legendElementWidth = gridSize * 3,

    days = ["S", "M", "T", "W", "T", "F", "S"],
    weeks = ["", "J", "", "", "", "F", "", "", "", "M", "", "", "", "", "A", "", "", "", "M", "", "", "", "J", "", "", "", "", "J", "", "", "", "A", "", "", "", "S", "", "", "", "", "O", "", "", "", "N", "", "", "", "D", "", "", "", "" ],
    values = ['coffee', 'water'],
    colors = ["522F1D", "97E6F7"],
    dataArray,
    dataLength;

var svg = d3.select("#chart").append("svg") // attach chart to the DOM and center it within an svg element based on margins
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g") // an svg "group", similar to an html "div"
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var colorScale = d3.scale.ordinal() // map array of values to array of colors
  .domain(values) // move this inside of data callback and change this to newValues if you use option code to generate domain from the data
  .range(colors);

var xscale = d3.scale.ordinal()
  .domain(d3.range(-54, 0))
  .rangePoints([0, width], 1);

var yscale = d3.scale.ordinal()
  .domain(d3.range(0,7))
  .rangePoints([0, height], 1);

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
    console.log("date", d.date, "month", d.month, "weekNow", d.weekNow, "weeksAgo", d.weeksAgo);

    var heatMap = svg
      .append("rect")
      .datum(d)
      .attr("width", gridSize)
      .attr("height", gridSize)
      .attr("x", function(d) { return xscale( - d.weeksAgo); })
      .attr("y", function(d) { return yscale(d.day); })
      // .attr("rx", 4)
      // .attr("ry", 4)
      .style("fill", function(d) { return colorScale(d.beverage)}) // use this line if you are not using the transition() to a new color
      // .style("transform", "translate("+(-gridSize/2)+", "+(-gridSize/2)+")")
      .style("fill-opacity", "50%");
      // .style("fill", colors[0]); // use this line as a default OR if you are using the transition() to new color
  }));

  var weekLabels = svg.selectAll(".week") // add week labels
      .data()
      .enter().append("text")
        .text(function(d) { return d; })
        .attr("x", function(d, i) { return i * gridSize; })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        .attr("class", "label");

});

var dayLabels = svg.selectAll(".day") // add day labels
    .data(days)
    .enter().append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return i * gridSize; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.3 + ")")
      .attr("class", "label");




// nio.source.socketio(
//  "http://brand.nioinstances.com",
//  ["count_by_network"],
//  120 // optional - will immediately stream cached data within the last 120 seconds
// )
// .pipe(nio.filter(function(chunk) {
//    return chunk.type === "twitter";
// }))
// .pipe(nio.pass(function(chunk){
//   tweets.innerHTML = parseInt(chunk.count_per_sec, 10);
//   if (chunk.count_per_sec > max) {
//     max = chunk.count_per_sec;
//   }

// nio.source.generate(function(iter) {
//   return dataArray[iter]}
//   , dataLength, 500).pipe(nio.pass(function(chunk) {
//    console.log('nio generate: ', chunk);
// }));

// d3.tsv("coffee-data.tsv", // Data parsing! Your data here: ('path', callback(), callback())
//   function(d) { // in the first cb you construct your data object
//     console.log(d);
//     day = moment(d.date, "MM/DD/YYYY").day()
//     week = moment(d.date, "MM/DD/YYYY").week()
//     return {
//       date: d.date,
//       day: day,
//       week: week,
//       beverage: d.beverage
//     };
//   },
//   function(error, data) { // this callback is the meat of your graphic, data will be undefined outside of this function
//     if (error) {console.log(error);}

    // var newValues = [] // optional code to generate color domain from the data
    // // make an object first
    // var valueObj = data.reduce(function (obj, key) {
    //   obj[key.type] = 0
    //   return obj
    // }, {})
    // for (key in valueObj) {
    //   newValues.push(key)
    // }
    // newValues.sort()
    // console.log(newValues);


    // var heatMap = svg.selectAll(".grid") // make heatMap with data, data can be a hard coded array or an array of objects brought in through another file
    //     .data(data) // play with this, but later change this it to the data that is passed in on line 24
    //     .enter().append("rect")
    //       .attr("width", gridSize)
    //       .attr("height", gridSize)
    //       .attr("x", function(d) { return (d.week - 1) * gridSize; })
    //       .attr("y", function(d) { return (d.day - 1) * gridSize; })
    //       .attr("rx", 4)
    //       .attr("ry", 4)
    //       .attr("class", "bordered")
    //       .style("fill", function(d) { return colorScale(d.type);}) // use this line if you are not using the transition() to a new color
    //       // .style("fill", colors[0]); // use this line as a default OR if you are using the transition() to new color

    // heatMap.transition().duration(1000) // example d3 animation
    //     .style("fill", function(d) { return colorScale(d.type); })
    //     .style("fill-opacity", "20%");
    //
    // heatMap.append("title") // append and format title element
    //     .text(function(d) {
    //       var title = d.type + ' ' + d.date
    //       return title;
    //     });
    //
    // var legend = svg.selectAll(".legend") // create legend, legend data is the color domain
    //     .data(colorScale.domain(), function(d) { return d; }) // d is each element in the data
    //     .enter().append("g")
    //       .attr("class", "legend");
    //
    // legend.append("rect") // define legend rectangles
    //   .attr("x", function(d, i) { return legendElementWidth * i; })
    //   .attr("y", gridSize * 6)
    //   .attr("width", legendElementWidth)
    //   .attr("height", gridSize)
    //   .attr("class", "bordered")
    //   .attr("rx", 4)
    //   .attr("ry", 4)
    //   .style("fill", function(d, i) { return colors[i]; }) // map color domain array (d) to color range array
    //   .style("fill-opacity", "60%");
    //
    //
    // legend.append("text") // add legend text labels to same coordinates as legend rectangles, center
    //   .text(function(d) { return d; })
    //   .attr("x", function(d, i) { return (legendElementWidth * i) + legendElementWidth/2; })
    //   .attr("y", (gridSize * 6) + (gridSize/1.4))
    //   .attr("class", "label")
    //   .style("text-anchor", "middle");

// });
