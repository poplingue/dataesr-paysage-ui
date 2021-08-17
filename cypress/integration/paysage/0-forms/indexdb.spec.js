context('IndexDB', () => {
    before(() => {
        cy.visit('http://localhost:3000/person/create');
    });

    it('should save input value in INdexDB', async () => {
        cy.get('[data-testid="Nom"]').find('input').clear().type('SamSam');
        cy.reload();
        cy.get('[data-testid="Nom"]').find('input').should('have.value', 'SamSam');
    });
});
