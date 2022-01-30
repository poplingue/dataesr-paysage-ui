const baseUrl = Cypress.env('baseUrl');

context('IndexDB #0', () => {
    before(() => {
        cy.deleteIndexDB();
    });

    it('should save input text value', () => {
        cy.visit(`${baseUrl}/demo/person`);

        cy.get('[data-testid="lastName"]').find('input').type('SamSam');
        cy.reload();
        cy.get('[data-testid="lastName"]')
            .find('input')
            .should('have.value', 'SamSam');
    });
});
