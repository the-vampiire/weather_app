$(function() {



    // Experimental button feature for querying flickr to produce a background image local to the current location

    $('#Experimental').click(experimental_toggle);

        var experimental = false;

        function experimental_toggle() {
            if (experimental) {
                experimental = false;
            }
            else if (!experimental) {
                experimental = true;
                get_weather();
            }

        }



    // get location and weather button feature

    $('#Get').click(get_weather);

    function get_weather() {
        var temperature = $('#temperature');
        temperature.empty().append('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>');

        // if https and user accepts location services
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(pass, fail);

            function pass(position) {

                var lat = position.coords.latitude;
                var lon = position.coords.longitude;

                get_weather_secure(lat, lon);


                // if user chooses experimental feature (set to true) then
                if (experimental) {
                    get_flickr(lat, lon);
                }
                else {
                    console.log('experimental is off');
                }

            }

            function fail() {
                alert('Failed to retrieve secure location data');
            }

            // gets flickr background image based on location
            function get_flickr(lat, lon) {
                $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=bc63861a86c28aee09bb476d83cfe159&' +
                    'format=json&lat=' + lat + '&lon=' + lon + '&accuracy=16&safe_search=1&content_type=1&per_page=1&' +
                    'sort=interestingness-desc&text=city&text=skyline&media=photos&nojsoncallback=1', function (data) {

                    var photo = data.photos.photo[0];

                    // if no photo is found for location return to normal background image
                    if (photo === undefined || photo.farm === undefined) {
                        console.log('failed');
                        // return to normal background image
                    }
                    else {
                        $('body').css("background-image", "url(" + "https://farm" + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + "_h.jpg" + ")");
                    }
                });
            }

            function get_weather_secure(lat, lon) {
                $.get('https://api.apixu.com/v1/current.json?key=70d0f73f8eb048b8964185106170604&q=' + lat + ',' + lon, function (data) {

                    // shortcuts / JQUERY selectors
                    var current = data.current;
                    var body = $('body');

                    // weather conditions
                    var condition_icon = current.condition.icon, /*add 'https:' prefix to load icon securely*/
                    condition_text = current.condition.text,
                    condition_code = current.condition.code,

                    // weather data
                    temp_c = current.temp_c,
                    temp_f = current.temp_f,
                    feels_like_c = current.feelslike_c,
                    feels_like_f = current.feelslike_f,
                    humidity = current.humidity,
                    cloud_coverage = current.cloud,
                    is_day = current.is_day; /* day = 1, night = 0 */

                // displays weather data
                    console.log(feels_like_f);
                    // if(celsius){
                    //     temperature.empty().append('<h2>'+feels_like_f+'<span>&#8451;</span></h2>');
                    // }

                        temperature.empty().append('<h2>'+feels_like_f+'<span>&#8457;</span></h2>');



                // sets background image depending on condition code if experimental feature is off (default)

                    if(experimental === false){
                        // daytime
                        if(is_day === 1){
                            switch(condition_code){
                                // sunny
                                case 1000:
                                    body.css('background-image', 'url("Images/SUNNY_joseph-barrientos-7032_mini.jpg")');
                                    break;
                                // partly cloudy
                                case (1003):
                                case (1006):
                                    body.css('background-image', 'url("Images/PARTLY_CLOUDY_marcelo-quinan-78447_mini.jpg")');
                                    break;
                                // overcast
                                case (1009):
                                    body.css('background-image', 'url("Images/OVERCAST_antoine-barres-224061_mini.jpg")');
                                    break;
                                // fog
                                case (1030):
                                case (1135):
                                    body.css('background-image', 'url("Images/FOG_nicolas-cool-113893_mini.jpg")');
                                    break;
                                // rainy
                                case (1063):
                                case (1087):
                                case (1150):
                                case (1153):
                                case (1168):
                                case (1171):
                                case (1180):
                                case (1183):
                                case (1186):
                                case (1189):
                                case (1193):
                                case (1195):
                                case (1197):
                                case (1201):
                                case (1240):
                                case (1243):
                                case (1246):
                                case (1273):
                                case (1276):
                                    body.css('background-image', 'url("Images/RAINY_gabriele-diwald-201135_mini.jpg")');
                                    break;
                                // snowy
                                case (1066):
                                case (1072):
                                case (1147):
                                case (1114):
                                case (1117):
                                case (1210):
                                case (1213):
                                case (1216):
                                case (1219):
                                case (1222):
                                case (1225):
                                case (1237):
                                case (1204):
                                case (1069):
                                case (1207):
                                case (1249):
                                case (1252):
                                case (1255):
                                case (1258):
                                case (1261):
                                case (1264):
                                case (1279):
                                case (1282):
                                    body.css('background-image', 'url("Images/RAINY_gabriele-diwald-201135_mini.jpg")');
                                    break;
                                default:
                                    console.log('no matching code');
                                    body.css('background-image', 'url("Images/SUNNY_joseph-barrientos-7032_mini.jpg")');
                            }
                        }

                        // night time
                        else if(is_day === 0){
                            $('#jumbotron').css('background-color','white', 'color','black');
                            $('#data_row').css('color','black');
                            switch(condition_code){
                                // night sky
                                case 1000:
                                    body.css('background-image', 'url("Images/NIGHT_hoang-duy-le-149870_mini.jpg")');
                                    break;
                                // cloudy
                                case (1003):
                                case (1006):
                                case (1009):
                                    body.css('background-image', 'url("Images/NIGHT_CLOUDY_matthew-kane-162961_mini.jpg")');
                                    break;
                                // fog
                                case (1030):
                                case (1135):
                                    body.css('background-image', 'url("Images/NIGHT_FOG_aaron-lee-140096_mini.jpg")');
                                    break;
                                // rainy
                                case (1063):
                                case (1087):
                                case (1150):
                                case (1153):
                                case (1168):
                                case (1171):
                                case (1180):
                                case (1183):
                                case (1186):
                                case (1189):
                                case (1193):
                                case (1195):
                                case (1197):
                                case (1201):
                                case (1240):
                                case (1243):
                                case (1246):
                                case (1273):
                                case (1276):
                                    body.css('background-image', 'url("Images/NIGHT_RAIN_dominik-schroder-14532_mini.jpg")');
                                    break;
                                // snowy
                                case (1066):
                                case (1072):
                                case (1147):
                                case (1114):
                                case (1117):
                                case (1210):
                                case (1213):
                                case (1216):
                                case (1219):
                                case (1222):
                                case (1225):
                                case (1237):
                                case (1204):
                                case (1069):
                                case (1207):
                                case (1249):
                                case (1252):
                                case (1255):
                                case (1258):
                                case (1261):
                                case (1264):
                                case (1279):
                                case (1282):
                                    body.css('background-image', 'url("Images/NIGHT_SNOW_jason-strull-216097_mini.jpg")');
                                    break;
                                default:
                                    console.log('no matching code');
                                    body.css('background-image', 'url("Images/NIGHT_hoang-duy-le-149870_mini.jpg")');

                            }
                        }
                    }



                    console.log('https:'+condition_icon);


                });
            }

        }

        // if http and / or user does not accept location services use IP instead
        else {
            $.get('http://ipinfo.io/json', function (data) {

                var lat = data.loc.slice(0, 7);
                var lon = data.loc.slice(9);

                console.log(lat + ',' + lon);

                $.get('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&APPID=c9004aa2fe8941d1773f5ff54b954b89', function (data) {
                    // report weather somewhere
                });

            });

        }

    }

});

