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
     heatmapData,
     centreSet,
     oldestTweetDate;


	function init(tag) {
        centreSet = false;
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
        
        var overlayTimeDropDownDiv = document.createElement('overlayTimeDropDownDiv');
        MapExtras.TimeDropDown(overlayTimeDropDownDiv)
        overlayTimeDropDownDiv.index = 1
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(overlayTimeDropDownDiv);

        heatmap = new HeatmapOverlay(map, {"radius":15, "visible":false, "opacity":80});

         google.maps.event.addListenerOnce(map, "idle", function(){
            heatmap.setDataSet(heatmapData);
        });


	}

    function getTweets($, tag, dateFrom)
    {
        var that = this
        var apiUrl = '/api/map/' + tag;
        if(dateFrom)
            apiUrl = apiUrl + '?from=' + dateFrom
     
        console.log(apiUrl);
        $.get(apiUrl, function(data) {
          if(data.length==0 && tweets.length ==0)
          {
                noDataFound(tag)
          }
            else
          {
            var reversedData = data.reverse();
            for (var i = 0; i < data.length; i++)
            {
                  // add tweet to list
                  tweets.push(data[i]);
                  var newTweetItem = getTweetListItem(reversedData[i]);
                  $('no-data').remove();
                  $('.tweet-list').prepend(newTweetItem)

                  // add pin and heatmap point to map
                  if(reversedData[i].latitude_for_map && reversedData[i].longitude_for_map)
                  {
                  heatmapData.data.push({lat: reversedData[i].latitude_for_map, lng:reversedData[i].longitude_for_map, count: reversedData[i].rating});
                  addPinAndInfoWindow(reversedData[i])
                  }
              }
              // centre the map
              if(markers.length > 0 && that.centreSet == false)
              {
                that.centreSet = true
                centreMap(data);
              }
        }


        });
    }

    function getTweetListItem(data)
    {
        return '<li class="clearfix"><div><img src="' + data.profile_image_url + '"><strong><a href="https://twitter.com/' + data.from_user + '">' + data.from_user + '<br></a></strong><span class="small-text">' + data.text_as_html + '</span><time datetime="' + data.created_at + '">' + data.pretty_date + '</time></div></li>'
    }

    function noDataFound(tag)
    {
        if($('.no-data').length==0)
          $('.tweet-list').prepend('<li class="no-data"><div class="message text-error">No data found for #' + tag + '</div></li>')
    }

    function centreMap(data)
    {

        var highestLat,
            highestLong,
            lowestLat,
            lowestLong;

        for (var i = 0; i < data.length; i++)
          {
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
        marker.setMap(map)

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

    Api.UpdateMap = function(resetToTime)
    {
        if(resetToTime!=null) {
          // clear the tweetlist and remove the pins / heatmap points.
          $('.tweet-list').html('');
          tweets= [];
          heatmapData.data = [];
         for (var i = 0; i < markers.length; i++ ) {
            markers[i].setMap(null);
          }
           markers = [];
           oldestTweetDate = new Date().getTime()  - ((60 * resetToTime) * 60 * 1000);
        }

        var dateFrom = oldestTweetDate;
     
        if(tweets.length > 0)
        {
            console.log(tweets)
            dateFrom = tweets[tweets.length-1].created_at
        }
        getTweets($,tag,dateFrom)
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

$(function() {
    App.UpdateMap(12)
    setInterval(App.UpdateMap, 10000)
});
