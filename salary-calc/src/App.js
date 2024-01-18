import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { countries } from "countries-list";

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

function CountrySelect({ country, onChange }) {
    return (
        <Form.Select
            value={country}
            onChange={onChange}
        >
            {
                Object.entries(countries)
                    .map(([code, info]) =>
                        <option
                            key={code}
                            value={code}
                        >
                            {info.emoji} {info.name}
                        </option>)
            }
        </Form.Select>
    )
}

function FooterContent() {
    return (
        <Container className="text-center text-md-left">
            <div className="row">
                <div className="col-md-6 mt-md-0 mt-3">
                    <h5 className="text-uppercase">Footer Content</h5>
                    <p>Here you can use rows and columns to organize your footer content.</p>
                </div>

                <hr className="clearfix w-100 d-md-none pb-0" />

                <div className="col-md-3 mb-md-0 mb-3">
                    <h5 className="text-uppercase">Links</h5>
                    <ul className="list-unstyled">
                        <li><a href="#!">Link 1</a></li>
                        <li><a href="#!">Link 2</a></li>
                        <li><a href="#!">Link 3</a></li>
                        <li><a href="#!">Link 4</a></li>
                    </ul>
                </div>

                <div className="col-md-3 mb-md-0 mb-3">
                    <h5 className="text-uppercase">Links</h5>
                    <ul className="list-unstyled">
                        <li><a href="#!">Link 1</a></li>
                        <li><a href="#!">Link 2</a></li>
                        <li><a href="#!">Link 3</a></li>
                        <li><a href="#!">Link 4</a></li>
                    </ul>
                </div>
            </div>
        </Container>
    )
}

function App() {
    const [salary, setSalary] = useState(0);
    const [result, setResult] = useState(0);
    const [sourceCountry, setSourceCountry] = useState("RO");
    const [destinationCountry, setDestinationCountry] = useState("DE");

    function handleChangeSalary(e) {
        const newValue = e.target.value;
        // console.log(newValue);
        setSalary(newValue);

        // Set the output
        setResult(newValue * Math.random());
    }

    function handleChangeSource(e) {
        const newValue = e.target.value;
        // console.log(newValue);
        setSourceCountry(newValue);
    }

    function handleChangeDestination(e) {
        const newValue = e.target.value;
        setDestinationCountry(newValue);
    }

    return (
        <div className="app">
            {/* Main Content */}
            <main>
                <Container className="content p-3">
                    <Jumbotron title="PPP Salary Converter" subtitle="Use this converter to check how much money you need in a certain country in order to be able to live as well as you would do in another. Start by selecting the source and destination countries and then input the salary amount in the source currency." />
                    <Container className="mb-5">
                        <Form>
                            {/* Source Country */}
                            <Form.Group className="mb-3" controlId="formSourceCountry">
                                <Form.Label>Source Country</Form.Label>
                                <CountrySelect country={sourceCountry} onChange={handleChangeSource} />
                            </Form.Group>

                            {/* Input Salary */}
                            <Form.Label>Salary in {countries[sourceCountry].name}"s local currency</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="text"
                                    value={salary}
                                    onChange={handleChangeSalary}
                                    placeholder="Enter salary" />
                                <InputGroup.Text>{countries[sourceCountry].currency}</InputGroup.Text>
                            </InputGroup>

                            {/* Destination Country */}
                            <Form.Group className="mb-3" controlId="formDestinationCountry">
                                <Form.Label>Destination Country</Form.Label>
                                <CountrySelect country={destinationCountry} onChange={handleChangeDestination} />
                            </Form.Group>

                            {/* Output Salary */}
                            <Form.Label>Output</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control type="text" value={result.toFixed(2)} readOnly />
                                <InputGroup.Text>{countries[destinationCountry].currency.split(",")[0]}</InputGroup.Text>
                            </InputGroup>
                        </Form>
                    </Container>
                </Container>
            </main>

            {/* Footer */}
            <footer className="footer font-small blue bg-light pt-4">
                {/* Footer Content */}
                <FooterContent />

                {/* Copyright */}
                <div className="footer-copyright text-center py-3">
                    © {new Date().getFullYear()} Copyright: <a href="https://github.com/AlexandruIstrate">Alex Istrate</a>
                </div>
            </footer>
        </div>
    );
}

export default App;
