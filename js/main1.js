// Initialize map
var map = L.map('map').setView([32.818463, -95.140065], 4);  // Centered on the US with zoom level 4

var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Your data-fetching and marker code remains the same...


fetch('data/Major_city.geojson')
    .then(response => response.json())
    .then(data => {
        var citiesAndCapitals = data.features.filter(feature => 
            feature.properties.CLASS === 'city' && feature.properties.CAPITAL === 'State'
        );

        function getRadius(population) {
            if (population > 1000000) return 20;
            if (population >= 500000) return 15;
            if (population >= 100000) return 10;
            if (population >= 50000) return 7;
            return 5;
        }

        var circleColor = '#0000FF';
        var activePopup = null;

        L.geoJSON(citiesAndCapitals, {
            pointToLayer: function (feature, latlng) {
                var population = feature.properties.POPULATION;
                var capitalName = feature.properties.NAME;
                var stateAbbr = feature.properties.ST;
                var radius = getRadius(population);

                var marker = L.circleMarker(latlng, {
                    radius: radius,
                    fillColor: circleColor,
                    color: circleColor,
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.6
                });

                marker.on('click', function (e) {
                    if (activePopup) {
                        map.closePopup(activePopup);
                    }

                    activePopup = L.popup()
                        .setLatLng(e.latlng)
                        .setContent(`<b>${capitalName}, ${stateAbbr}</b><br>Population: ${population.toLocaleString()}`)
                        .openOn(map);
                });

                return marker;
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error:', error));

// Create a map legend
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += `<h4>Population</h4>`;

    var populationRanges = [
        { label: "1,000,000+", size: 20 },
        { label: "500,000&nbsp;-<br>999,999", size: 15 },
        { label: "100,000&nbsp;-<br>499,999", size: 10 },
        { label: "50,000&nbsp;-<br>99,999", size: 7 },
        { label: "< 50,000", size: 5 }
    ];

    populationRanges.forEach(range => {
        let svgSize = range.size * 2.2;

        div.innerHTML += `
            <div class="legend-item">
                <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">
                    <circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${range.size}" fill="#0000FF" opacity="0.6" stroke="#0000FF" stroke-width="1.5"/>
                </svg>
                <span>${range.label}</span>
            </div>
        `;
    });

    return div;
};

legend.addTo(map);

