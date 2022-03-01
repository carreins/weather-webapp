
export const filterSearch = (data) => {
    data = data.filter(res => {
        return res.class !== "building" && res.class !== "highway" && res.class !== "boundary" 
                && res.class !== "landuse" && res.class !== "leisure" && res.class !== "tourism"
                && res.class !== "amenity" && res.class !== "waterway"
    })
    data = data.filter((value, index, self) => 
        self.findIndex(t => 
            t.address.display_name_1.localeCompare(value.address.display_name_1) === 0 
            && t.address.display_name_2.localeCompare(value.address.display_name_2) === 0
        ) === index
    )
    return data;
}

export const setDisplayName = (data) => {
    if(data && data.length > 0)
        for(let i = 0; i < data.length; i++){
            const {address} = data[i];
            let place = address.railway;
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
                place = place + " stasjon";
            }
            data[i].address.display_name_1 = (place ? place : '') + (place && (address.municipality || address.city) ? ', ' : '') 
                + (address.municipality ? address.municipality : (address.city ? address.city : ''));
            data[i].address.display_name_2 = address.county ? address.county : '';
        }
    return data;
}

export const setSortedTravelSuggestions = (data, sortByTemp) => {
    if(sortByTemp){
        data = data.sort((a, b) => {
            let mintempA = (a.weather_data.friday.min_temperature + 
                a.weather_data.saturday.min_temperature + 
                a.weather_data.sunday.min_temperature) / 3
            let mintempB = (b.weather_data.friday.min_temperature + 
                b.weather_data.saturday.min_temperature + 
                b.weather_data.sunday.min_temperature) / 3
            let maxtempA = (a.weather_data.friday.max_temperature + 
                        a.weather_data.saturday.max_temperature + 
                        a.weather_data.sunday.max_temperature) / 3
            let maxtempB = (b.weather_data.friday.max_temperature + 
                        b.weather_data.saturday.max_temperature + 
                        b.weather_data.sunday.max_temperature) / 3
            return maxtempA > maxtempB && (maxtempA - mintempA) > (maxtempB - mintempB) ? 1 : -1 
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