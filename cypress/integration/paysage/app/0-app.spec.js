const baseUrl = Cypress.env('baseUrl');

context('App', () => {
    it('should load static Help page and show content', () => {
        cy.visit(`${baseUrl}/help`);
        cy.wait(100);
        cy.contains(
            "Plateforme d'échanges et d'informations de la DGESIP et de la DGRI"
        );
    });
});
