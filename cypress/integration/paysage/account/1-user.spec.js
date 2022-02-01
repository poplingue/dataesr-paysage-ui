const baseUrl = Cypress.env('baseUrl');

context('Account manager', () => {
    it('should signIn as Mollie Dickinson Inactive', () => {
        cy.visit(`${baseUrl}/account/sign-in`);

        cy.intercept('POST', '/api/auth/**').as('auth');

        cy.get('[name="account"]').type('mollie-inactive.dickinson@email.com');
        cy.get('[name="password"]').type('Polk000!');
        cy.get('form').submit();

        cy.wait('@auth');

        cy.location().should((loc) => {
            expect(loc.pathname).to.eq('/account/activate-account');
        });
    });

    it('should signIn as Mollie Dickinson Active', () => {
        cy.visit(`${baseUrl}/account/sign-in`);

        cy.intercept('POST', '/api/auth/**').as('auth');

        cy.get('[name="account"]').type('mollie-active.dickinson@email.com');
        cy.get('[name="password"]').type('Polk000!');
        cy.get('form').submit();

        cy.wait('@auth');

        cy.get('[data-cy=user]').should(
            'have.text',
            'Salut à toi mollie-active'
        );
    });
});
