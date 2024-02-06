import Container from "react-bootstrap/Container";

import { withTranslation } from "react-i18next";

import NewTabLink from "src/components/NewTabLink";

function FooterContent({ t }) {
    // Create an object to hold all the footer links
    const footerLinks = {
        sections: {
            docs: {
                i18nKey: "footer.docs.title",
                links: {
                    pppDocs: {
                        iconName: "bi-question-circle",
                        i18nKey: "footer.docs.whatIsPPP",
                        link: "https://en.wikipedia.org/wiki/Purchasing_power_parity"
                    },
                    worldBankAPI: {
                        iconName: "bi-puzzle",
                        i18nKey: "footer.docs.worldBankAPI",
                        link: "https://documents.worldbank.org/en/publication/documents-reports/api"
                    }
                }
            },
            project: {
                i18nKey: "footer.project.title",
                links: {
                    projHomepage: {
                        iconName: "bi-github",
                        i18nKey: "footer.project.homepage",
                        link: "https://github.com/AlexandruIstrate/SalaryCalculator"
                    },
                    docs: {
                        iconName: "bi-book",
                        i18nKey: "footer.project.docs",
                        link: "https://github.com/AlexandruIstrate/SalaryCalculator/blob/master/README.md"
                    },
                    reportIssue: {
                        iconName: "bi-flag",
                        i18nKey: "footer.project.reportIssue",
                        link: "https://github.com/AlexandruIstrate/SalaryCalculator/issues"
                    },
                    prevReleases: {
                        iconName: "bi-box-seam",
                        i18nKey: "footer.project.previousReleases",
                        link: "https://github.com/AlexandruIstrate/SalaryCalculator/releases"
                    }
                }
            }
        }
    };

    // Return the HTML
    return (
        <Container className="text-center text-md-left">
            <div className="row">
                <div className="footer-about col-md-6 mt-md-0 mt-3">
                    <h5 className="text-uppercase">{t("footer.title")}</h5>
                    <p>{t("footer.description")}</p>
                </div>

                <hr className="clearfix w-100 d-md-none pb-0" />

                {/* Dinamically render all the links */}
                {
                    Object.values(footerLinks.sections).map(({ i18nKey, links }, secIndex) => (
                        <div key={secIndex} className="footer-section col-md-3 mb-md-0 mb-3">
                            <h5 className="text-uppercase">{t(i18nKey)}</h5>
                            <ul className="list-unstyled">
                                {
                                    Object.values(links).map(({ iconName, i18nKey, link }, index) => (
                                        <li key={index}>
                                            <i className={`bi ${iconName} me-1`} />&nbsp;
                                            <NewTabLink
                                                href={link}
                                                title={t(i18nKey)}
                                            />
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </div>
        </Container>
    )
}

export default withTranslation()(FooterContent);