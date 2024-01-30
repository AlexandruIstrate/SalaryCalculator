import Navbar from "react-bootstrap/Navbar"
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";

import { countries, languages } from "countries-list";

import { supportedLngs } from "src/i18n";

function NavbarContent({ t, i18n }) {
    // Create a list of display languages
    const displayLanguages = Object.entries(supportedLngs)
        .map(([code, language]) => ({
            code: code,
            flagEmoji: countries[language.flagCountryCode].emoji,
            ...languages[code]
        }));

    // Get the selected language
    const selectedLanguage = displayLanguages
        .filter(lang => lang.code === i18n.resolvedLanguage)[0];

    // Rendering functions
    const renderLanguage = (nativeName, flagEmoji) => {
        return `${flagEmoji} ${nativeName}`;
    }

    // Return the body of the component
    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#!">
                    {t("nav.title")}
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <NavDropdown title={renderLanguage(selectedLanguage.native, selectedLanguage.flagEmoji)}>
                        {
                            displayLanguages
                                .map((lang, index) => {
                                    return (
                                        <NavDropdown.Item
                                            key={index}
                                            disabled={lang.code === i18n.resolvedLanguage}
                                            onClick={() => i18n.changeLanguage(lang.code)}
                                        >
                                            {renderLanguage(lang.native, lang.flagEmoji)}
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