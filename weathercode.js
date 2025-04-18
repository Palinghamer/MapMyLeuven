//function for the current weather
class OpenWeatherMap {
    // function for get the coordinates by location name
    async getCurrentCoordinatesBy(locationName) {
        const appid = "4208f98548c8c95a759522b1c4c76230"
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${appid}`;

        let locationJSON = {};
        //variable for the outcome of the API
        try {
            const response = await fetch(url);
            //call to the server
            if (!response.ok) {
                alert(`Response status: ${response.status}`);
            }

            let result = await response.json();
            if (result.length > 0) {
                locationJSON = result[0];
                //if the outcome has data, it is going to be saved in the variable locationJSON
            }

        } catch (error) {
            alert(`Response error message: ${error.message}`);
        }

        return locationJSON;
    }


    //function for the current weather
    async loadWeatherData() {
        const button = document.querySelector('button'); //I take the button
        button.disabled = true; //disable the button
        const city = "Leuven";
        const appid = "4208f98548c8c95a759522b1c4c76230"

        // Get city's location
        const locationJSON = await this.getCurrentCoordinatesBy(city);
        if (locationJSON === {}) {
            return;
        }
        //prova
        //if (Object.keys(locationJSON).length === 0){
            //return;
        //}
        //prova

        // Make an API call
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${locationJSON.lat}&lon=${locationJSON.lon}&units=metric&appid=${appid}`;
        fetch(url)
            .then((response) => response.json())
            .then(function (data) {
                const output = OpenWeatherMap.processWeatherDataBy(data);
                // Result output
                document.getElementById('weather-info-canvas').innerHTML = output

            });
    }

    // function for process weather json data into a readable message
    static processWeatherDataBy(json) {
        let output = "";

        output += "Current weather: " + json.weather[0].main + ". ";
        output += "The current temperature is " + json.main.temp + " degrees. ";

        output += "<br><br>MapMyLeauven recommends: "

        //personalized messages for the weather
        if (json.weather[0].main === 'Clouds' || json.weather[0].main === 'Rain' || json.weather[0].main === 'Snow') {

            output += "Do not forget your umbrella! "
        }

        if (json.weather[0].main === 'Clear' || json.weather[0].main === 'Sun') {

            output += "Do not forget your sunglasses! "
        }

        //personalized messages for temperature

        if (json.main.temp > 25) {
            output += "Stay hydrated! "
        }

        if (json.main.temp > 14 && json.main.temp <= 25) {
            output += "Bring a light jacket, just in case. "
        }

        if (json.main.temp >= 5 && json.main.temp <= 14) {
            output += "Wear a jacket. "
        }

        if (json.main.temp < 5) {
            output += "Wear a heavy jacket! It is going to be very cold. "
        }

        return output;
    }

    static empty(element) {
        element.innerHTML = "";
    }
}

//now the class to manage the future weather forecast (+5 days)
class TomorrowIO {

    //function for the current weather
    async loadWeatherDataBy(date) {
        const button = document.querySelector('button'); //I take the button
        button.disabled = true; //disable the button

        const city = "leuven";
        const apikey = "rwLlEeM6m3KHLBgtou3T1gzseFT0iObl";
        let result = undefined;

        // Make an API call
        const url = `https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=${apikey}`;
        await fetch(url)
            .then((response) => response.json())
            .then(function (data) {

                if (data.hasOwnProperty("code")) {
                    alert(`Error: ${data["message"]}`);
                    return;
                }

                const timelines = data.timelines;
                const dailyWeathers = timelines.daily;
                //we get the forecast as a list




                //look for the weather forecast for the chosen date; if found, it is saved in result
                for (const dailyWeather of dailyWeathers) {
                    const weatherDate = dailyWeather.time.split('T')[0];
                    if (weatherDate === date) {
                        result = dailyWeather;
                        break;
                    }
                }
            });

        return result;
    }

}