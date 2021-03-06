const baseUrl = Cypress.env('baseUrl');

context('Structure form page', () => {
    before(() => {
        cy.deleteIndexDB();
        cy.signIn();
        cy.visit(`${baseUrl}/contrib`);
    });

    it('should display current page BreadCrumbs', () => {
        cy.get('[data-cy="contrib/structure"]').click();

        cy.get('[data-cy="current-page"]')
            .find('a')
            .should('have.text', 'Ajouter une structure');
    });
});
