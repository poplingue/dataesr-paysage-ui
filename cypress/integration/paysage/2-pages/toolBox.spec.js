context('Person page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/object/person/1');
    });

    it('should open/close Tools', () => {
        cy.get('[data-cy="toolbox-header"]').find('.ri-tools-fill ').click();
        cy.get('[data-cy="toolbox-header"]').find(".fr-text").should('not.have.class', 'hidden');
    });
})
