function  drawGraph(data){
//selects a svg elements from the html page which it binds to
  var svg = d3.select("svg"),
    width = +svg.node().getBoundingClientRect().width,
    height = +svg.node().getBoundingClientRect().height;

// svg objects
var links = data.links, 
    nodes = data.nodes,
    bilinks = [];
// the data - an object with nodes and links
var graph = data;





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
        strength: -500,
        distanceMin: 1,
        distanceMax: 2000
    },
    collide: {
        enabled: true,
        strength: .7,
        iterations: 100,
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
    .force("link", d3.forceLink().distance(function(d) {return d.value;}).strength(1))
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
        .id(function(d) {
            return d.id;
        })
        .distance((d)=>{
            // if (Number.isInteger(d.value)){return d.value*100000}
            // else{return 10}
            return d.value*20
        })
            .strength(1)
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

// generate the svg objects and force simulation
function initializeDisplay() {
  // set the data and properties of link lines
    link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .style("stroke", "#6b7071") //gunmetal grey
        .attr("class", "link")
        .attr("fill", "none")
//set the node data style and functions
    node = svg.selectAll(".node")
        .data(nodes.filter(function(d) {
        return d.id;
        }))
        .enter().append("circle")
        .attr("class", "node")
        //change circle size according to new function
        //Will
        .attr("r", function(d) {
        return d.size*2
        })
        .style("fill", function(d) { return myColor(d.value)} )
        .style("stroke", "#000000")
        //.style("stroke", function(d) { return color(d.group); })
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
        .on("click", (d)=>{console.log(d.id)})

  updateDisplay();
}

// update the display based on the forces (but not positions)
function updateDisplay() {
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

initializeDisplay();
initializeSimulation();

}