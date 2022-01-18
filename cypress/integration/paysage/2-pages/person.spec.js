const baseUrl = Cypress.env('baseUrl');

context('Person form page', () => {
    before(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update/person`);
    });

    after(() => {
        cy.signOut();
    });

    it('should display current page BreadCrumbs', () => {
        cy.get('[data-cy="current-page"]')
            .find('a')
            .should('have.text', 'Ajouter une personne');
    });
});
