const tooltip = document.getElementById("tooltip");

const padding = 50;
const w = 600;
const h = 500;
const dopColor = "rgb(229, 176, 250)";
const undopColor = "greenyellow";
const svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

var legendData = [
  { color: dopColor, label: "riders with doping allegations" },
  { color: undopColor, label: "no doping allegations" }
];

var legend = svg.append("g")
  .attr("id", "legend")
  .selectAll("g")
  .data(legendData)
  .enter()
  .append("g")
  .attr("transform", function (d, i) {
    return "translate(0," + i * 20 + ")";
  });
legend.append("rect")
  .attr("x", w - 5 * padding)
  .attr("y", 0)
  .attr("width", 48)
  .attr("height", 18)
  .style("fill", function (d) {
    return d.color;
  });

legend.append("text")
  .attr("x", w - 4 * padding)
  .attr("y", 9)
  .attr("dy", ".35em")
  .text(function (d) {
    return d.label;
  });


let dataSet;
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then(res => res.json())
  .then(data => {
    dataSet = data;
    // Parse the time values in the format "MM:SS"
    const parseTime = d3.timeParse("%M:%S");
    dataSet.forEach(d => {
      d.Time = parseTime(d.Time);
    });

    let yMax = d3.max(dataSet, d => d.Time);
    let yMin = d3.min(dataSet, d => d.Time);
    let xMax = d3.max(dataSet, d => d.Year);
    let xMin = d3.min(dataSet, d => d.Year);
    
    let xScale = d3.scaleLinear()
      .domain([xMin - 1, xMax + 1])
      .range([padding, w - padding]);

    let yScale = d3.scaleTime()
      .domain([yMax, yMin])
      .range([h - padding, padding]);

    let yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.timeFormat("%M:%S"));

    let yAxisGroup = svg.append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis);

    let xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format("d"));

    let xAxisGroup = svg.append("g")
      .attr("transform", `translate(0, ${h - padding})`)
      .attr("id", "x-axis")
      .call(xAxis);

    xAxisGroup.selectAll(".tick text")
      .classed("tick", true);
    yAxisGroup.selectAll(".tick text")
      .classed("tick", true);

    svg.selectAll("circle")
      .data(dataSet)
      .enter()
      .append("circle")
      .attr("cy", d => yScale(d.Time))
      .attr("cx", d => xScale(d.Year))
      .attr("r", 5)
      .attr("class", "dot")
      .attr("fill", ((d) => {
        if (d.Doping) {
          return dopColor
        } else {
          return undopColor
        }
      }))
      .attr("data-yvalue", d => d.Time.toISOString())
      .attr("data-xvalue", d => d.Year)
      .on("mouseover", (event, d) => {
        const date = new Date(d.Time);

        // Get the minutes and seconds from the date
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        // Show tooltip
        tooltip.style.display = "block";
        // Calculate tooltip position based on mouse coordinates
        const xPosition = event.pageX;
        const yPosition = event.pageY;
        // Update tooltip content with date information
        if (d.Doping) {
          tooltip.style.backgroundColor = dopColor;
          tooltip.innerHTML = "Year: " + d.Year + "<br>" + "Time: " + minutes +": "+ seconds + "<br>"
            + "Doping: " + d.Doping;
        } else {
          tooltip.style.backgroundColor = undopColor;
          tooltip.innerHTML = "Year: " + d.Year + "<br>" + "Time: " + minutes +": "+ seconds + "<br>"
            + "Doping: none";
        }
        // Position the tooltip
        tooltip.setAttribute("data-year", d.Year);
        tooltip.style.left = xPosition + "px";
        tooltip.style.top = yPosition + "px";
      })
      .on("mouseout", () => {
        // Hide tooltip
        tooltip.style.display = "none";

      });

  })
  .catch(err => {
    console.log("There was an error", err);
  });
