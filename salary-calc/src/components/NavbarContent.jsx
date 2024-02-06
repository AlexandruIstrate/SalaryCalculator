import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";

import { withTranslation } from "react-i18next";
import { languages } from "countries-list";

import FlagDisplay from "src/components/FlagDisplay";
import { supportedLngs } from "src/i18n";
import { themeOptions } from "src/themes/Themes";

function NavbarContent({ t, i18n, themePref, setThemePref }) {
    // Create a HTML element to display the currently selectd theme
    const themeDisplay = <>
        <span style={{
            fontSize: "larger"
        }}>
            {String.fromCodePoint("0x1F525")}&nbsp;
        </span>
        <span>
            {t("themes.title")}
        </span>
    </>;

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
        <Navbar
            expand="lg"
            className="bg-body-tertiary"
        >
            <Container>
                {/* Branding */}
                <Navbar.Brand href="#!">
                    {t("nav.title")}
                </Navbar.Brand>

                {/* Menu Toggle for Mobile */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                {/* Menus */}
                <Navbar.Collapse
                    id="basic-navbar-nav"
                    className="justify-content-end"
                >
                    <Nav className="ml-auto">
                        {/* Themes Dropdown */}
                        <NavDropdown title={themeDisplay}>
                            {
                                Object.values(themeOptions).map((themeOption) => (
                                    <NavDropdown.Item
                                        key={themeOption.id}
                                        disabled={themeOption.id === themePref}
                                        onClick={() => setThemePref(themeOption.id)}
                                    >
                                        {t(themeOption.i18nKey)}
                                    </NavDropdown.Item>
                                ))
                            }
                        </NavDropdown>

                        {/* Language Dropdown */}
                        <NavDropdown title={selLangDisplay}>
                            {
                                displayLanguages
                                    .map(({ langCode, countryCode, native }) => {
                                        return (
                                            <NavDropdown.Item
                                                key={langCode}
                                                disabled={langCode === i18n.resolvedLanguage}
                                                onClick={() => i18n.changeLanguage(langCode)}
                                            >
                                                <FlagDisplay
                                                    countryCode={countryCode}
                                                    text={native}
                                                />
                                            </NavDropdown.Item>
                                        )
                                    })
                            }
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default withTranslation()(NavbarContent);