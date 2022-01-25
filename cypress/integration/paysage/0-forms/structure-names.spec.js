const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
    });
    it('should save new Structure names data', () => {
        cy.get('[href="/update/structure"]').click();

        cy.get('[data-testid="officialName"]').find('input').type('Offiffi');
        cy.get('[data-testid="noms#0-save-button"]').click();
        cy.reload();

        cy.get('[data-testid="officialName"]')
            .find('input')
            .should('have.value', 'Offiffi');
    });
});
