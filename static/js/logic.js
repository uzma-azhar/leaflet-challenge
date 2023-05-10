// Leaflet Part 1
function init()
{
    // using Nevada Coordinates = 38.8026° N, 116.4194° W
    var myMap = L.map("map", 
        {
            center: [38.8026, -116.4194],
            zoom: 5
        }
    );

    // add the initial tile layer to the map - using Stadia.AlidadeSmooth
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // use earthquake data from past 7 days
    var dataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

    // use d3.json() to read data for earthquakes from past 7 days
    d3.json(dataURL).then(function(data){
        // console.log(data)
        
        for (var i = 0; i < data.features.length; i++)
        {
            var location = data.features[i].geometry.coordinates
            var radius = (data.features[i].properties.mag*4)
            var depth = data.features[i].geometry.coordinates[2]
            
            // create markers using location, radius, and depth values
            L.circleMarker(
                [location[1], location[0]], 
                {
                    radius:radius,
                    color: "black",
                    weight: 1,
                    fillColor: circleColor(depth),
                    fillOpacity: 1
                }
            ).bindPopup(`<center><h4>Earthquake Magnitude: ${data.features[i].properties.mag}<br>
            Time: ${new Date(data.features[i].properties.time)}<br>
            Location: ${data.features[i].properties.place}</h4></center>`)
            .addTo(myMap);
            
        }
    
    });

    // create legend 
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        // make a div with class = "info legend"
        let div = L.DomUtil.create("div", "info-legend");
        let limits = [-10, 10, 30, 50, 70, 90]
        let labels = []


        for (var i = 0; i< limits.length; i++)
        {
            // iterate and add colors and labels to legend
            labels.push('<i style="background:' + circleColor(limits[i] + 1) + 
            '"></i>' + limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] : '+'));
        }

        // then add the breaks to the div
        div.innerHTML = labels.join("<br>")
        
    return div; 
    
    }
    legend.addTo(myMap)

    // add tectonic boundaries data
    d3.json("PB2002_boundaries.json").then(function(tectonic){
        

        for (var i = 0; i < tectonic.features.length; i++)
        {    
            var lines = tectonic.features[i].geometry.coordinates
            
        }
        // console.log(lines)

    })
    
};

// function to determine color of circle
function circleColor(value)
{
    if (value <= 10)
        return "#2CBA00"
    else if (value <= 30)
        return "#A3FF00"
    else if (value <= 50)
        return "#FAB733"
    else if (value <= 70)
        return "#FF8E15"
    else if (value <= 90)
        return "#FF4E11"
    else if (value >= 90)
        return "#FF0D0D"
};

// call init function
init();

