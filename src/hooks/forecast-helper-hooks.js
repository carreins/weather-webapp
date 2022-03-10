/*FORECAST HELPER METHODS */


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
//A property /summary/ is also inserted to maintain a weather score. This is becausew the
//  method will mainly be used to display sorted results for travel suggestions
export const extractWeatherDataForWeekend = (weatherData) => {

    //declare starting object
    const body = {
    };

    //declare starting date object
    var date = new Date();

    //declare day variable
    let day = 'friday';

    //declare variables to count weather types
    let clearsky = 0, fair = 0, partlycloudy = 0, cloudy = 0, rain = 0;

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
            if(body[day].icon.includes("clearsky")) clearsky = clearsky + 1;
            else if(body[day].icon.includes('fair')) fair = fair + 1;
            else if(body[day].icon.includes("partlycloudy")) partlycloudy = partlycloudy + 1;
            else if(body[day].icon.includes("cloudy")) cloudy = cloudy + 1;
            else if(body[day].icon.includes("rain") || body[day].icon.includes("sleet")) rain = rain + 1;
                
            //Check if day is sunday (end of weekend)
            if(day === 'sunday'){

                //If yes, create a numeric summary of weather. This will be used to easily sort
                //Reset all occurrence counts
                //Leave loop
                body.summary = (clearsky * 7) + (fair * 6) + (partlycloudy * 5) + (cloudy * 3) + (rain * (-1));
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

export const extractWeatherDataForWeek = (weatherData) => {

    //declare starting object
    const body = {
    };

    //declare starting date object
    var date = new Date();

    //declare new date object; set to tomorrow and round off to 12 AM
    var nextDate = date;
    nextDate.setDate(date.getDate() + 1);
    nextDate.setMinutes(nextDate.getTimezoneOffset());
    nextDate.setHours(12);
    nextDate.setMinutes(0, 0, 0);

    let day = "I morgen"; 
    let daysFound = 0;

    //Iterate timeseries in weatherData object
     for(let i = 0; i < weatherData.timeseries.length; i++){

        //Move date to next time
        date = new Date(weatherData.timeseries[i].time);

        //Adjust to current time zone
        date.setMinutes(nextDate.getTimezoneOffset());

        //Check if date and time matches current timeseries
        if(nextDate.getTime() === date.getTime()){

            //If yes, fetch weather data
            const {next_6_hours} = weatherData.timeseries[i].data;
            body[day] = {
                min_temperature: next_6_hours.details.air_temperature_min,
                max_temperature: next_6_hours.details.air_temperature_max,
                icon: next_6_hours.summary.symbol_code
            };

            daysFound++;

            //Check if all week data is found 
            if(daysFound === 7){

                //If yes, leave loop
                break;
            } else {

                //If no, move day forward
                nextDate.setDate(nextDate.getDate() + 1);
                day = nextDate.toLocaleDateString("nb-NO", { weekday: 'long' });
                day = day.charAt(0).toUpperCase() + day.slice(1);
            }
        } 
    }

    //return object
    return body;
}