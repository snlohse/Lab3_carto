var map2 = L.map('map2').setView([38.664689, -107.134639], 5.5);
    
var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Various GIS sources'
}).addTo(map2);

function getColor(population) {
    return population > 5000 ? '#4a1486' :
           population > 3000 ? '#6a51a3' :
           population > 2000 ? '#807dba' :
           population > 1000 ? '#9e9ac8' :
           population > 500  ? '#bcbddc' :
           population > 200  ? '#dadaeb' :
           population > 100  ? '#efedf5' :
                               '#f7f4f9';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.POP),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.NAMELSAD) {
        let formattedPop = feature.properties.POP.toLocaleString();
        layer.bindPopup(`County: ${feature.properties.NAMELSAD}<br>Population: ${formattedPop}`);

        layer.on('mouseover', function (e) {
            var layer = e.target;
            layer.setStyle({ weight: 4, color: '#666', fillOpacity: 0.9 });

            layer.bindTooltip(
                `<b>${feature.properties.NAMELSAD}</b><br>Population: ${formattedPop}`,
                { permanent: false, direction: "top", offset: [0, -10] }
            ).openTooltip();
        });

        layer.on('mouseout', function (e) {
            var layer = e.target;
            layer.setStyle({ weight: 2, color: 'white', fillOpacity: 0.7 });
            layer.closeTooltip();
        });
    }
}

L.geoJson(coloradoData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map2);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = 
        (props ? '<b>' + props.NAMELSAD + '</b><br>' + props.POP.toLocaleString() + ' people'
        : '');
};


info.addTo(map2);

var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {
var div = L.DomUtil.create('div', 'legend'),
    grades = [0, 100, 200, 500, 1000, 2000, 3000, 5000];

    div.innerHTML = '<b>Population Density</b><br>';

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<div style="display: flex; align-items: center; margin-bottom: 3px;">' +
            '<i style="background:' + getColor(grades[i] + 1) + '; width: 20px; height: 20px; display: inline-block;"></i>' +
            '<span style="margin-left: 8px;">' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+') + '</span>' +
            '</div>';
    }

    return div;
};

legend.addTo(map2);