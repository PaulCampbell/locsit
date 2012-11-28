var App = (function () {
	var Api = {},
     map,
     markers,
     openInfoWindow,
     infoWindows,
     mapOptions,
     google,
     mapCentreLat,
     mapCentreLong ;


	function init(google) {
        markers = [];
        infoWindows = [];
        mapCentreLat = '53.567719';
        mapCentreLong = '-1.483154';
        mapOptions = {
            center: new google.maps.LatLng(mapCentreLat, mapCentreLong),
            zoom: 6,
            panControl: true,
            zoomControl: true,
            scaleControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	}
	
	Api.Init = function(google){
        init(google);
    };

	return Api;
}());


App.Init(window.google);