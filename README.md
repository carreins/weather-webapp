# About this project

This is a simplified web application, created to demonstrate various capabilities of the ReactJS library, such as use of
states and HTTP communication, as well as the possibility of creating custom hooks and components for usage in a web 
application.

This demo web application is specifically made for weather reporting, with three main functions/pages:

1.  Show the weather forecast of the user's current location.
2.  Allow the user to search locations by name; it is possible to click a search result to show further details about the weather forecast. The searhc is limited to results within Norway.
3.  Show five suggestions for travelling in Norway, based on forecast of next weekend. Suggestions are based off a list of the 10 biggest cities/towns in Norway: https://hovedsteder.no/norges-storste-byer.htm

The project utilizes open source APIs, which require no registrations, keys or secrets:
- [Nominatim API for OpenStreetMap.org](https://nominatim.org/release-docs/develop/api/Overview/)
- [Forecast API for Norwegian Institute of Meteorology](https://api.met.no/weatherapi/locationforecast/2.0)

Simply run the project, and these APIs will be accessible.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

