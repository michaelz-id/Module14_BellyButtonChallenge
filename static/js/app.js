// url in a constant var
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard at start up 
function init() {

    // create the dropdown menu using select id
    let dropdownMenu = d3.select("#selDataset");

    // Populate the dropdown selector
    d3.json(url).then((data) => {
        
        // Set a var for the sample names
        let names = data.names;

        // Add  samples to dropdown menu
        names.forEach((id) => {

            // print id in loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // set first id sample from the list
        let sample_one = names[0];

        // Log the value of sample_one
        console.log(sample_one);

        // Build the initial plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildGaugeChart(sample_one);

    });
};

// Function that populates key-value pair metadata table
function buildMetadata(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // print the array
        console.log(value)

        // set first id from the list
        let valueData = value[0];

        // select panel body
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key-value pair to the panel body
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function that builds the bar chart
function buildBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        //layout
        let layout = {
            title: "Top 10 OTU"
        };

        //Plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Get sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // First index in array
        let valueData = value[0];

        // Get otu_ids, otu_labels, and sample_values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria in Test Subject: " + sample,
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Build all the charts again
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// Run init function
init();