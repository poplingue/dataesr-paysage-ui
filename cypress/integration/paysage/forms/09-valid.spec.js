const baseUrl = Cypress.env('baseUrl');

context('Structure form page', () => {
    beforeEach(() => {
        cy.deleteIndexDB();
        cy.visit(`${baseUrl}/demo/structure`);
    });

    it('should display warning section on change rnsr and siret data', () => {
        cy.get('[data-testid="siret"]').find('input').type('9876543');
        cy.get('[data-testid="rnsr"]').find('input').type('234567');
        cy.get('[data-testid="informations-save-button"]').click();
        cy.wait(500);
        cy.get('.cy-notif-error').should('exist');
    });
});
