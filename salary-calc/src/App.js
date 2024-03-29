import React, { useState, useEffect, useReducer, useContext } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import Select from "react-select";

import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { countries } from "countries-list";
import { registerLocale, getName as getLocalCountryName } from "i18n-iso-countries";
import { isEqual } from "lodash";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";

import NewTabLink from "src/components/NewTabLink";
import FlagDisplay from "src/components/FlagDisplay";
import NavbarContent from "src/components/NavbarContent";
import FooterContent from "src/components/FooterContent";

import { WorldBankAPI } from "src/api/WorldBankAPI";
import { LocalStorage } from "src/utils/LocalStorage";

import { supportedLngs } from "src/i18n";
import { ThemeContext, } from 'src/themes/ThemeContext';
import { lightTheme, darkTheme } from 'src/themes/Themes';

import "./App.css";

// Load country flag emojis to fix missing flags on certain platforms
polyfillCountryFlagEmojis();

function Jumbotron({ title, subtitle, theme = null }) {
    return (
        <Container className={`jumbotron p-5 mb-4 rounded-3 ${theme.bgTertiary}`}>
            <Container className="container-fluid py-2 py-md-5">
                <h1 className="display-5 fw-bold">{title}</h1>
                <p className="col-md-8 fs-4">{subtitle}</p>
            </Container>
        </Container>
    )
}

function CountrySelect({ i18n, country, pppData, onChange, theme = null, isLoading = false }) {
    // A function to handle the creation of individual country items
    const createSelectItem = (countryCode) => {
        return (
            <FlagDisplay
                countryCode={countryCode}
                text={getLocalCountryName(countryCode, i18n.resolvedLanguage)}
            />
        );
    }

    // A function to handle searching for values
    const searchFunc = (option, searchText) => {
        // Check that we actually got a search string
        if (!searchText || searchText.length === 0) {
            // No search string means accept any option
            return true;
        }

        // Get the country
        const country = option.data;

        // Get the English name of the country and the native language name
        const enName = country.countryName;
        const nativeName = getLocalCountryName(country.countryCode, i18n.resolvedLanguage);

        // Get a localized, lowercase version of the search term
        const locSearch = searchText.toLocaleLowerCase(i18n.resolvedLanguage);

        // Check whether the search text matches any of the two names
        const enMatch = enName
            .toLowerCase()
            .startsWith(locSearch);

        const nativeMatch = nativeName
            .toLocaleLowerCase(i18n.resolvedLanguage)
            .startsWith(locSearch);

        // Check either condition
        return enMatch || nativeMatch;
    }

    // Return the component
    return (
        <Select
            options={Object.values(pppData)}
            value={pppData[country]}
            onChange={onChange}
            isLoading={isLoading}
            isDisabled={isLoading}
            getOptionValue={op => op.countryCode}
            formatOptionLabel={op => createSelectItem(op.countryCode)}
            filterOption={searchFunc}
            styles={theme?.countrySelStyle ?? {}}
        />
    );
}

function HistoryContent({ historyItems, onClick }) {
    // Check if we have no data
    if (!historyItems || historyItems.length === 0) {
        // Return a no-data message
        return (
            <ListGroup.Item>You'll see your history here after you make a conversion</ListGroup.Item>
        );
    } else {
        // Return normal content
        return historyItems.map(({ source, destination }, index) =>
            <ListGroup.Item
                key={index}
                action={true}
                onClick={() => onClick({ source, destination })}
            >
                <Trans
                    i18nKey="history.item"
                    components={[
                        <FlagDisplay
                            countryCode={source.countryCode}
                            text={source.currency}
                        />,
                        <FlagDisplay
                            countryCode={destination.countryCode}
                            text={destination.currency}
                        />
                    ]}
                />
            </ListGroup.Item>
        );
    }
}

function ToastNotification({ i18n, title, body, show, onClose }) {
    return (
        <ToastContainer
            className="p-3"
            position={i18n.dir(i18n.resolvedLanguage) === "rtl" ? "bottom-start" : "bottom-end"}
            style={{ zIndex: 1 }}
        >
            <Toast
                show={show}
                onClose={onClose}
                autohide={true}
                delay={5000}
            >
                <Toast.Header closeButton={true}>
                    <strong className="me-auto">{title}</strong>
                </Toast.Header>
                <Toast.Body>{body}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

function App() {
    // App State
    const [salary, setSalary] = useState(LocalStorage.salary ?? 0);
    const [sourceCountry, setSourceCountry] = useState(LocalStorage.sourceCountry ?? process.env.REACT_APP_DEFAULT_SOURCE_COUNTRY_CODE);
    const [destinationCountry, setDestinationCountry] = useState(LocalStorage.destinationCountry ?? process.env.REACT_APP_DEFAULT_DESTINATION_COUNTRY_CODE);

    const [isLoading, setIsLoading] = useState(true);
    const [pppData, setPPPData] = useState(null);

    const [themePref, setThemePref] = useState(LocalStorage.theme ?? "auto");
    const { theme, setTheme } = useContext(ThemeContext);

    // Navigation
    const location = useLocation();
    const navigate = useNavigate();

    // Translation
    const { t, i18n } = useTranslation();

    // Translated components
    const CountrySelectWrapped = withTranslation()(CountrySelect);
    const HistoryContentWrapped = withTranslation()(HistoryContent);
    const ToastNotificationWrapped = withTranslation()(ToastNotification);

    // History Reducer
    const historyReducer = (state, action) => {
        // Get the relevant data
        const newItem = action.newItem;
        const history = state.historyItems;

        // Check that we got a new item for this action
        if (newItem) {
            // Check whether the item alreay exists
            if (history.some(item => isEqual(item, newItem))) {
                // Get the index of the item
                const itemIndex = history.findIndex(el => isEqual(el, newItem));

                // Shift the new item to the top
                history.splice(itemIndex, 1);
                history.unshift(newItem);

                // Return the newly ordered array
                return {
                    historyItems: history
                };
            }

            // Check whether we have reached the history limit
            if (history.length === parseInt(process.env.REACT_APP_CONVERSION_HISTORY_LIMIT)) {
                // Add the history item at the top again
                const withTop = [newItem].concat(history);

                // Remove the last item
                withTop.pop();

                // Return the new array
                return {
                    historyItems: withTop
                };
            }

            // Merge the existing array with the new item
            return {
                historyItems: [newItem].concat(history)
            };
        }

        throw Error("No new value provided for history");
    };

    const [history, historyDispatch] = useReducer(historyReducer, LocalStorage.history ?? { historyItems: [] });

    // Popup reducer for toasts and modals
    const popupReducer = (state, action) => {
        // Get the relevant data
        const showCopyResult = action.showCopyResult;
        const showCopyLink = action.showCopyLink;

        // Store the result here
        var result = {
            showCopyResult: false,
            showCopyLink: false
        };

        // Check that we have to show the copy result
        if (showCopyResult) {
            // Activate the relevant property
            result["showCopyResult"] = true;
        }

        // Check that we have to show the copy link
        if (showCopyLink) {
            // Activate the relevant property
            result["showCopyLink"] = true;
        }

        return result;
    };

    const [popups, popupDispatcher] = useReducer(popupReducer, { showCopyResult: false, showCopyLink: false });

    // Load World Bank Data
    useEffect(() => {
        // Get the current year
        const year = new Date().getFullYear();

        // Call the World Bank API
        WorldBankAPI
            .getPPPData(year - 5, year)
            .then((value) => {
                // Process the data
                const processed = value[1]
                    .filter(x => x.value != null)
                    .map(x => {
                        // Get the country object
                        const country = countries[x.country.id];

                        // Return a nice object with all the important info about a country
                        return {
                            countryCode: x.country.id,
                            countryName: country?.name ?? x.country.value,
                            currency: country?.currency?.split(",")[0],
                            emoji: country?.emoji,
                            date: x.date,
                            ppp: x.value
                        }
                    })
                    .reduce((acc, item) => {
                        const countryCode = item.countryCode;
                        const currentYear = parseInt(item.date);

                        // Check if the current item has a later year than the stored latest year for the country
                        if (!acc[countryCode] || currentYear > parseInt(acc[countryCode].date)) {
                            acc[countryCode] = item;
                        }

                        return acc;
                    }, {});

                // Store the PPP data
                setPPPData(processed);
            })
            .finally(() => {
                // Always clear the loading state at the end
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update state based on URL on mount
    useEffect(() => {
        updateStateAndURL();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update state on URL change
    useEffect(() => {
        updateStateAndURL();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    // Add to history on change of source or destination
    useEffect(() => {
        // Make sure we have loaded the PPP data
        if (pppData) {
            // Remember this conversion in the history
            historyDispatch({
                newItem: {
                    source: pppData[sourceCountry],
                    destination: pppData[destinationCountry]
                }
            });
        }
    }, [sourceCountry, destinationCountry, pppData]);

    // Save form state to local storage
    useEffect(() => {
        // Store all the form variables
        LocalStorage.sourceCountry = sourceCountry;
        LocalStorage.destinationCountry = destinationCountry;
        LocalStorage.salary = salary;
        LocalStorage.history = history;
    }, [sourceCountry, destinationCountry, salary, history]);

    // Set the page language and reading direction on language change
    useEffect(() => {
        // Make sure that we have a valid language
        if (i18n.resolvedLanguage) {
            // Set the lang attribute on the HTML
            document.documentElement.lang = i18n.resolvedLanguage;

            // Set the direction attribute on the HTML
            document.documentElement.dir = i18n.dir(i18n.resolvedLanguage);
        }

        // Localize the document title
        document.title = t("page.title");
    }, [i18n, i18n.resolvedLanguage, t])

    // Set a media query for when the user changes the system theme
    const systemPrefersDark = useMediaQuery({
        query: "(prefers-color-scheme: dark)"
    });

    // Detect when the theme preference is changed by either the system or the user
    useEffect(() => {
        // First, make sure we remember this setting across sessions
        LocalStorage.theme = themePref;

        // Store the theme here
        var selectedTheme = "light";

        // Check if we have the preference set to auto
        if (themePref === "auto") {
            // Set the theme based on what the user prefers
            selectedTheme = systemPrefersDark ? "dark" : "light";
        } else {
            // Set the theme from the manual user preference
            selectedTheme = themePref;
        }

        // Set the theme state variable
        setTheme(selectedTheme === "light" ? lightTheme : darkTheme);
    }, [systemPrefersDark, themePref, setTheme])

    // Set the actual theme whenever the theme preference changes
    useEffect(() => {
        // Set the theme attribute on the HTML element
        document.documentElement.setAttribute("data-bs-theme", theme.bsTheme);

        // Set the meta theme color for mobile devices
        const metaThemeColor = document.querySelector("meta[name=theme-color]");
        metaThemeColor.content = theme.metaThemeColor;
    }, [theme]);

    // Event Handlers

    const handleChangeSalary = (e) => {
        // Set the new value
        const newValue = e.target.value;

        // Set the new value
        setSalary(newValue);

        // Update the URL
        updateURLFromState(sourceCountry, destinationCountry, newValue);
    }

    const handleChangeSource = (e) => {
        // Get the new value
        var newValue = e.countryCode;

        // Make sure the user can't set the same source and destination
        if (newValue === destinationCountry) {
            // Set the old value back
            setSourceCountry(newValue);

            // Make sure to modify the temp value
            newValue = sourceCountry;

            // Swap the two countries
            swapCountries();
        } else {
            // Set the new value
            setSourceCountry(newValue);
        }

        // Update the URL
        updateURLFromState(newValue, destinationCountry, salary);
    }

    const handleChangeDestination = (e) => {
        // Get the new value
        var newValue = e.countryCode;

        // Make sure the user can't set the same source and destination
        if (newValue === sourceCountry) {
            // Set the old value back
            setDestinationCountry(newValue);

            // Make sure to modify the temp value
            newValue = destinationCountry;

            // Swap the two countries
            swapCountries();
        } else {
            // Set the new value
            setDestinationCountry(newValue);
        }

        // Update the URL
        updateURLFromState(sourceCountry, newValue, salary);
    }

    const handleCopyResult = () => {
        // Calculate the result
        const result = calculateSalary();

        // Convert the result to a format that is easier to read and in the current locale
        const formattedResult = Math.round(result).toLocaleString(i18n.resolvedLanguage, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });

        // Copy the result to the clipboard
        navigator.clipboard.writeText(formattedResult);

        // Show the toast indicating that the action was successful
        popupDispatcher({
            showCopyResult: true
        });
    }

    const handleReverseCountries = () => {
        // Call the utility function
        swapCountries();

        // Update the URL
        updateURLFromState(destinationCountry, sourceCountry, salary);
    }

    const handleCopyLink = () => {
        // Make sure that the link is up to date with the newest values
        updateURLFromState();

        // Copy the URL to the clipboard
        navigator.clipboard.writeText(window.location.href);

        // Show the toast indicating that the action was successful
        popupDispatcher({
            showCopyLink: true
        });
    }

    const handlePostOnX = () => {
        // Make sure that the link is up to date with the newest values
        updateURLFromState();

        // Get the URL
        const url = window.location.href;

        // Get the text with URL included
        const text = getSocialPostText(url);

        // Create the URL with the text
        const encodedURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

        // Open the link
        window.open(encodedURL, "_blank");
    }

    const handleSendOnWhatsApp = () => {
        // Make sure that the link is up to date with the newest values
        updateURLFromState();

        // Get the URL
        const url = window.location.href;

        // Get the text with the URL in it
        const text = getSocialPostText(url);

        // Create the URL with the text
        const encodedURL = `https://wa.me/?text=${encodeURIComponent(text)}`;

        // Open the link
        window.open(encodedURL, "_blank");
    }

    const handleSendOnTelegram = () => {
        // Make sure that the link is up to date with the newest values
        updateURLFromState();

        // Get the URL
        const url = window.location.href;

        // Get the text
        const text = getSocialPostText();

        // Create the URL with the text
        const encodedURL = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

        // Open the link
        window.open(encodedURL, "_blank");
    }

    const handleHistoryItemClicked = (e) => {
        // Set the source and destionation using the given data
        setSourceCountry(e.source.countryCode);
        setDestinationCountry(e.destination.countryCode);

        // Update the URL
        updateURLFromState(e.source.countryCode, e.destination.countryCode, salary);
    }

    // Utility functions

    const calculateSalary = () => {
        // Get PPP data for the selected countries
        const source = pppData[sourceCountry];
        const dest = pppData[destinationCountry];

        // Calculate the target amount
        const targetAmount = parseInt(salary) / source.ppp * dest.ppp;

        // Return the resulting value
        return targetAmount;
    }

    const swapCountries = () => {
        // Get the new value
        const temp = destinationCountry;

        // Swap the values
        setDestinationCountry(sourceCountry);
        setSourceCountry(temp);
    }

    const updateStateAndURL = () => {
        // Get the search parameters
        const queryParams = new URLSearchParams(location.search);

        // Store the values here
        var newSource = queryParams.get("source");
        var newDest = queryParams.get("dest");
        var newSalary = queryParams.get("salary");

        // Update state based on URL parameters if we have them
        if (newSource) {
            setSourceCountry(newSource);
        }

        if (newDest) {
            setDestinationCountry(newDest);
        }

        if (newSalary) {
            setSalary(newSalary);
        }
    }

    const updateURLFromState = (source = null, dest = null, newSalary = null) => {
        // Update the URL parameters
        const queryParams = new URLSearchParams();
        queryParams.set("source", source ?? sourceCountry);
        queryParams.set("dest", dest ?? destinationCountry);
        queryParams.set("salary", newSalary ?? salary);

        // Update URL without refreshing the page
        navigate(`?${queryParams.toString()}`);
    }

    const getSocialPostText = (url = null) => {
        // Get the destination and source
        const source = pppData[sourceCountry];
        const dest = pppData[destinationCountry];

        // Create the friendly text
        const friendlyText = t("calculator.output.friendlyDescription", {
            destSalary: salary,
            destCurrency: dest.currency,
            destCountry: getLocalCountryName(destinationCountry, i18n.resolvedLanguage),
            sourceSalary: Math.round(calculateSalary()),
            sourceCurrency: source.currency,
            sourceCountry: getLocalCountryName(sourceCountry, i18n.resolvedLanguage)
        });

        // Return the final text
        if (url) {
            // Text and URL
            return friendlyText + "\n\n" + url;
        } else {
            // Text only
            return friendlyText;
        }
    }

    const loadCountryNameTranslations = () => {
        // Go through each supported country
        for (const langCode of Object.keys(supportedLngs)) {
            // Load the required file with country names
            registerLocale(require(`i18n-iso-countries/langs/${langCode}.json`))
        }
    }

    // Load country name translation files based on the supported languages
    loadCountryNameTranslations();

    // Sharing options
    const sharingOptions = [
        {
            iconName: "bi-link-45deg",
            i18nKey: "calculator.buttons.share.copyLink",
            handler: handleCopyLink
        },
        {
            iconName: "bi-twitter-x",
            i18nKey: "calculator.buttons.share.postX",
            handler: handlePostOnX
        },
        {
            iconName: "bi-whatsapp",
            i18nKey: "calculator.buttons.share.sendWhatsApp",
            handler: handleSendOnWhatsApp
        },
        {
            iconName: "bi-telegram",
            i18nKey: "calculator.buttons.share.sendTelegram",
            handler: handleSendOnTelegram
        }
    ];

    // Main HTML body rendering
    return (
        <div className="app">
            {/* Development Build Banner */}
            {process.env.NODE_ENV === "development" ? (
                <div className="banner-dev-env text-center bg-warning text-dark p-2">
                    <b>{t("banner", "Development Build")}</b>
                </div>
            ) : (
                null
            )}

            {/* App Header */}
            <header id="app-header">
                <NavbarContent
                    themePref={themePref}
                    setThemePref={setThemePref}
                />
            </header>

            {/* Main Content */}
            <main id="app-main-content">
                <Container className="content p-3">
                    <Jumbotron
                        title={t("jumbotron.title")}
                        subtitle={t("jumbotron.subtitle")}
                        theme={theme}
                    />
                    <Container className="mb-5">
                        {/* {renderCalculatorArea()} */}
                        <Row>
                            {/* Calculator Column */}
                            <Col xs={12} md={8} lg={9}>
                                <Form>
                                    {/* Source Country */}
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formSourceCountry"
                                    >
                                        <Form.Label>{t("calculator.source")}</Form.Label>
                                        <CountrySelectWrapped
                                            id="destSource"
                                            country={sourceCountry}
                                            pppData={isLoading ? [] : pppData}
                                            onChange={handleChangeSource}
                                            theme={theme}
                                            isLoading={isLoading}
                                        />
                                    </Form.Group>

                                    {/* Input Salary */}
                                    <Form.Label>
                                        {t("calculator.salary.label", { country: isLoading ? "Source" : pppData[sourceCountry].countryName })}
                                    </Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            id="salaryInput"
                                            type="number"
                                            inputMode="decimal"
                                            value={salary}
                                            min={0}
                                            placeholder={t("calculator.salary.placeholder")}
                                            onChange={handleChangeSalary}
                                            disabled={isLoading}
                                        />
                                        <InputGroup.Text>{isLoading ? "USD" : pppData[sourceCountry].currency}</InputGroup.Text>
                                    </InputGroup>

                                    {/* Destination Country */}
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formDestinationCountry"
                                    >
                                        <Form.Label>{t("calculator.destination")}</Form.Label>
                                        <CountrySelectWrapped
                                            id="destSelect"
                                            country={destinationCountry}
                                            pppData={isLoading ? [] : pppData}
                                            onChange={handleChangeDestination}
                                            theme={theme}
                                            isLoading={isLoading}
                                        />
                                    </Form.Group>

                                    {/* Output Salary */}
                                    <Form.Label>{t("calculator.output.label")}</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            id="salaryResult"
                                            type="text"
                                            value={isLoading ? 0 : Math.round(calculateSalary()).toLocaleString(i18n.resolvedLanguage, {
                                                minimumFractionDigits: 1,
                                                maximumFractionDigits: 1
                                            })}
                                            placeholder={t("calculator.output.placeholder")}
                                            readOnly={true}
                                        />
                                        <InputGroup.Text>
                                            {isLoading ? "USD" : pppData[destinationCountry].currency}
                                        </InputGroup.Text>
                                    </InputGroup>

                                    {/* Data Source Info */}
                                    <div className="mb-3">
                                        <Form.Text muted>
                                            {t("calculator.disclaimer", { year: isLoading ? new Date().getFullYear() : pppData[destinationCountry].date })}
                                        </Form.Text>
                                    </div>

                                    <div className="mb-3">
                                        {/* Copy Result Button */}
                                        <Button
                                            variant="secondary"
                                            onClick={handleCopyResult}
                                            disabled={isLoading}
                                            className="me-2 mb-2"
                                        >
                                            <i className="bi bi-copy me-1" />&nbsp;
                                            {t("calculator.buttons.copyResult")}
                                        </Button>

                                        {/* Reverse Countries Button */}
                                        <Button
                                            variant="secondary"
                                            onClick={handleReverseCountries}
                                            disabled={isLoading}
                                            className="me-2 mb-2"
                                        >
                                            <i className="bi bi-arrow-left-right me-1" />&nbsp;
                                            {t("calculator.buttons.reverse")}
                                        </Button>

                                        {/* Sharing Options Button */}
                                        <DropdownButton
                                            as={ButtonGroup}
                                            disabled={isLoading}
                                            id="dropdownShare"
                                            variant="success"
                                            title={
                                                <span>
                                                    <i className="bi bi-share me-1" />&nbsp;
                                                    {t("calculator.buttons.share.title")}
                                                </span>}
                                            className="me-2 mb-2"
                                        >
                                            {/* Display the sharing options from the list */}
                                            {
                                                sharingOptions.map(({ iconName, i18nKey, handler }, index) =>
                                                    <Dropdown.Item
                                                        key={index}
                                                        onClick={handler}
                                                        // Make sure the menu item aligns properly when using RTL languages
                                                        className={i18n.dir(i18n.resolvedLanguage) === "rtl" ? "text-end" : null}
                                                    >
                                                        <i className={`bi ${iconName} me-1`} />&nbsp;
                                                        {t(i18nKey)}
                                                    </Dropdown.Item>
                                                )
                                            }
                                        </DropdownButton>
                                    </div>
                                </Form>
                            </Col>

                            {/* History Column */}
                            <Col xs={12} md={4} lg={3}>
                                <Card className="history-panel">
                                    <Card.Header>{t("history.title")}</Card.Header>
                                    <ListGroup variant="flush">
                                        <HistoryContentWrapped
                                            historyItems={history.historyItems}
                                            onClick={handleHistoryItemClicked}
                                        />
                                    </ListGroup>
                                </Card>

                                {/* Additional History Info */}
                                <div className="mb-3">
                                    <Form.Text muted>
                                        <Trans
                                            i18nKey="history.tip"
                                            components={[
                                                <strong />
                                            ]}
                                        />
                                    </Form.Text>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Container>
            </main>

            {/* Toast Messages Area */}
            <div
                aria-live="polite"
                aria-atomic={true}
                id="app-toast-area"
                className="bg-transparent position-relative"
            >
                {/* Copy Link Toast */}
                <ToastNotificationWrapped
                    title={t("toast.copyLink.title")}
                    body={t("toast.copyLink.body")}
                    show={popups.showCopyLink}
                    onClose={() => popupDispatcher({ showCopyLink: false })}
                />

                {/* Copy Result Toast */}
                <ToastNotificationWrapped
                    title={t("toast.copyResult.title")}
                    body={t("toast.copyResult.body")}
                    show={popups.showCopyResult}
                    onClose={() => popupDispatcher({ showCopyResult: false })}
                />
            </div>

            {/* Footer */}
            <footer
                id="app-footer"
                className={`footer font-small blue ${theme.bgTertiary} pt-4`}
            >
                {/* Footer Content */}
                <FooterContent id="footer-content" />

                {/* Copyright */}
                <div className="footer-copyright text-center py-3">
                    <Trans
                        i18nKey="footer.copyright"
                        values={{ year: new Date().getFullYear() }}
                        components={[
                            <NewTabLink
                                href="https://github.com/AlexandruIstrate"
                                title="Alex Istrate"
                            />
                        ]}
                    />
                </div>
            </footer>
        </div>
    );
}

export default App;
