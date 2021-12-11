const baseUrl = Cypress.env('baseUrl');

context('App', () => {
    it('should load our app and show content', () => {
        cy.visit(`${baseUrl}`);
        cy.contains(
            "Plateforme d'échanges et d'informations de la DGESIP et de la DGRI"
        );
    });
});
