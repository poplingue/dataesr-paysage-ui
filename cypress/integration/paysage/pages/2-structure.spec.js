const baseUrl = Cypress.env('baseUrl');

context('Structure form page', () => {
    before(() => {
        cy.deleteIndexDB();
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
    });

    after(() => {
        cy.signOut();
    });

    it('should display current page BreadCrumbs', () => {
        cy.get('[data-cy="update/structure"]').click();

        cy.get('[data-cy="current-page"]')
            .find('a')
            .should('have.text', 'Ajouter une structure');
    });
});
