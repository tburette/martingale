var margin = {top: 20, right: 20, bottom: 40, left: 50},
    width = 560 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var color = d3.scale.category10();

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0])
    .domain([0, 1]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.gains); })
    .y(function(d) { return y(d.success); });

var outerSvg = d3.selectAll("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var svg = outerSvg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

outerSvg.append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2)
    .attr("y", 0)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Success (%)");

outerSvg.append("text")
    .attr("class", "label")
    .attr("x", width/2)
    .attr("y", height + margin.top + margin.bottom)
    .attr("dy", "-.5em")
    .style("text-anchor", "middle")
    .text("Amount gained");


svg.append("text")
    .attr("class", "title")
    .attr("x", width/2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .text("Success Probability")

function drawSeries(series){
    svg.append("path")
	.datum(series.data)
	.attr("class", "line")
        .style("stroke", function(d){return color(series.initialAmount); })
	.attr("d", line);

}

function drawData(data){
    //there is a cleaner way to update with d3...
    svg.selectAll('.legend').remove();
    svg.selectAll('path.line').remove();
    color = d3.scale.category10();

    var allDataPoints = data.map(function(d){
	return d.data;
    }).reduce(function(x, y){return x.concat(y);}, [])

    if(allDataPoints.length == 0) return;

    x.domain(d3.extent(allDataPoints, function(d) { return d.gains}));

    svg.selectAll("g .x.axis")
        .call(xAxis);

    data.forEach(function(series){
	drawSeries(series);
    });

    svg.selectAll("g .y.axis")
        .call(yAxis);

    
    //does not handle updates correctly
    var legend = svg.selectAll(".legend")
	    .data(color.domain())
	    .enter().append("g")
	    .attr("class", "legend")
	    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
	.attr("x", width - 18)
	.attr("width", 18)
	.attr("height", 18)
	.style("fill", color);

    legend.append("text")
	.attr("x", width - 24)
	.attr("y", 9)
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(function(d) { return d; });

}

var series1 = { 
    initialAmount: 100,
    data: [{gains: 0, success: .99},
	   {gains: 20, success: .64},
	   {gains: 40, success: .49},
	   {gains: 60, success: .39},
	   {gains: 80, success: .22},
	   {gains: 100, success: .11}
	  ]};


var series2 = { 
    initialAmount: 200,
    data: [{gains: 0, success: 1.0},
	   {gains: 20, success: .74},
	   {gains: 40, success: .59},
	   {gains: 60, success: .49},
	   {gains: 80, success: .39},
	   {gains: 100, success: .35}
	  ]};

var data = [series1, series2];

function generateData(amounts, gains){
    //if(!Array.isArray(amounts)) amounts = [amounts];
    //if(!Array.isArray(gains)) gains = [gains];
    return amounts.map(function(amount){
	return {
	    initialAmount: amount,
	    data: gains.map(function(g){
		return {gains: g, 
		       success: oddsSuccess(amount, g)};
	    })}
    });
}

//drawData(data);
//drawData(generateData([100], [0, 20, 40, 60, 80, 100]));

function toSortedNumberArray(value){
    return value.split(/[\s]*,[\s]*/)
	.map(function(val){return parseInt(val, 10)})
	.filter(function(val){return !isNaN(val);})
	.sort(function(a, b){return a - b});
}

function updateGraph(){
    var initial = toSortedNumberArray($('#initial').val());
    var gains = toSortedNumberArray($('#gains').val());

    drawData(generateData(initial, gains));
}

var params = getQueryParams(window.location.search);

if(params.hasOwnProperty('initial')) $('#initial').val(params.initial);
if(params.hasOwnProperty('gains')) $('#gains').val(params.gains);
if(params.hideControls) $('#controls').css('visibility', 'hidden');

$('#initial').on('input', updateGraph);
$('#gains').on('input', updateGraph);
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
