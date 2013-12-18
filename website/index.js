var	/* These are the approximated boundaries of the original map in the 
	   "Strategic Environmental Assessment for Further Onshore Oil and Gas 
	   Licensing" report, figure 'NTS 1'. No information is available beyond
	   these boundaries, we need to presume that they are neither already 
	   licensed nor under consideration. */
	MAP_BOUNDARIES = {
		EASTING: 50000,
		NORTHING: 950000,
		WIDTH: 710000, 
		HEIGHT: 910000
	};

var map,
	ajaxRequest,
	plotlist,
	plotlayers = [ ];

var makeGeoJSON = function (dataFile, callback) {
	d3.csv("data.csv", function (data) {
		var featureCount = 0,
			geoJSON = {
				type: "FeatureCollection",
				features: [ ]
			};
		_.each(data, function (square) {
			var latLon = [ 
				OsGridRef.osGridToLatLong({ easting: parseFloat(square.easting), northing: parseFloat(square.northing) }),
				OsGridRef.osGridToLatLong({ easting: parseFloat(square.easting) + parseFloat(square.width), northing: parseFloat(square.northing) }),
				OsGridRef.osGridToLatLong({ easting: parseFloat(square.easting) + parseFloat(square.width), northing: parseFloat(square.northing) - parseFloat(square.height) }),
				OsGridRef.osGridToLatLong({ easting: parseFloat(square.easting), northing: parseFloat(square.northing) - parseFloat(square.height) }),
			];
			geoJSON.features.push({
				type: "Feature",
				id: (++featureCount).toString(),
				properties: {
					name: "Alabama",
					density: 94.65,
				},
				geometry: {
					type: "Polygon",
					coordinates: [[ 
						// TODO: I am sure that there is a cooler way to write this
						[ latLon[0].lon(), latLon[0].lat() ],
						[ latLon[1].lon(), latLon[1].lat() ],
						[ latLon[2].lon(), latLon[2].lat() ],
						[ latLon[3].lon(), latLon[3].lat() ],
					]],
				}
			});
		});
		callback(null, geoJSON);
	});
};

// Derived from example at http://switch2osm.org/using-tiles/getting-started-with-leaflet/
var initMap = function () {
	makeGeoJSON("data.csv", function (err, data) {
		// set up the map
		map = new L.Map('map');
		// create the tile layer with correct attribution
		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib='Map data © OpenStreetMap contributors';
		var osm = new L.TileLayer(osmUrl, { minZoom: 1, maxZoom: 12, attribution: osmAttrib });		
		// start the map in South-East England
		map.setView(new L.LatLng(55, 0.6), 6);
		map.addLayer(osm);
		L.geoJson(data).addTo(map);
	});
}

//console.log(OsGridRef.osGridToLatLong({ easting: 450000, northing: 150000}));
