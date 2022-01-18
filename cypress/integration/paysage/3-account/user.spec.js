const baseUrl = Cypress.env('baseUrl');

context('Account manager', () => {
    it('should signup a Mollie user', () => {
        cy.visit(`${baseUrl}/account/signup`);

        const d = new Date();
        const firstName = `Mollie${d.getTime()}`;
        const lastName = `Dickinson${d.getTime()}`;
        const email = `mollie.dickinson-${d.getTime()}@email.com`;
        const username = `mollie-${d.getTime()}`;

        cy.get('[name="firstName"]').type(firstName);
        cy.get('[name="lastName"]').type(lastName);
        cy.get('[name="email"]').type(email);
        cy.get('[name="password"]').type('Polk000!');
        cy.get('[name="confirm_password"]').type('Polk000!');
        cy.get('[name="username"]').type(username);

        cy.get('form').submit();

        cy.wait(1000);
        cy.get('.cy-notif-valid').should('exist');
        cy.clearCookies();
    });

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
