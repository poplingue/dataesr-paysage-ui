const baseUrl = Cypress.env('baseUrl');

context('IndexDB #1', () => {
    before(() => {
        cy.deleteIndexDB();
    });

    it('should save input radio choice', () => {
        cy.visit(`${baseUrl}/demo/person`);

        cy.get('[data-testid="demo/person@denomination_gender#0"]')
            .find('select')
            .select('n');

        cy.wait(500);

        cy.get('[data-testid="demo/person@denomination_gender#0"]')
            .find('select')
            .should('have.value', 'n');
    });
});
