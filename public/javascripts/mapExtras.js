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
      controlText.innerHTML = '<strong>Show pins</strong>';
      pinButton.appendChild(controlText);

      overlayState = "Heatmap"

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

    return Api;
}())