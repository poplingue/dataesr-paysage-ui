context('Person page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/object/person/1');
    });

    it('should display Navigation', () => {
        cy.get('[data-cy="nav-header-text"]')
            .find('.fr-text--md')
            .should('have.text', 'Navigation');
    });

    it('should open/close Navigation', () => {
        cy.get('[data-cy="nav-header-text"]').click();
        cy.get('[data-cy="nav-header-text"]')
            .find('.fr-text--md')
            .should('have.class', 'hidden');
        cy.get('[data-cy="nav-header-text"]').click();
        cy.get('[data-cy="nav-header-text"]')
            .find('.fr-text--md')
            .should('not.have.class', 'hidden');
    });
});
