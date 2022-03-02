const baseUrl = Cypress.env('baseUrl');

context('Structure publish', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
        cy.newStructure();
    });

    it('should publish Structure', () => {
        cy.intercept('PUT', '/api/structure/**').as('put');

        cy.get('[data-cy="toolbox-header"]').find('.ri-tools-fill ').click();

        cy.get(`[data-testid="validate-structure"]`).click();

        cy.wait('@put');

        cy.get(`[data-testid="validate-structure"]`).should('not.exist');

        cy.get(`.cy-notif-valid`).should('be.visible');
    });
});
