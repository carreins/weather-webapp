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
    if(sortByTemp){
        data = data.sort((a, b) => {
            let fridayA = (a.weather_data.friday.min_temperature + a.weather_data.friday.max_temperature) / 2
            let saturdayA = (a.weather_data.saturday.min_temperature + a.weather_data.saturday.max_temperature) / 2
            let sundayA = (a.weather_data.sunday.min_temperature + a.weather_data.sunday.max_temperature) / 2
            let avgA = (fridayA + saturdayA + sundayA) / 3;
            let fridayB = (b.weather_data.friday.min_temperature + b.weather_data.friday.max_temperature) / 2
            let saturdayB = (b.weather_data.saturday.min_temperature + b.weather_data.saturday.max_temperature) / 2
            let sundayB = (b.weather_data.sunday.min_temperature + b.weather_data.sunday.max_temperature) / 2
            let avgB = (fridayB + saturdayB + sundayB) / 3;
            return avgB - avgA
        })
    } else{
        data = data.sort((a, b) => {
            return a.weather_data.summary > b.weather_data.summary ? -1 : 1;
        })
    }

    return data;
}

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