import React, { useState, useEffect, useReducer } from "react";

import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import Select from "react-select";

import { countries } from "countries-list";
import { isEqual } from "lodash";

import { WorldBankAPI } from "src/api/WorldBankAPI";

import "./App.css";

function Jumbotron({ title, subtitle }) {
    return (
        <Container className="p-5 mb-4 bg-light rounded-3">
            <Container className="container-fluid py-5">
                <h1 className="display-5 fw-bold">{title}</h1>
                <p className="col-md-8 fs-4">{subtitle}</p>
            </Container>
        </Container>
    )
}

function CountrySelect({ country, pppData, onChange, isLoading = false }) {
    return (
        <Select
            options={Object.values(pppData)}
            value={pppData[country]}
            onChange={onChange}
            isLoading={isLoading}
            getOptionValue={op => op.countryCode}
            getOptionLabel={op => `${op.emoji} ${op.countryName}`}
        />
    )
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
                {`${source.emoji} ${source.currency}`} to {`${destination.emoji} ${destination.currency}`}
            </ListGroup.Item>
        );
    }
}

function NavbarContent() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#!">Salary Converter</Navbar.Brand>
            </Container>
        </Navbar>
    )
}

function NewTabLink({ href, title }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
        >
            {title}
        </a>
    )
}

function FooterContent() {
    return (
        <Container className="text-center text-md-left">
            <div className="row">
                <div className="col-md-6 mt-md-0 mt-3">
                    <h5 className="text-uppercase">About This App</h5>
                    <p>This app is an open source project. Contributions are welcome.</p>
                </div>

                <hr className="clearfix w-100 d-md-none pb-0" />

                <div className="col-md-3 mb-md-0 mb-3">
                    <h5 className="text-uppercase">Docs</h5>
                    <ul className="list-unstyled">
                        <li>
                            <NewTabLink
                                href="https://en.wikipedia.org/wiki/Purchasing_power_parity"
                                title="What is PPP?"
                            />
                        </li>
                        <li>
                            <NewTabLink
                                href="https://documents.worldbank.org/en/publication/documents-reports/api"
                                title="World Bank API"
                            />
                        </li>
                    </ul>
                </div>

                <div className="col-md-3 mb-md-0 mb-3">
                    <h5 className="text-uppercase">Project</h5>
                    <ul className="list-unstyled">
                        <li>
                            <NewTabLink
                                href="https://github.com/AlexandruIstrate/SalaryCalculator"
                                title="Project Homepage"
                            />
                        </li>
                        <li>
                            <NewTabLink
                                href="https://github.com/AlexandruIstrate/SalaryCalculator/blob/master/README.md"
                                title="Docs"
                            />
                        </li>
                        <li>
                            <NewTabLink
                                href="https://github.com/AlexandruIstrate/SalaryCalculator/issues"
                                title="Report an Issue"
                            />
                        </li>
                        <li>
                            <NewTabLink
                                href="https://github.com/AlexandruIstrate/SalaryCalculator/releases"
                                title="Previous Releases"
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </Container>
    )
}

function App() {
    // App State
    const [salary, setSalary] = useState(0);
    const [sourceCountry, setSourceCountry] = useState(process.env.REACT_APP_DEFAULT_SOURCE_COUNTRY_CODE);
    const [destinationCountry, setDestinationCountry] = useState(process.env.REACT_APP_DEFAULT_DESTINATION_COUNTRY_CODE);

    const [isLoading, setIsLoading] = useState(true);
    const [pppData, setPPPData] = useState([]);

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
    }

    const [history, historyDispatch] = useReducer(historyReducer, { historyItems: [] });

    // Data Loading

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
                            currency: country?.currency,
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

                // Set the initial history item
                historyDispatch({
                    newItem: {
                        source: processed[sourceCountry],
                        destination: processed[destinationCountry]
                    }
                });
            })
            .finally(() => {
                // Always clear the loading state at the end
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // UI Rendering Functions

    const renderCalculatorArea = () => {
        // Check if we are in the loading state
        if (isLoading) {
            return (
                <Container className="text-center p-5">
                    <Spinner
                        animation="grow"
                        variant="primary"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            );
        } else {
            return (
                <Container>
                    <Row>
                        {/* Calculator Column */}
                        <Col xs={12} md={8} lg={9}>
                            <Form>
                                {/* Source Country */}
                                <Form.Group
                                    className="mb-3"
                                    controlId="formSourceCountry"
                                >
                                    <Form.Label>Source Country</Form.Label>
                                    <CountrySelect
                                        country={sourceCountry}
                                        pppData={pppData}
                                        onChange={handleChangeSource}
                                        isLoading={isLoading}
                                    />
                                </Form.Group>

                                {/* Input Salary */}
                                <Form.Label>Salary in {pppData[sourceCountry].countryName}'s local currency</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        type="number"
                                        inputMode="decimal"
                                        value={salary}
                                        min={0}
                                        placeholder="Enter salary"
                                        onChange={handleChangeSalary}
                                        disabled={isLoading}
                                    />
                                    <InputGroup.Text>{pppData[sourceCountry].currency.split(",")[0]}</InputGroup.Text>
                                </InputGroup>

                                {/* Destination Country */}
                                <Form.Group
                                    className="mb-3"
                                    controlId="formDestinationCountry"
                                >
                                    <Form.Label>Destination Country</Form.Label>
                                    <CountrySelect
                                        country={destinationCountry}
                                        pppData={pppData}
                                        onChange={handleChangeDestination}
                                        isLoading={isLoading}
                                    />
                                </Form.Group>

                                {/* Output Salary */}
                                <Form.Label>Output</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        type="number"
                                        inputMode="decimal"
                                        value={calculateSalary().toFixed(2)}
                                        placeholder="Resulting salary"
                                        readOnly={true}
                                    />
                                    <InputGroup.Text>{pppData[destinationCountry].currency.split(",")[0]}</InputGroup.Text>
                                </InputGroup>

                                <Button
                                    variant="outline-primary"
                                    className="mb-3"
                                    onClick={handleReverseCountries}
                                    disabled={isLoading}
                                >
                                    Reverse Countries
                                </Button>
                            </Form>
                        </Col>

                        {/* History Column */}
                        <Col xs={12} md={4} lg={3}>
                            <Card>
                                <Card.Header>Recent Conversions</Card.Header>
                                <ListGroup variant="flush">
                                    <HistoryContent
                                        historyItems={history.historyItems}
                                        onClick={handleHistoryItemClicked}
                                    />
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }

    // Event Handlers

    const handleChangeSalary = (e) => {
        // Set the new value
        const newValue = e.target.value;
        setSalary(newValue);
    }

    const handleChangeSource = (e) => {
        // Get the new value
        const newValue = e.countryCode;

        // First, remember this conversion in the history
        historyDispatch({
            newItem: {
                source: pppData[newValue],
                destination: pppData[destinationCountry]
            }
        });

        // Set the new value
        setSourceCountry(newValue);
    }

    const handleChangeDestination = (e) => {
        // Get the new value
        const newValue = e.countryCode;

        // First, remember this conversion in the history
        historyDispatch({
            newItem: {
                source: pppData[sourceCountry],
                destination: pppData[newValue]
            }
        });

        // Set the new value
        setDestinationCountry(newValue);
    }

    const handleReverseCountries = (e) => {
        // Get the new value
        const temp = destinationCountry;

        // First, remember this conversion in the history
        historyDispatch({
            newItem: {
                source: pppData[destinationCountry],
                destination: pppData[sourceCountry]
            }
        });

        // Swap the values
        setDestinationCountry(sourceCountry);
        setSourceCountry(temp);
    }

    const handleHistoryItemClicked = (e) => {
        // Set the source and destionation using the given data
        setSourceCountry(e.source.countryCode);
        setDestinationCountry(e.destination.countryCode);
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

    return (
        <div className="app">
            {/* Development Build Banner */}
            {process.env.NODE_ENV === "development" ? (
                <div className="banner-dev-env text-center bg-warning p-2">
                    <b>Development Build</b>
                </div>
            ) : (
                null
            )}

            {/* App Header */}
            <header>
                <NavbarContent />
            </header>

            {/* Main Content */}
            <main>
                <Container className="content p-3">
                    <Jumbotron
                        title="Calcualte Your Salary"
                        subtitle="Use this converter to check how much money you need in a certain country in order to be able to live as well as you would do in another. Start by selecting the source and destination countries and then input the salary amount in the source currency."
                    />
                    <Container className="mb-5">
                        {renderCalculatorArea()}
                    </Container>
                </Container>
            </main>

            {/* Footer */}
            <footer className="footer font-small blue bg-light pt-4">
                {/* Footer Content */}
                <FooterContent />

                {/* Copyright */}
                <div className="footer-copyright text-center py-3">
                    © {new Date().getFullYear()} Copyright: <NewTabLink href="https://github.com/AlexandruIstrate" title="Alex Istrate" />
                </div>
            </footer>
        </div>
    );
}

export default App;
