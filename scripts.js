  var crs = new L.Proj.CRS('EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs', {
    origin: [-2500000, 9045984],
    resolutions: [
      21674.7100160867,
      10837.35500804335,
      5418.677504021675,
      2709.3387520108377,
      1354.6693760054188,
      677.3346880027094,
      338.6673440013547,
      169.33367200067735,
      84.66683600033868,
      42.33341800016934,
      21.16670900008467,
      10.583354500042335,
      5.291677250021167,
      2.6458386250105836,
      1.3229193125052918,
      0.6614596562526459,
      0.33072982812632296,
      0.16536491406316148
    ]
  });

    var mymap = L.map('mapid', {crs: crs}).setView([60 , 10], 3);


    L.esri.tiledMapLayer({
      url: "http://nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
      maxZoom: 17,
      minZoom: 0
    }).addTo(mymap);


    newMarkerGroup = new L.LayerGroup();
    map.on('click', addMarker);
    
    function addMarker(e){
        var newMarker = new L.marker(e.latlng).addTo(map);
    }

    /*var popup = L.popup();

    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
    }

    mymap.on('click', onMapClick);
    */

/*
$("#adresse").on("keyup", function () {
  $.get("https://ws.geonorge.no/SKWS3Index/ssr/sok?navn="+$(this).val()+"*&maxAnt=20&antPerSide=20&eksakteForst=true", function (data) {

    $(data).find("sokRes > stedsnavn").each(function(index, stedsnavn) {
      console.log($(stedsnavn).find("stedsnavn").text());
    });

  });
});
*/

$('#adresse').autocomplete({
    serviceUrl: function (search) {
      return "https://ws.geonorge.no/SKWS3Index/ssr/sok?navn="+search+"*&maxAnt=20&antPerSide=20&eksakteForst=true"
    },
    transformResult: function(response) {
      var suggestions = [];

      $($.parseXML(response)).find("sokRes > stedsnavn").each(function(index, stedsnavn) {
            suggestions.push({
              value: $(stedsnavn).find("stedsnavn").text(),
              data:  {
                  x: $(stedsnavn).find("aust").text(),
                  y: $(stedsnavn).find("nord").text()
              }
            })
          });
      return {
        suggestions: suggestions
        };
    },
    onSelect: function (suggestion) {
      mymap.setView(proj4('EPSG:25833','WGS84',[suggestion.data.x, suggestion.data.y]).reverse(), 12);
    }
});
