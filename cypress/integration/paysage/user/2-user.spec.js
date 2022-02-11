const baseUrl = Cypress.env('baseUrl');

context('Account manager', () => {
    it('should signOut', () => {
        cy.visit(`${baseUrl}/account/sign-in`);

        cy.intercept('POST', '/api/auth/**').as('auth');

        cy.get('[name="account"]').type('mollie-inactive.dickinson@email.com');
        cy.get('[name="password"]').type('Polk000!');
        cy.get('form').submit();

        cy.wait('@auth');

        cy.get('[data-cy="sign-out"]').find('a').click();

        cy.location().should((loc) => {
            expect(loc.pathname).to.eq('/account/sign-in');
        });
    });
});
