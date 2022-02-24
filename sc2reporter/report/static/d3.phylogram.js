function  drawGraph(data){
  var svg = d3.select("svg"),
    width = +svg.node().getBoundingClientRect().width,
    height = +svg.node().getBoundingClientRect().height;

// svg objects
var link, node;
// the data - an object with nodes and links
var graph;





//////////// FORCE SIMULATION //////////// 

// force simulator
var simulation = d3.forceSimulation()

// set up the simulation and event to update locations after each tick
function initializeSimulation() {
  simulation.nodes(graph.nodes);
  initializeForces();
  simulation.on("tick", ticked);
}

// values for all forces
forceProperties = {
    center: {
        x: 0.5,
        y: 0.5
    },
    charge: {
        enabled: true,
        strength: -20,
        distanceMin: 1,
        distanceMax: 200
    },
    collide: {
        enabled: true,
        strength: .7,
        iterations: 1,
        radius: 5
    },
    forceX: {
        enabled: false,
        strength: .1,
        x: .5
    },
    forceY: {
        enabled: false,
        strength: .1,
        y: .5
    },
    link: {
        enabled: true,
        distance: 30,
        iterations: 10
    }
}

// add forces to the simulation
function initializeForces() {
    // add forces and associate each with a name
    simulation
        // .force("link", d3.forceLink().distance(function(d){return d.value;}))
        // .force("link", d3.forceLink().distance(function(d) {return d.value;}).strength(0.10))
        // .force("link", d3.forceLink().distance(function(d) {return d.distance;}).strength(1))
        .force("link", d3.forceLink().distance(function(d) {
            return d.value;
          }).strength(1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter())
        .force("forceX", d3.forceX());
    // apply properties to each of the forces
    updateForces();
}

// apply new force properties
function updateForces() {
    // get each force by name and update the properties
    simulation.force("center")
        .x(width * forceProperties.center.x)
        .y(height * forceProperties.center.y);
    simulation.force("charge")
        .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
        .distanceMin(forceProperties.charge.distanceMin)
        .distanceMax(forceProperties.charge.distanceMax);
    simulation.force("forceX")
        .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
        .x(width * forceProperties.forceX.x);
    simulation.force("link")
        .id(function(d) {return d.id;})
        .distance(forceProperties.link.distance)
        .iterations(forceProperties.link.iterations)
        .links(forceProperties.link.enabled ? graph.links : []);

    // updates ignored until this is run
    // restarts the simulation (important if simulation has already slowed down)
    simulation.alpha(1).restart();
}



//////////// DISPLAY ////////////

var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,100])

// Mouse over functions
var Tooltip = d3.select('svg')
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    
    
var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html("The exact value of<br>this cell is: " + d.id)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    // d3.select(this)
    //   .style("stroke", "none")
    //   .style("opacity", 0.8)
  }
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,100])

// generate the svg objects and force simulation
function initializeDisplay() {
  // set the data and properties of link lines
  link = svg.append("g")
        .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line");

  // set the data and properties of node circles
  node = svg.append("g")
        .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
        .style("fill", function(d) { return myColor(d.value)} )
        .attr("r", function(d) { return d.size; })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("click", (d) => {console.log(d.id)})
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

  // node tooltip
  node.append("title")
      .text(function(d) { return d.id; });
  // visualize the graph
  updateDisplay();
}

// update the display based on the forces (but not positions)
function updateDisplay() {
    node
        // .attr("r", forceProperties.collide.radius)
        .attr("stroke", forceProperties.charge.strength > 0 ? "blue" : "red")
        .attr("stroke-width", forceProperties.charge.enabled==false ? 0 : Math.abs(forceProperties.charge.strength)/15);

    link
        .attr("stroke-width", forceProperties.link.enabled ? 1 : .5)
        .attr("opacity", forceProperties.link.enabled ? 1 : 0);
}

// update the display positions after each simulation tick
function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    d3.select('#alpha_value').style('flex-basis', (simulation.alpha()*100) + '%');
}



//////////// UI EVENTS ////////////

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0.0001);
  d.fx = null;
  d.fy = null;
}

// update size-related forces
d3.select(window).on("resize", function(){
    width = +svg.node().getBoundingClientRect().width;
    height = +svg.node().getBoundingClientRect().height;
    updateForces();
});

// convenience function to update everything (run after UI input)
function updateAll() {
    updateForces();
    updateDisplay();
}

// load the data
graph = data;
initializeDisplay();
initializeSimulation();

}