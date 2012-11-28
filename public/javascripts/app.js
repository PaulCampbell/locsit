var App = (function (google, HeatmapOverlay) {
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
     heatmapMarkers,
    heatmap;

    var testData={
        		max: 10,
        		data: [{lat: 53.567719, lng:-1.044, count: 4},{lat: 51.5608, lng:-1.724, count: 7}]
    }


	function init() {
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
        heatmapMarkers = [];
        tweets = [];

        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        heatmap = new HeatmapOverlay(map, {"radius":15, "visible":true, "opacity":60});

         google.maps.event.addListenerOnce(map, "idle", function(){
            heatmap.setDataSet(testData);
        });
	}


	
	Api.Init = function(){
        init();
    };

    Api.UpdateMap = function()
    {

    }

	return Api;
}(google, HeatmapOverlay));


App.Init();