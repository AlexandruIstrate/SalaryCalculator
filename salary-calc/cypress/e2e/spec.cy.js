describe("Navbar is working", () => {
    // Test to check the navbar exists
    it("Checks the Navbar exists", () => {
        // Visit using the base URL
        cy.visit("/");

        // Check the navbar exists
        cy.get("nav").should("exist");

        // Check the navbar has the correct Bootstrap class
        cy.get("nav")
            .should("have.class", "navbar")
            .and("have.class", "navbar-expand-lg")
            .and("have.class", "navbar-light");
    });

    // Test to check the navbar contents
    it("Checks the Navbar content", () => {
        // Visit using the base URL
        cy.visit("/");

        // Check the navbar has the branding element
        cy.get("nav").find(".navbar-brand")
            .should("exist")
            .and("have.text", "Salary Converter");

        // Check the navbar has collapse button for mobile
        cy.get("nav").find(".navbar-toggler")
            .should("exist");

        // Check the navbar has a collapse menu
        cy.get("nav").find(".navbar-collapse")
            .should("exist");

        // Check that we have all the links we expect
        cy.get("nav")
            .find(".navbar-collapse")
            .find("a")
            .should("exist")
            .and("contain", "Theme");

        cy.get("nav")
            .find(".navbar-collapse")
            .find("a")
            .should("exist")
            .and("contain", "English");
    });

    // Test to check the Jubotron exists
    it("Checks the Jumbotron exists", () => {
        // Visit using the base URL
        cy.visit("/");

        // Check the jumbotron exists
        cy.get(".jumbotron").should("exist");
    });

    // Test to check the Jumbotron contents
    it("Checks the Jumbotron content", () => {
        // Visit using the base URL
        cy.visit("/");

        // Check the Jumbotron has the correct title
        cy.get(".jumbotron").find("h1")
            .should("exist")
            .and("have.text", "Calculate Your Salary");

        // Check the Jumbotron has the correct subtitle
        cy.get(".jumbotron").find("p")
            .should("exist")
            .and("have.text", "Use this converter to check how much money you need in a certain country in order to be able to live as well as you would do in another. Start by selecting the source and destination countries and then input the salary amount in the source currency.");
    });

    // Test to check the Form exists
    it("Checks the Form exists", () => {
        // Visit using the base URL
        cy.visit("/");

        // Check the form exists
        cy.get("form").should("exist");
    });

    // Test to check the history panel exists
    it("Checks the History Panel exists", () => {
        // Visit using the base URL
        cy.visit("/");

        // Check the history panel exists
        cy.get(".history-panel").should("exist");
    });

    // Test to check the footer exists
    it("Checks the Footer exists", () => {
        // Visit using the base URL
        cy.visit("/");

        // Check the footer exists
        cy.get("footer").should("exist");
    });

    // Test to check the footer contents
    it("Checks the Footer content", () => {
        // Visit using the base URL
        cy.visit("/");

        // Check the footer has the about information
        cy.get("footer").find(".footer-about")
            .should("exist")
            .and("have.descendants", "h5")
            .and("have.descendants", "p");

        // Check that we have all the right sections
        cy.get("footer").find(".footer-section")
            .should("exist")
            .and("have.descendants", "h5")
            .and("contain.text", "Docs");

        cy.get("footer").find(".footer-section")
            .should("exist")
            .and("have.descendants", "h5")
            .and("contain.text", "Project");

        // Check that we have all the right links in each section
        cy.get("footer").find(".footer-section")
            .children("ul")
            .should("exist")
            .and("have.descendants", "li")
            .and("have.descendants", "a")
            .and("contain.text", "What is PPP?")
            .and("contain.text", "World Bank API");

        cy.get("footer").find(".footer-section")
            .children("ul")
            .should("exist")
            .and("have.descendants", "li")
            .and("have.descendants", "a")
            .and("contain.text", "Project Homepage")
            .and("contain.text", "Docs")
            .and("contain.text", "Report an Issue")
            .and("contain.text", "Previous Releases");

        // Check that the copy right information is present and with the correct year
        cy.get("footer").find(".footer-copyright")
            .should("exist")
            .and("contain.text", new Date().getFullYear());
    });
});