var App = (function (google, HeatmapOverlay, $, MapExtras) {
	var Api = {},
     map,
     markers,
     openInfoWindow,
     infoWindows,
     mapOptions,
     google,
     mapCentreLat,
     mapCentreLong,
     tweets,
     heatmap,
     heatmapData;


	function init(tag) {
        markers = [];
        infoWindows = [];
        mapCentreLat = 53.567719;
        mapCentreLong = -1.483154;
        mapOptions = {
            center: new google.maps.LatLng(mapCentreLat, mapCentreLong),
            zoom: 6,
            panControl: true,
            zoomControl: true,
            scaleControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        heatmapData = {
                		max: 10,
                		data: []
                      };
        tweets = [];


        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);



        var overlayToggleDiv = document.createElement('overlayToggleDiv');
        MapExtras.PinHeatMapToggleControl(overlayToggleDiv, map, google)
        overlayToggleDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(overlayToggleDiv);

        heatmap = new HeatmapOverlay(map, {"radius":15, "visible":true, "opacity":60});


        getTweets($, tag);

         google.maps.event.addListenerOnce(map, "idle", function(){
            heatmap.setDataSet(heatmapData);
        });
	}

    function getTweets($, tag)
    {
        $.get('api/map/' + tag, function(data) {

            var testDAta = [{latitude_for_map : 52.23423, longitude_for_map: -1.3, name:'A place', description: 'tweet text'},
                {latitude_for_map : 51.23423, longitude_for_map: -1.3},
                {latitude_for_map : 52.23423, longitude_for_map: -1.5}];


          for (var i = 0; i < testDAta.length; i++)
          {
              if(testDAta[i].latitude_for_map && testDAta[i].longitude_for_map)
              heatmapData.data.push({lat: testDAta[i].latitude_for_map, lng:testDAta[i].longitude_for_map, count: 4});

              addPinAndInfoWindow(testDAta[i])
          }
            console.log(markers)
        });
    }

    function addPinAndInfoWindow(place)
    {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(place.latitude_for_map, place.longitude_for_map),
            title: place.name
        });
         markers.push(marker)
        // To add the marker to the map, call setMap();


        var infowindow = new google.maps.InfoWindow({
            content: "<h4>" + place.name + "</h4>" + place.description
        });

        infoWindows.push(infowindow);

        google.maps.event.addListener(marker, 'click', function() {
             var index = 0;

            for (var i = 0; i < markers.length; i++)
            {
                if(markers[i]==marker)
                {
                    SelectPlace(index);
                }
                  index = index + 1;
             }
        });

    }

    function SelectPlace(placeIndex){
              if(openInfoWindow)
              {
                openInfoWindow.close();
              }
              infoWindows[placeIndex].open(map, markers[placeIndex]);
              openInfoWindow = infoWindows[placeIndex];
              map.panTo( markers[placeIndex].position)
        };

	
	Api.Init = function(){
        init();
    };

    Api.UpdateMap = function()
    {

    }

    Api.ToggleOverlay = function(overlayState)
    {
          heatmap.toggle();
        if(overlayState=="Heatmap")
        {
            for (var i = 0; i < markers.length; i++)
          {
              markers[i].setMap(null)
          }
        }
        if(overlayState=="pins")
        {
            for (var i = 0; i < markers.length; i++)
             {
                markers[i].setMap(map)
             }
        }

    }

	return Api;
}(google, HeatmapOverlay, $, MapExtras));


// we need the hashtag!
var tag = window.location.pathname.substring(1)
console.log(tag)

App.Init(tag);