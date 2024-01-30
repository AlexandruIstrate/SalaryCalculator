import Navbar from "react-bootstrap/Navbar"
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";

import { languages } from "countries-list";

import FlagDisplay from "src/components/FlagDisplay";
import { supportedLngs } from "src/i18n";

function NavbarContent({ t, i18n }) {
    // Create a list of display languages
    const displayLanguages = Object.entries(supportedLngs)
        .map(([code, language]) => ({
            langCode: code,
            countryCode: language.flagCountryCode,
            native: languages[code].native
        }));

    // Get the selected language
    const selLang = displayLanguages
        .filter(lang => lang.langCode === i18n.resolvedLanguage)[0];

    // Create a HTML element to display the selected language
    const selLangDisplay = <FlagDisplay
        countryCode={selLang.countryCode}
        text={selLang.native}
    />;

    // Return the body of the component
    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#!">
                    {t("nav.title")}
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <NavDropdown title={selLangDisplay}>
                        {
                            displayLanguages
                                .map((lang, index) => {
                                    return (
                                        <NavDropdown.Item
                                            key={index}
                                            disabled={lang.langCode === i18n.resolvedLanguage}
                                            onClick={() => i18n.changeLanguage(lang.langCode)}
                                        >
                                            <FlagDisplay
                                                countryCode={lang.countryCode}
                                                text={lang.native}
                                            />
                                        </NavDropdown.Item>
                                    )
                                })
                        }
                    </NavDropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavbarContent;