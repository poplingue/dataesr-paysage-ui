const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    before(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
    });

    after(() => {
        cy.signOut();
    });

    it('should save new Structure officialName data', () => {
        cy.get('[data-cy="update/structure"]').click();

        cy.intercept('PATCH', '/api/structure/**').as('patch');

        cy.get('[data-testid="officialName"]').find('input').type('Offiffi');

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.wait('@patch');

        cy.reload();

        cy.get('[data-testid="officialName"]')
            .find('input')
            .should('have.value', 'Offiffi');
    });
});
