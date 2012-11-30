var App = (function (google, HeatmapOverlay, $) {
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
        heatmap = new HeatmapOverlay(map, {"radius":15, "visible":true, "opacity":60});


        getTweets($, tag);

         google.maps.event.addListenerOnce(map, "idle", function(){
            heatmap.setDataSet(heatmapData);
        });
	}

    function getTweets($, tag)
    {
        $.get('api/map/' + tag, function(data) {

          for (var i = 0; i < data.length; i++)
          {
              if(data[i].latitude_for_map && data[i].longitude_for_map)
              heatmapData.data.push({lat: data[i].latitude_for_map, lng:data[i].longitude_for_map, count: 4});
          }

        });
    }

	
	Api.Init = function(){
        init();
    };

    Api.UpdateMap = function()
    {

    }

	return Api;
}(google, HeatmapOverlay, $));


// we need the hashtag!
var tag = window.location.pathname.substring(1)
console.log(tag)

App.Init(tag);