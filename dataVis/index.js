//Chart 1

//hover labels for manufacturers
var full_name = {"K":"Kelloggs", "A":"American Home Food Products.", "N":"Nabisco", "G":"General Mills", "P":"Post", "Q":"Quaker Oats", "R":"Ralston Purina"}; 
// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = window.innerWidth/2 - margin.left - margin.right,
    height = window.innerHeight/1.5 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


 // Setup the tool tip.  Note that this is just one example, and that many styling options are available.
    // See original documentation for more details on styling: http://labratrevenge.com/d3-tip/
    var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) { return "Manufacturer- " + full_name[d.manufacturer_name] + ";" + " Total Sugar = " + d.sugars + "gm"; });
    svg.call(tool_tip);
    
// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis"); 

var xLabel = svg.append("text")
            .attr("x","50%")
            .attr("y", height+margin.bottom - 30)
            .attr("fill","black")
            .attr("stroke","black")
            .text("Manufacturers"); 

var yLabel = svg.append("text")
            .attr("transform", `translate(${-margin.left/2},${height/2}) rotate(-90)`)
            .attr("fill","black")
            .attr("stroke","black")
            .text("Sugars in Grams"); 

// A function that create / update the plot for a given variable:
function update() {

  // Parse the Data
  d3.csv("./data/cereal.csv", function(d){
    return {mfr:d.mfr, sugars:+d.sugars}
  }, function(data) {

    var all_manufacturers = [... new Set(data.map(x => x.mfr))]; 
    var all_obj = []; 
    

    all_manufacturers.forEach(mf => {
            var totalSugar = data.filter(d => d.mfr == mf).map(x => x.sugars).reduce((a,b) => a+b); 
            all_obj.push({"manufacturer_name":mf, "sugars":totalSugar}); 
    }); 


    // X axis
    x.domain(all_manufacturers)
    xAxis.transition().duration(1000).call(d3.axisBottom(x))

    // Add Y axis
    y.domain([0, d3.max(all_obj, function(d) { return d.sugars}) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // variable u: map data to existing bars
    var u = svg.selectAll("rect")
      .data(all_obj)

    // update bars
    u
      .enter()
      .append("rect")
      .on('mouseover', tool_tip.show)
      .on('mouseout', tool_tip.hide)
      .merge(u)
      .transition()
      .duration(1000)
        .attr("x", function(d) { return x(d.manufacturer_name); })
        .attr("y", function(d) { return y(d.sugars); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.sugars); })
        .attr("fill", "#5b8ba1")
    
  })

}

// Initialize plot
update();
