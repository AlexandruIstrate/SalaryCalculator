import React, { useState, useEffect, useReducer } from "react";

import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { countries } from "countries-list";
import { isEqual } from "lodash";

import { WorldBankAPI } from "src/api/WorldBankAPI";

import "./App.css";
import { Col, Row } from "react-bootstrap";

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

function CountrySelect({ country, pppData, onChange }) {
    return (
        <Form.Select
            value={country}
            onChange={onChange}
        >
            {
                Object.entries(pppData)
                    .map(([code, info]) =>
                        <option
                            key={code}
                            value={code}
                        >
                            {/* Display the flag, together with the country name */}
                            {info.emoji} {info.countryName}
                        </option>)
            }
        </Form.Select>
    )
}

function HistoryContent({ historyItems }) {
    // Check if we have no data
    if (!historyItems || historyItems.length === 0) {
        // Return a no data message
        return (
            <ListGroup.Item>None</ListGroup.Item>
        );
    } else {
        // Return normal content
        return historyItems.map(({ source, destination }, index) =>
            <ListGroup.Item key={index}>
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

    // Reducers
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

            // Merge the existing array with the new item
            return {
                historyItems: history.concat([newItem])
            };
        }

        throw Error("No new value provided for history");
    }

    const resultReducer = (state, action) => {
        // Get PPP data for the selected countries
        const source = action.sourceCountry;
        const dest = action.destinationCountry;

        // Calculate the target amount
        const targetAmount = parseInt(action.salary) / source.ppp * dest.ppp;

        // Also remember this conversion in the history
        historyDispatch({
            newItem: {
                source: source,
                destination: dest
            }
        });

        console.log(targetAmount);

        // Return the resulting value
        return {
            resultSalary: targetAmount
        }
    }

    const [history, historyDispatch] = useReducer(historyReducer, { historyItems: [] });
    const [result, resultDispatch] = useReducer(resultReducer, { resultSalary: 0 });

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

                // Log the processed data
                // console.log("PPP Data:", processed);

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
    }, [pppData, sourceCountry, destinationCountry]);

    // UI Rendering Functions

    const renderCalculatorArea = () => {
        // Check if we are in the loading state
        if (isLoading) {
            return (
                <Container className="text-center p-5">
                    <Spinner animation="border" />
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
                                    />
                                </Form.Group>

                                {/* Input Salary */}
                                <Form.Label>Salary in {pppData[sourceCountry].countryName}'s local currency</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        type="text"
                                        value={salary}
                                        onChange={handleChangeSalary}
                                        placeholder="Enter salary" />
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
                                    />
                                </Form.Group>

                                {/* Output Salary */}
                                <Form.Label>Output</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        type="text"
                                        value={result.resultSalary.toFixed(2)}
                                        readOnly={true}
                                    />
                                    <InputGroup.Text>{pppData[destinationCountry].currency.split(",")[0]}</InputGroup.Text>
                                </InputGroup>

                                <Button
                                    variant="outline-primary"
                                    onClick={handleReverseCountries}
                                    className="mb-3"
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
                                    <HistoryContent historyItems={history.historyItems} />
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

        // Recalculate the new salary
        resultDispatch({
            salary: newValue,
            sourceCountry: pppData[sourceCountry],
            destinationCountry: pppData[destinationCountry]
        });
    }

    const handleChangeSource = (e) => {
        // Set the new value
        const newValue = e.target.value;
        setSourceCountry(newValue);

        // Recalculate the new salary
        resultDispatch({
            salary: salary,
            sourceCountry: pppData[newValue],
            destinationCountry: pppData[destinationCountry]
        });
    }

    const handleChangeDestination = (e) => {
        // Set the new value
        const newValue = e.target.value;
        setDestinationCountry(newValue);

        // Recalculate the new salary
        resultDispatch({
            salary: salary,
            sourceCountry: pppData[sourceCountry],
            destinationCountry: pppData[newValue]
        });
    }

    const handleReverseCountries = (e) => {
        // Swap the values
        const temp = destinationCountry;
        setDestinationCountry(sourceCountry);
        setSourceCountry(temp);

        // Run the calculation again with the reversed values
        resultDispatch({
            salary: salary,
            sourceCountry: pppData[destinationCountry],
            destinationCountry: pppData[sourceCountry]
        });
    }

    return (
        <div className="app">
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
