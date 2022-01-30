const baseUrl = Cypress.env('baseUrl');

context('Account manager', () => {
    it('should signIn as Mollie Dickinson Inactive', () => {
        cy.visit(`${baseUrl}/account/sign-in`);

        cy.get('[name="account"]').type('mollie-inactive.dickinson@email.com');
        cy.get('[name="password"]').type('Polk000!');
        cy.get('form').submit();

        cy.wait(1500);

        cy.get('.psg-header-page')
            .find('h2')
            .should('have.text', 'Activer mon compte');
    });

    it('should signIn as Mollie Dickinson Active', () => {
        cy.visit(`${baseUrl}/account/sign-in`);

        cy.get('[name="account"]').type('mollie-active.dickinson@email.com');
        cy.get('[name="password"]').type('Polk000!');
        cy.get('form').submit();

        cy.wait(1000);
        cy.get('[data-cy=user]').should(
            'have.text',
            'Salut à toi mollie-active'
        );
    });
});
