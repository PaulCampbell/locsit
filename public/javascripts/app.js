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

        $.get('/api/map/' + tag, function(data) {
          for (var i = 0; i < data.length; i++)
          {
              if(data[i].latitude_for_map && data[i].longitude_for_map)
              heatmapData.data.push({lat: data[i].latitude_for_map, lng:data[i].longitude_for_map, count: 4});

              addPinAndInfoWindow(data[i])
          }
          centreMap(data);
        });
    }

    function centreMap(data)
    {

        var highestLat,
            highestLong,
            lowestLat,
            lowestLong;

        for (var i = 0; i < data.length; i++)
          {
              console.log(data[i].latitude_for_map + ', ' + data[i].longitude_for_map)
            if(highestLat == null)
            {
                highestLat = data[i].latitude_for_map;
                lowestLat = data[i].latitude_for_map;
                highestLong = data[i].longitude_for_map;
                lowestLong = data[i].longitude_for_map;
            }

            if(data[i].latitude_for_map < lowestLat)
            {
                lowestLat = data[i].latitude_for_map;
            }
            if(data[i].latitude_for_map > highestLat)
            {
                highestLat = data[i].latitude_for_map
            }
            if(data[i].longitude_for_map < lowestLong)
            {
                lowestLong = data[i].longitude_for_map;
            }
            if(data[i].longitude_for_map > highestLong)
            {
                highestLong = data[i].longitude_for_map
            }
          }

        var centreLat = highestLat - ((highestLat - lowestLat)/2);
        var centreLong = highestLong - ((highestLong - lowestLong)/2)
        console.log(centreLat + ',' + centreLong)
        map.setCenter(new google.maps.LatLng( centreLat,centreLong))
    }

    function addPinAndInfoWindow(tweet)
    {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(tweet.latitude_for_map, tweet.longitude_for_map),
            title: tweet.name
        });
         markers.push(marker)
        // To add the marker to the map, call setMap();


        var infowindow = new google.maps.InfoWindow({
            content: "<h4>" + tweet.from_user + "</h4>" + tweet.text
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

	
	Api.Init = function(tag){
        init(tag);
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


