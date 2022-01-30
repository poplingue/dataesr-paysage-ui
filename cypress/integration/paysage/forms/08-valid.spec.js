const baseUrl = Cypress.env('baseUrl');

context('Structure form page', () => {
    beforeEach(() => {
        cy.deleteIndexDB();
        cy.visit(`${baseUrl}/demo/structure`);
    });

    it('should display notification error on save section data', () => {
        cy.get('[data-testid="siret"] input').type('8765');
        cy.get('[data-testid="informations-save-button"]').click();
        cy.wait(500);
        cy.get('.cy-notif-error').should('exist');
    });

    it('should display notification success on save section data', () => {
        cy.get('[data-testid="siret"] input').type('8765');
        cy.get('[data-testid="rnsr"] input').type('545454');
        cy.get('[data-testid="informations-save-button"]').click();
        cy.wait(500);
        cy.get('.cy-notif-neutral').should('exist');
    });

    it('should display warning section on change siret data', () => {
        cy.get('[data-testid="siret"] input').type('8765');
        cy.get('.cy-warning').should('exist');
    });
});
