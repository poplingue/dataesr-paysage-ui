const baseUrl = Cypress.env('baseUrl');

context('IndexDB #2', () => {
    before(() => {
        cy.deleteIndexDB();
    });

    it('should save selected values on structure form page', () => {
        cy.visit(`${baseUrl}/demo/structure`);

        cy.wait(500);

        cy.get('[data-cy="aisne-1"]').find('input').check({ force: true });
        cy.wait(1000);

        cy.get('[data-cy="allier-2"]').find('input').check({ force: true });
        cy.wait(1000);

        cy.reload();

        cy.get('[data-cy="Aisne"]').should('exist');
        cy.get('[data-cy="Allier"]').should('exist');
    });
});
