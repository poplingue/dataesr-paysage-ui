const baseUrl = Cypress.env('baseUrl');

context('Structure form page', () => {
    beforeEach(() => {
        cy.deleteIndexDB();
        cy.signIn();
        cy.visit(`${baseUrl}/update/structure`);
    });

    afterEach(() => {
        cy.signOut();
    });

    it('should display current page BreadCrumbs', () => {
        cy.get('[data-cy="current-page"]')
            .find('a')
            .should('have.text', 'Ajouter une structure');
    });
});
