const baseUrl = Cypress.env('baseUrl');

context('Person page', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/object/person/1`);
    });

    afterEach(() => {
        cy.signOut();
    });

    it('should open/close Tools', () => {
        cy.get('[data-cy="toolbox-header"]').find('.ri-tools-fill ').click();
        cy.get('[data-cy="toolbox-header"]')
            .find('.fr-text--md')
            .should('not.have.class', 'hidden');
    });
});
