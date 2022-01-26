const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    before(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
    });

    it('should save new Structure names data', () => {
        cy.wait(100);
        cy.get('a[href="/update/structure"]').click();

        cy.get('[data-testid="officialName"]').find('input').type('Offiffi');
        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.reload();

        cy.get('[data-testid="officialName"]')
            .find('input')
            .should('have.value', 'Offiffi');
    });
});
