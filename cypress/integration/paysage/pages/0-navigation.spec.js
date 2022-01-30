const baseUrl = Cypress.env('baseUrl');

context('Person page', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/object/person/1`);
    });

    afterEach(() => {
        cy.signOut();
    });

    it('should display Navigation', () => {
        cy.get('[data-cy="nav-header-text"]')
            .find('.fr-text--md span')
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
