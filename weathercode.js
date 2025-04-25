//function for the current weather

function loadWeatherData(){
    const button = document.querySelector('button'); //I take the button
    button.disabled = true; //disable the button
    const city="Leuven";
    const appid = "4208f98548c8c95a759522b1c4c76230"
    const url="https://api.openweathermap.org/data/2.5/weather?q=Leuven&units=metric&appid=4208f98548c8c95a759522b1c4c76230";

    //function to convert celsius degrees into fahrenheit degrees
    function celsiusToFahrenheit(celsius){
        return (celsius * 9/5) + 32;
    }

    fetch(url)
        .then((response) => response.json())
        .then (function(data){

            var output = "";


            output += "Current weather: " + data.weather[0].main+ ". ";
            output += "The current temperature is " +data.main.temp+ " °C (" + celsiusToFahrenheit(data.main.temp).toFixed(1) + " °F).";

            output += "<br><br>MapMyLeauven recommends: "

            //personalized messages for the weather
            if (data.weather[0].main === 'Clouds' || data.weather[0].main === 'Rain' || data.weather[0].main === 'Snow'){

                output += "Do not forget your umbrella! "
            }

            if (data.weather[0].main === 'Mist') {
                output += "There’s a chance of rain, better bring an umbrella. "
            }

            if (data.weather[0].main === 'Clear' || data.weather[0].main === 'Sun') {

                output += "Do not forget your sunglasses! "
            }

            //personalized messages for temperature

            if (data.main.temp > 25) {
                output += "Stay hydrated! "
            }

            if (data.main.temp > 14 && data.main.temp <= 25) {
                output += "Bring a light jacket, just in case. "
            }

            if (data.main.temp >= 5 && data.main.temp <= 14) {
                output += "Wear a jacket! It is going to be chilly. "
            }

            if (data.main.temp < 5) {
                output += "Wear a heavy jacket! It is going to be very cold. "
            }

            // Result output
            document.getElementById('weather-info-canvas').innerHTML = output



        }); }
function empty(element){
    element.innerHTML="";
}
