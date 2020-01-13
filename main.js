$(function () {

  var map = L.map('map', {
    zoomControl: true
  });
  map.setView([55.10, 14.7], 15), map.zoomControl.setPosition('topright') ;  //([55.14, 14.9], 11)

  // L.control.layers(imageUrl).addTo(map);

  var tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',{
      attribution: 'Webmap made by Frederik Hass, Basemap Esri &copy;',
      maxZoom: 18,
      minZoom: 8
    }).addTo(map);

    function getColor(d) {
      return d === "true" ? '#d62a0f' :
             d === "false" ? '#f55a42' :
                     '#000000';
    }

    var hoverStyle = {
      radius: 10
    };
    var defaultStyle = {
      radius: 6
    };


    $.getJSON('GeoUnit.geojson', function (data) {
      var geojson = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
          // mouse and click events
          (function () {
            layer.on('mouseover', function () {
              layer.setStyle(hoverStyle);
            });
            layer.on('mouseout', function () {
              layer.setStyle(defaultStyle);
            });
            layer.on('click', function(e){
              map.panTo(e.latlng);
            });
            layer.on('click', function () {
              layer.bindPopup('<iframe src="./popup/' + feature.properties.name + '.html" height="810px" width="929px" frameBorder="0"></iframe>',
              {maxWidth: 929,
              offset: [0, 440]})
              .openPopup();
            });


            })
            (layer, feature.properties);

        },
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            // Stroke
            color: getColor(feature.properties.bomb),
            weight: 2,
            opacity: 0.95,
            // Fill properties
            fillColor: getColor(feature.properties.bomb),
            fillOpacity: 0.85,

            radius: 6

            });
          }

      });

      geojson.addTo(map);

    });

//////////////  LEGEND  //////////////

/*
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        categories = ["7. Maj 1945", "8. Maj 1945"],
        labels = [];


    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < categories.length; i++) {
      div.innerHTML +=
      '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
       'Bombenedslag d. ' + (categories[i] ? categories[i] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
*/

////////////// CUSTOM CONTROLLER WITH IMAGE OVERLAY //////////////


  var imageUrl = 'https://www.roennebyarkiv.com/uploads/1/1/2/5/11258347/1039673_orig.jpg',
      imageBounds = [[55.109370, 14.6885], [55.0870, 14.7181000]]; // [Top Left], [Bottom Right]

  var map1945 = L.imageOverlay(imageUrl, imageBounds, {opacity:0.7, interactive: false});



  var topleft    = L.latLng(55.1079813, 14.6873083),
  	topright   = L.latLng(55.1094986, 14.7155155),
  	bottomleft = L.latLng(55.0866407, 14.6909597);

  var overlay = L.imageOverlay.rotated("https://www.roennebyarkiv.com/uploads/1/1/2/5/11258347/1039673_orig.jpg", topleft, topright, bottomleft, {
  	opacity: 0.8,
  	interactive: true
  });

  L.Control.Watermark = L.Control.extend({
      onAdd: function(map) {
          var img = L.DomUtil.create('img');

          img.src = 'https://www.roennebyarkiv.com/uploads/1/1/2/5/11258347/1039673_orig.jpg';
          img.style.width = '150px';

          img.addEventListener('click', ()=> {
              this.fire('myevent');
          });
          this.img

          return img;
      }
  });
  L.extend(L.Control.Watermark.prototype, L.Evented.prototype);

  var mark = new L.Control.Watermark({ position: 'topleft'}).addTo(map);
    mark.on('myevent', function() {
      if (map.hasLayer(overlay)) {
          overlay.remove(map);
      } else {
          overlay.addTo(map);
      }
    });


//////////////////////////////////////////////////////////////////

});
