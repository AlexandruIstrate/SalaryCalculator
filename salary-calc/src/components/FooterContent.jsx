import Container from "react-bootstrap/Container";

import NewTabLink from "src/components/NewTabLink";

function FooterContent({ t }) {
    return (
        <Container className="text-center text-md-left">
            <div className="row">
                <div className="col-md-6 mt-md-0 mt-3">
                    <h5 className="text-uppercase">{t("footer.title")}</h5>
                    <p>{t("footer.description")}</p>
                </div>

                <hr className="clearfix w-100 d-md-none pb-0" />

                <div className="col-md-3 mb-md-0 mb-3">
                    <h5 className="text-uppercase">{t("footer.docs.title")}</h5>
                    <ul className="list-unstyled">
                        <li>
                            <NewTabLink
                                href="https://en.wikipedia.org/wiki/Purchasing_power_parity"
                                title={t("footer.docs.whatIsPPP")}
                            />
                        </li>
                        <li>
                            <NewTabLink
                                href="https://documents.worldbank.org/en/publication/documents-reports/api"
                                title={t("footer.docs.worldBankAPI")}
                            />
                        </li>
                    </ul>
                </div>

                <div className="col-md-3 mb-md-0 mb-3">
                    <h5 className="text-uppercase">{t("footer.project.title")}</h5>
                    <ul className="list-unstyled">
                        <li>
                            <NewTabLink
                                href="https://github.com/AlexandruIstrate/SalaryCalculator"
                                title={t("footer.project.homepage")}
                            />
                        </li>
                        <li>
                            <NewTabLink
                                href="https://github.com/AlexandruIstrate/SalaryCalculator/blob/master/README.md"
                                title={t("footer.project.docs")}
                            />
                        </li>
                        <li>
                            <NewTabLink
                                href="https://github.com/AlexandruIstrate/SalaryCalculator/issues"
                                title={t("footer.project.reportIssue")}
                            />
                        </li>
                        <li>
                            <NewTabLink
                                href="https://github.com/AlexandruIstrate/SalaryCalculator/releases"
                                title={t("footer.project.previousReleases")}
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </Container>
    )
}

export default FooterContent;