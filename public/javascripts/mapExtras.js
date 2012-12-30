var MapExtras = (function(){
    var Api = {},
        pinButton,
        controlText,
        overlayState;

    Api.PinHeatMapToggleControl = function (controlDiv, map, google) {

      // Set CSS styles for the DIV containing the control
      // Setting padding to 5 px will offset the control
      // from the edge of the map.
      controlDiv.style.padding = '5px';

      // Set CSS for the control border.
        pinButton = document.createElement('div');
        pinButton.style.backgroundColor = 'white';
        pinButton.style.borderStyle = 'solid';
        pinButton.style.borderWidth = '1px';
        pinButton.style.cursor = 'pointer';
        pinButton.style.textAlign = 'center';
        pinButton.title = 'Click to set the map to Home';
      controlDiv.appendChild(pinButton);

      // Set CSS for the control interior.
      controlText = document.createElement('div');
      controlText.style.fontFamily = 'Arial,sans-serif';
      controlText.style.fontSize = '12px';
      controlText.style.padding = '2px 4px';
      controlText.innerHTML = '<strong>Show heat map</strong>';
      pinButton.appendChild(controlText);

      overlayState = "pins"

      // Setup the click event listeners: simply set the map to Chicago.
      google.maps.event.addDomListener(pinButton, 'click', function() {
          ToggleOverlay()
      });
    }


    ToggleOverlay = function(){
        if(overlayState== "Heatmap")
        {
            overlayState = "pins"
            controlText.innerHTML= "<strong>Show heat map</strong>"
        }
        else
        {
            overlayState = "Heatmap";
            controlText.innerHTML= '<strong>Show pins</strong>'
        }

        App.ToggleOverlay(overlayState);
    }


    Api.TimeDropDown = function(controlDiv){
    
      var label = document.createElement('label');
      label.for = "time";
      label.innerHTML = 'show tweets from';
    //  controlDiv.appendChild(label);
      
      controlDiv.style.padding = '5px';
      var timeDropDown = document.createElement('select');
      timeDropDown.name = "time"
      timeDropDown.style.backgroundColor = 'white';
      timeDropDown.style.padding = 0;
      timeDropDown.style.height = '23px';
      timeDropDown.title = 'Click to set the map to Home';
      controlDiv.appendChild(timeDropDown);
  
      var optionOne = document.createElement('option');
      optionOne.value = '12'
      optionOne.innerHTML = 'last 12 hours';
      timeDropDown.appendChild(optionOne);
      
      var optionTwo = document.createElement('option');
      optionTwo.value = '24'
      optionTwo.innerHTML = 'last day';
      timeDropDown.appendChild(optionTwo);
      
      var optionThree = document.createElement('option');
      optionThree.value = '168'
      optionThree.innerHTML = 'last 7 days';
      timeDropDown.appendChild(optionThree);
      
       google.maps.event.addDomListener(timeDropDown, 'change', function() {
          var timeLimit = timeDropDown.value;
          ChangeTime(timeLimit);
      });
    }
    
     ChangeTime = function(timeLimit){
       console.log('time changed ' + timeLimit)
        App.UpdateMap(timeLimit)
     }
    
    

    return Api;
}())
