/*LOCATION HELPER HOOKS */

/*IMPORTS */
/*React module dependencies */
import { useState } from "react";

/*IMPORTS END */

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
                else if(address.boundary)
                    place = address.boundary;
                else if(address.highway)
                    place = address.highway;
                else if(address.place)
                    place = address.place;
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
        return res.class !== "building" //&& res.class !== "highway" && res.class !== "boundary" 
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
//Data is sorted by best predicted weather
export const setSortedTravelSuggestions = (data) => {

    //If sortByTemp is undefined || false, compare summary property to sort according to weather
    data = data.sort((a, b) => {
        return a.weather_data.summary > b.weather_data.summary ? -1 : 1;
    })
    
    return data.slice(0, 5);
}


//getWeekendString
//Generate formatted string to show next weekend
export const getNextWeekendString = () => {

    //Declare date object
    const nextWeekendDate = new Date();

    //Move date to next friday
    nextWeekendDate.setDate(nextWeekendDate.getDate() + (7 + 5 - nextWeekendDate.getDay()) % 7);
    nextWeekendDate.setMinutes(nextWeekendDate.getTimezoneOffset());

    //Declare variables for day of month, month and year of next friday
    const firstDate = nextWeekendDate.getDate();
    const firstMonth = nextWeekendDate.toLocaleString('nb-NO', { month: 'long' });
    const firstYear = nextWeekendDate.getFullYear();

    //Move date two days forward (next sunday)
    nextWeekendDate.setDate(nextWeekendDate.getDate() + 2);

    //Declare variables for day of month, month and year of next sunday
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



//useCountdownTimer function
//Exports functionality to initialize and use a timer which will count down
//  - param time: used to decide length of time that timer will use to count down to 0
//  - Returns start/reset timer function, stop/clear timer function, and boolean to indicate if timer has completed countdown
export const useCountdownTimer = (time) => {

    //Declare states for time and interval
    const [timeUntilSearch, setTimeUntilSearch] = useState(time);
    const [interval, setCustInterval] = useState();

    //startOrResetTimer function
    //Used to start or reset timer
    const startOrResetTimer = () => {

        if(interval){

            //If interval is set, it means that timer is already started; timer is then reset
            setTimeUntilSearch(prev => time)
        } else {

            //Otherwise interval is initialized
            setCustInterval(setInterval(() => {
                setTimeUntilSearch(prev => {
                    if (prev > 0) {
                        return prev - 1;
                    }  
                })
            }, 1000));
        }
    }

    //stopAndClearTimer function
    //Used to stop and clear timer
    const stopAndClearTimer = () => {

        //Interval is cleared
        setCustInterval(prev => {
            clearInterval(interval);
            return undefined;
        })

        //Time is reset
        setTimeUntilSearch(prev => time);
    }

    //isComplete property
    //Exported to allow component to check if timer has completed countdown
    const isComplete = interval && timeUntilSearch === 0;

    return {
        startOrResetTimer,
        stopAndClearTimer,
        isComplete
    }
}