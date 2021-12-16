const baseUrl = Cypress.env('baseUrl');

context('IndexDB', () => {
    before(() => {
        cy.deleteIndexDB();
    });

    beforeEach(() => {
        cy.visit(`${baseUrl}/tests/person`);
    });

    it('should save input text value', () => {
        cy.get('[data-testid="Nom"]').find('input').type('SamSam');
        cy.reload();
        cy.get('[data-testid="Nom"]')
            .find('input')
            .should('have.value', 'SamSam');
    });

    it('should save input radio choice', () => {
        cy.get('[data-testid="tests/person@denomination/genre#0"]')
            .find('select')
            .select('n');
        cy.reload();
        cy.get('[data-testid="tests/person@denomination/genre#0"]')
            .find('select')
            .should('have.value', 'n');
    });

    it('should save selected values on structure form page', () => {
        cy.visit(`${baseUrl}/tests/structure`);
        cy.get('[data-cy="aisne-1"]').find('input').check({ force: true });
        cy.get('[data-cy="allier-2"]').find('input').check({ force: true });
        cy.reload();
        cy.wait(3000);
        cy.get('[data-cy="aisne-1"]').find('input').should('be.checked');
        cy.get('[data-cy="allier-2"]').find('input').should('be.checked');
    });
});
