function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata${sample}`;

  d3.json(url).then(function (response) {
    console.log(response);
    var data = response;
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html('');
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // data.forEach((d) => {
    //   var row = div.append("div");
    Object.entries(data).forEach(([key, value]) => {
      panel.append("li")
        .text(`${key}:${value}`);
    });
    console.log(data);
    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples${sample}`

  d3.json(url).then(function (response) {
    var xValue = response['otu_ids'];
    var yValue = response['sample_values'];
    var sizeValue = response['sample_values'];
    var label = response['otu_labels'];

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: xValue,
      y: yValue,
      mode: 'markers',
      marker: {
        size: sizeValue,
        color: xValue,
        colorscale: "Rainbow",
        labels: label,
        type: 'scatter',
        opacity: 0.2
      }
    };

    var data1 = [trace1];

    var layout = {
      title: 'Marker Size',
      xaxis: { title: 'OTU ID' },
      showlegend: true
    };

    Plotly.newPlot('bubble', data1, layout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data = [{
      values: sizeValue.slice(0, 9),
      labels: xValue.slice(0, 9),
      text: yValue.slice(0, 9),
      type: 'pie'
    }];
    Plotly.newPlot('pie', data);
  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
