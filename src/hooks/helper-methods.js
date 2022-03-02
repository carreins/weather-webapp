/*HELPER METHODS */

//setDisplayName
//Used to decide the displayed name of the found locations from SearchLocations component
//The used API contains a wide variety of classes to define the locations, meaning the 
//available address properties change between the locations
export const setDisplayName = (data) => {
    if(data && data.length > 0)
        for(let i = 0; i < data.length; i++){
            const {address} = data[i];

            //Check if railway property is available on address object
            let place = address.railway;

            //If not, check other possibilities
            if(!place){
                if(address.natural)
                    place = address.natural;
                else if(address.village){
                    if(address.farm)
                        place = address.farm + ", " + address.village;
                    else
                        place = address.village;
                }
                else if(address.farm)
                    place = address.farm;
                else if(address.road)
                    place = address.road;
                else if(address.suburb){
                    if(address.locality)
                        place = address.locality + ", " + address.suburb;
                    else
                        place = address.suburb;
                } 
                else if(address.locality)
                    place = address.locality;
                else if(address.town)
                    place = address.town;
                else if(address.place)
                    place = address.place;
                else if(address.hamlet)
                    place = address.hamlet;
                else if(address.isolated_dwelling)
                    place = address.isolated_dwelling;
            } else {

                //If location is railway, check if "Stasjon"/"Station" is already included
                //in place name
                place = place + (place.toLowerCase().includes("stasjon") || 
                                place.toLowerCase().includes("station") ? "" : " stasjon");
            }

            //Set two properties for two lines of display name
            data[i].address.display_name_1 = (place ? place : '') + (place && (address.municipality || address.city) ? ', ' : '') 
                + (address.municipality ? address.municipality : (address.city ? address.city : ''));
            data[i].address.display_name_2 = address.county ? address.county : '';
        }
    return data;
}

//filterSearch
//Used to filter out unwanted/unnecessary results
//Used in subsequence to method setDisplayName; displayed names are compared to avoid duplicates
export const filterSearch = (data) => {

    //Filter out unwanted/unnecessary results by location classes
    data = data.filter(res => {
        return res.class !== "building" && res.class !== "highway" //&& res.class !== "boundary" 
                && res.class !== "landuse" && res.class !== "leisure" && res.class !== "tourism"
                && res.class !== "amenity" && res.class !== "waterway" && res.class !== "shop"
    })

    //Filter out duplicates
    data = data.filter((value, index, self) => 
        self.findIndex(t => 
            t.address.display_name_1.localeCompare(value.address.display_name_1) === 0 
            && t.address.display_name_2.localeCompare(value.address.display_name_2) === 0
        ) === index
    )
    return data;
}

//setSortedTravelSuggestions
//Sort suggestions data in TravelSuggestions component by forecast 
//If parameter sortByTemp is defined and true, data is sorted by highest average temperature.
//Otherwise, it is sorted by best predicted weather
export const setSortedTravelSuggestions = (data, sortByTemp) => {

    //Check if sortByTemp is defined and true
    if(sortByTemp){

        //If yes, sort on temperature
        data = data.sort((a, b) => {

            //Find average temperatures of first sorting param
            let fridayA = (a.weather_data.friday.min_temperature + a.weather_data.friday.max_temperature) / 2
            let saturdayA = (a.weather_data.saturday.min_temperature + a.weather_data.saturday.max_temperature) / 2
            let sundayA = (a.weather_data.sunday.min_temperature + a.weather_data.sunday.max_temperature) / 2
            let avgA = (fridayA + saturdayA + sundayA) / 3;

            //Find average temperatures of second sorting param
            let fridayB = (b.weather_data.friday.min_temperature + b.weather_data.friday.max_temperature) / 2
            let saturdayB = (b.weather_data.saturday.min_temperature + b.weather_data.saturday.max_temperature) / 2
            let sundayB = (b.weather_data.sunday.min_temperature + b.weather_data.sunday.max_temperature) / 2
            let avgB = (fridayB + saturdayB + sundayB) / 3;

            //Compare and return result
            return avgB - avgA;
        })

    } else{

        //If sortByTemp is undefined || false, compare summary property to sort according to weather
        data = data.sort((a, b) => {
            return a.weather_data.summary > b.weather_data.summary ? -1 : 1;
        })
    }

    return data;
}

//getWeekendString
//Generate formatted string to show next weekend
export const getNextWeekendString = () => {
    const nextWeekendDate = new Date();
    nextWeekendDate.setDate(nextWeekendDate.getDate() + (7 + 5 - nextWeekendDate.getDay()) % 7);
    nextWeekendDate.setMinutes(nextWeekendDate.getTimezoneOffset());

    const firstDate = nextWeekendDate.getDate();
    const firstMonth = nextWeekendDate.toLocaleString('nb-NO', { month: 'long' });
    const firstYear = nextWeekendDate.getFullYear();
    nextWeekendDate.setDate(nextWeekendDate.getDate() + 2);

    const lastDate = nextWeekendDate.getDate();
    const lastMonth = nextWeekendDate.toLocaleString('nb-NO', { month: 'long' });
    const lastYear = nextWeekendDate.getFullYear();

    let dateString = "";

    if(firstMonth === lastMonth && firstYear === lastYear){
        dateString = firstDate + ".-" + lastDate + ". " 
                    + firstMonth.charAt(0).toUpperCase() + firstMonth.slice(1) + " " + firstYear;
    } else{
        if(firstYear === lastYear)
            dateString = firstDate + ". " + firstMonth + " - " + lastDate + ". " + lastMonth + " " + firstYear;
        else
            dateString = firstDate + ". " + firstMonth + " " + firstYear + " - " 
                        + lastDate + ". " + lastMonth + " " + lastYear;
    }
    return dateString;
}

//extractWeatherData
//Used to extract data from the complex JSON objects from forecast API into simpler objects for use in UI
//Extract data from current forecast, in the next 6 hours and in the next 12 hours
export const extractWeatherData = (weatherData) => {

    //declare starting object
    const body = {
    };

    //declare starting date object
    var date = new Date();

    //declare time variable
    let type = 'current';

    //declare new date object; set time to current and round off to nearest hour
    var currentDate = new Date(date.getTime());
    currentDate.setHours(date.getHours() + Math.round(date.getMinutes()/60));
    currentDate.setMinutes(0, 0, 0);
    currentDate.setMinutes(currentDate.getTimezoneOffset());

    //Iterate timeseries in weatherData object
    for(let i = 0; i < weatherData.timeseries.length; i++){

        //Move date to next time
        date = new Date(weatherData.timeseries[i].time);

        //Adjust to current time zone
        date.setMinutes(currentDate.getTimezoneOffset());

        //Check if date and time matches current timeseries
        if(currentDate.getTime() === date.getTime()){

            //If yes, fetch weather data
            body[type] = {
                temperature: weatherData.timeseries[i].data.instant.details.air_temperature,
                icon: weatherData.timeseries[i].data.next_1_hours.summary.symbol_code
            };

            //Check if type is next_12_hours
            if(type === 'next_12_hours'){

                //If yes, leave loop
                break;
            }else{

                //If no, move time forward
                type = type === 'current' ? 'next_6_hours' : 'next_12_hours';
                currentDate.setHours(currentDate.getHours() + 6);
            }
        } 
    }

    //return object
    return body;
}

//extractWeatherData
//Used to extract data from the complex JSON objects from forecast API into simpler objects for use in UI
//If getNextWeekend is defined and true, weather data from next weekend should be extracted
export const extractWeatherDataForWeekend = (weatherData) => {

    //declare starting object
    const body = {
    };

    //declare starting date object
    var date = new Date();

    //declare day variable
    let day = 'friday';

    //declare variables to count weather types
    let clearsky = 0, partlycloudy = 0, cloudy = 0, rain = 0;

    //declare new date object; set to next occurring friday and round off to 12 AM
    var nextWeekendDate = date;
    nextWeekendDate.setDate(date.getDate() + (7 + 5 - date.getDay()) % 7);
    nextWeekendDate.setMinutes(nextWeekendDate.getTimezoneOffset());
    nextWeekendDate.setHours(12);
    nextWeekendDate.setMinutes(0, 0, 0);

    //Iterate timeseries in weatherData object
    for(let i = 0; i < weatherData.timeseries.length; i++){

        //Move date to next time
        date = new Date(weatherData.timeseries[i].time);

        //Adjust to current time zone
        date.setMinutes(nextWeekendDate.getTimezoneOffset());

        //Check if date and time matches current timeseries
        if(nextWeekendDate.getTime() === date.getTime()){

            //If yes, fetch weather data
            const {next_6_hours} = weatherData.timeseries[i].data;
            body[day] = {
                min_temperature: next_6_hours.details.air_temperature_min,
                max_temperature: next_6_hours.details.air_temperature_max,
                icon: next_6_hours.summary.symbol_code
            };

            //Count ocurrence of weather
            if(body[day].icon.includes("clearsky") || body[day].icon.includes('fair')) clearsky = clearsky + 1;
            else if(body[day].icon.includes("partlycloudy")) partlycloudy = partlycloudy + 1;
            else if(body[day].icon.includes("cloudy")) cloudy = cloudy + 1;
            else if(body[day].icon.includes("rain") || body[day].icon.includes("sleet")) rain = rain + 1;
                
            //Check if day is sunday (end of weekend)
            if(day === 'sunday'){

                //If yes, create a numeric summary of weather. This will be used to easily sort
                //Reset all occurrence counts
                //Leave loop
                body.summary = (clearsky * 7) + (partlycloudy * 5) + (cloudy * 3) + (rain * (-1));
                clearsky = 0; partlycloudy = 0; cloudy = 0; rain = 0;
                break;
            } else {

                //If no, move day forward
                day = day === 'friday' ? 'saturday' : 'sunday';
                nextWeekendDate.setDate(nextWeekendDate.getDate() + 1);
            }
        } 
    }

    //return object
    return body;
}