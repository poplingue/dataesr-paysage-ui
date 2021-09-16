context('IndexDB', () => {
    before(() => {
        cy.deleteIndexDB();
    });

    beforeEach(() => {
        cy.visit('http://localhost:3000/create/person');
    });

    it('should save input text value', () => {
        cy.get('[data-testid="Nom"]').find('input').type('SamSam');
        cy.reload();
        cy.get('[data-testid="Nom"]').find('input').should('have.value', 'SamSam');
    });

    it('should save input radio choice', () => {
        cy.get('[data-testid="create/person@denomination/genre#1"]').find('select').select('n');
        cy.reload();
        cy.get('[data-testid="create/person@denomination/genre#1"]').find('select').should('have.value', 'n');
    });

    it('should save selected values on structure form page', () => {
        cy.visit('http://localhost:3000/create/structure');
        cy.get('[data-cy="aisne-1"]').find('label').click();
        cy.get('[data-cy="allier-2"]').find('label').click();
        cy.reload();
        cy.wait(3000);
        cy.get('[data-cy="aisne-1"]').find('input').should('be.checked');
        cy.get('[data-cy="allier-2"]').find('input').should('be.checked');
    });
});
