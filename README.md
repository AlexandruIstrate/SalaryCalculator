# Salary Calculator
[![Deploy to GitHub Pages](https://github.com/AlexandruIstrate/SalaryCalculator/actions/workflows/publish-website.yml/badge.svg)](https://github.com/AlexandruIstrate/SalaryCalculator/actions/workflows/publish-website.yml)

This is a [Salary Calculator App](https://alexandruistrate.github.io/SalaryCalculator) that allows the user to convert between the cost of living between two countries using the PPP index.

![App Screenshot](branding/react-app.png)

## Explaining the PPP Index
The [PPP index](https://en.wikipedia.org/wiki/Purchasing_power_parity) is a measure of the relative cost of living between two countries. It is calculated by comparing the prices of a basket of goods and services in each country. The PPP index is used to compare the standard of living between countries, as it takes into account the differences in the cost of living. For example, a country with a high PPP index has a higher cost of living than a country with a low PPP index.

> Example 1: If the PPP index of Country A is 1.5 and the PPP index of Country B is 1, then the cost of living in Country A is 1.5 times higher than the cost of living in Country B.

> Example 2: If your salary in Germany is € 50,000 and the PPP index of Germany is 1.5, then your equivalent salary in Romania (with a PPP index of 1) would be € 33,333 (50,000 / 1.5).

## Features
- Conversion between two standards of living using PPP data from the [World Bank API](https://documents.worldbank.org/en/publication/documents-reports/api)
- Conversion history with up to 10 entries
- Ability to share a conversion link with others
- Data persistence between sessions using browser storage
- [Multi-language support](#supported-languages)
- Dark mode

## Supported Languages
This app is currently available in the following languages:
| Language | Variant       | ISO 639-1 Code |
|----------|---------------|----------------|
| English  | International | en             |
| French   | International | fr             |
| German   | Germany       | de             |
| Spanish  | International | es             |
| Italian  | Italy         | it             |
| Romanian | Romania       | ro             |

The next languages we are looking to add are:
- Chinese (Simplified)
- Chinese (Traditional)
- Japanese
- Korean
- Hebrew

We are always looking to add more languages to the app. If you would like to contribute a translation, please see the [Contributing](#contributing) section.

## Technologies
- [React](https://reactjs.org/): A JavaScript library for building user interfaces
- [Bootstrap](https://getbootstrap.com/): Used for styling the app
- [React-Bootstrap](https://react-bootstrap.github.io/): React components for Bootstrap
- [React-Router](https://reactrouter.com/): Used to handle routing in the app
- [i18next](https://www.i18next.com/): Used for internationalization
- [i18n-iso-countries](https://github.com/michaelwittig/node-i18n-iso-countries/): Used to get country names in different languages
- [Countries List](https://annexare.github.io/Countries/): Used to get country data
- [Country Flag Emoji Polyfill](https://github.com/talkjs/country-flag-emoji-polyfill/): Used to fix country flag emojis on Windows and other platforms that don't support them natively
- [Axios](https://axios-http.com/): Used to make HTTP requests to the World Bank API
- [Axios Cache Interceptor](https://axios-cache-interceptor.js.org/): Used to cache API requests and provide faster responses
- [Lodash](https://lodash.com/): Used for utility functions

## Running the App
To run the app, you need to have [Node.js](https://nodejs.org/) installed. Then, you can run the following commands in your terminal of choice to run the app locally:
```bash
# Clone the repository
git clone https://github.com/AlexandruIstrate/SalaryCalculator

# Navigate to the project folder
cd SalaryCalculator/salary-calc

# Create a copy of the .env file
cp .env.example .env

# Install the dependencies
npm install

# Run the app
npm start
```

## Contributing
One of the main goals of this project is to provide translations for as many languages as possible. If you would like to contribute a translation, please follow these steps:
1. Fork the repository
2. Create a new branch
3. Create a new folder in the `public/locales` folder with the ISO 639-1 code for the language (e.g. `fr` for French)
4. Add a new JSON file in the folder named `translation.json`
5. Add the translations for each key found in the `public/locales/translation.json` file
6. Add the language to the `src/i18n.js` file, in the `supportedLngs` object. Make sure to use the ISO 639-1 code for the language and to set the proper `flagCountryCode`
7. Create a pull request

As many of these languages aren't spoken by the maintainers, we can't guarantee the quality of the translations. If you see any mistakes, please feel free to open an issue or a pull request.

If you would like to contribute in other ways, please feel free to open an issue or a pull request.
