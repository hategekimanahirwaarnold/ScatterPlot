const tooltip = document.getElementById("tooltip");

const padding = 50;
const w = 600;
const h = 500;

const svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

let dataSet;
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(res => res.json())
  .then(data => {
    dataSet = data.data;
    console.log("fetched data:", dataSet.length);
    console.log("highest gdp value:", d3.max(dataSet, d => d[1]));

    dataSet.forEach((element, i) => {
      if (element[1] === d3.max(dataSet, d => d[1])) {
        console.log(element, element[1], "index=", i);
      }
    });

    let yMax = d3.max(dataSet, d => d[1]);
let yTickInterval = 5000; // Set the desired tick interval for the y-axis

let roundedYMax = Math.ceil(yMax / yTickInterval) * yTickInterval;

let yScale = d3.scaleLinear()
  .domain([0, roundedYMax])
  .range([h - padding, padding]);

    const xScale = d3.scaleTime()
      .domain([d3.min(dataSet, d => new Date(d[0])), d3.max(dataSet, d => new Date(d[0]))])
      .range([padding, w - padding]);

    let xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat("%Y-%m-%d"));
    let xAxisGroup = svg.append("g")
      .attr("transform", `translate(0, ${h - padding})`)
      .attr("id", "x-axis")
      .call(xAxis)
      .selectAll("text") // Select all tick label text elements
      .style("text-anchor", "end") // Set the text-anchor to "end" to align the labels correctly
      .attr("transform", "rotate(-45)") // Apply a rotation transform to rotate the labels
      .attr("dx", "-0.5em") // Adjust the horizontal positioning of the labels
      .attr("dy", "0.5em"); // Adjust the vertical positioning of the labels;

    let yAxis = d3.axisLeft(yScale)
      .tickValues(yScale.ticks()) // Use the scale's generated tick values
      .tickFormat(d3.format(".2s")); // Format tick values as desired, e.g., "18k" instead of "18000";
    let yAxisGroup = svg.append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis);

    xAxisGroup.selectAll(".tick text")
      .classed("tick", true);
    yAxisGroup.selectAll(".tick text")
      .classed("tick", true);

    svg.selectAll("rect")
      .data(dataSet)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(new Date(d[0])))
      .attr("y", (d, i) => yScale(d[1]))
      .attr("width", 1)
      .attr("height", (d, i) => h - padding - yScale(d[1]))
      .attr("class", "bar")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1]).on("mouseover", (event, d) => {
        // Show tooltip
        tooltip.style.display = "block";
        // Calculate tooltip position based on mouse coordinates
        const xPosition = event.pageX;
        const yPosition = event.pageY;
        // Update tooltip content with date information
        tooltip.innerHTML = d[0];
        // Position the tooltip
        tooltip.setAttribute("data-date", d[0]);
        tooltip.style.left = xPosition + "px";
        tooltip.style.top = yPosition + "px";
      })
      .on("mouseout", () => {
        // Hide tooltip
        tooltip.style.display = "none";
      });

  })
  .catch(err => {
    console.log("Unable to fetch data", err);
  });
