const baseUrl = Cypress.env('baseUrl');

context('IndexDB', () => {
    beforeEach(() => {
        cy.deleteIndexDB();
    });

    it('should save input text value', () => {
        cy.visit(`${baseUrl}/demo/person`);

        cy.get('[data-testid="Nom"]').find('input').type('SamSam');
        cy.reload();
        cy.get('[data-testid="Nom"]')
            .find('input')
            .should('have.value', 'SamSam');
    });

    it('should save input radio choice', () => {
        cy.visit(`${baseUrl}/demo/person`);

        cy.get('[data-testid="demo/person@denomination/genre#0"]')
            .find('select')
            .select('n');

        cy.wait(500);

        cy.get('[data-testid="demo/person@denomination/genre#0"]')
            .find('select')
            .should('have.value', 'n');
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
