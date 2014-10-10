var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = 560 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


//var outerSvg = d3.select("body").append("svg")
var outerSvg = d3.select("body svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
var svg = outerSvg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    // .append("text")
    // .attr("class", "label")
    // .attr("x", width)
    // .attr("y", -6)
    // .style("text-anchor", "end")
    // .text("Sepal Width (cm)");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

outerSvg.append("text")
    .attr("class", "label")
    .attr("transform","rotate(-90)")
    .attr("y", 0)
    .attr("x", -(height + margin.top + margin.bottom) / 2)
    .style("text-anchor", "middle")
    .attr("dy","1em")
    .text("Money remaining");


svg.append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Martingale");

function graphData(data, initial, goal){
    x.domain([0, data.length]);
    y.domain([0, d3.max(data) + 10]);

    var dot = svg.selectAll(".dot")
	.data(data)
	.attr("cx", function(d, i) { return x(i); })
	.attr("cy", function(d) { return y(d); });
    
    dot.enter().append("circle")
	.attr("class", "dot")
	.attr("r", 3.5)
	.attr("cx", function(d, i) { return x(i); })
	.attr("cy", function(d) { return y(d); });

    svg.selectAll("g .y.axis")
	.call(yAxis);
    
    svg.selectAll("g .x.axis")
	.call(xAxis);

    svg.selectAll("text.title")
	.attr("class", "title")
	.attr("x", width / 2)
	.attr("y", 0)
	.text("Martingale, initial amount " + initial +", goal amount " + goal);
}


function updateGraph(){
    var initial = parseInt($('#initial').val(), 10);
    var goal = Number($('#goal').val());
    if(!isNaN(initial) && initial >= 0 && !isNaN(goal) && goal >= 0)
	graphData(_.range(50).map(function(){return martingale(initial, goal)}), 
		 initial,
		 goal);
}

var params = getQueryParams(window.location.search)

if(params.hasOwnProperty('initial')) $('#initial').val(params.initial);
if(params.hasOwnProperty('goal')) $('#goal').val(params.goal);
if(params.hideControls) $('#controls').css('visibility', 'hidden');


$('#initial').on('input', updateGraph);
$('#goal').on('input', updateGraph);
updateGraph();


//from http://stackoverflow.com/a/1099670/956723
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}
