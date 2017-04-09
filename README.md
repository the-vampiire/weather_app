# weather_app
Weather App for Free Code Camp


Task:
  Produce a weather app that uses an API to retrieve user location and local weather information. Allow for user to select Celsius or Fahrenheit temperature units.
  
Delivered:
  Weather app that uses secure location services for precise location determination 
  
  Utilies Apixu weather API to determine current weather conditions
  
  Checks day or night then current weather condition and sets background image to the matching condition (5 for each day and night)
    Sunny[Moon], Cloudy, Fog, Rain, Snow
  
  Experimental feature utilizes a Flickr API request to find an image within the radius of the user's location that is highly rated and     tagged as 'skyline' or 'city'
    If the request fails to find an image the default (condition image) remains displayed
      Current bug (4/9): Flickr can on occasion return an image (passing the 'failed to return' check put in place) that is a placeholder       for 'this image is no longer available). No current solution found to check for and mitigate this issue. 
  
  Options sidebar menu to allow for user selection of which weather data they would like to display. Includes Celsius, actual and feels     like temperatures, humidity, cloud cover, and the option experimental feature (alerts user to the function being enabled on selection)
    Applying settings button triggers a reload which returns the selected outputs into the display div 
    
    
Upcoming (as of 4/9):
  Credit footer bar which displays the photographer's name, photo title, and link to the photo being displayed
  Multiple Flickr returns (when available) to be cycled by the user 
  Option for user input of location rather than using location service
  Improved weather icons (not pleased with the night time icons, they are very small)
  
  
      
