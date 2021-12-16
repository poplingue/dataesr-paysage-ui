const baseUrl = Cypress.env('baseUrl');

context('Person form page', () => {
    it('should create a Mollie', () => {
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
        cy.get('.psg-header-page')
            .find('h2')
            .should('have.text', 'Activer mon compte');
    });

    it('should signIn as Mollie', () => {
        // cy.signup();

        cy.visit(`${baseUrl}/account/sign-in`);

        cy.get('[name="account"]').type('mollie.dickinson@email.com');
        cy.get('[name="password"]').type('Polk000!');
        cy.get('form').submit();

        cy.wait(1000);
        cy.get('.psg-header-page')
            .find('h2')
            .should('have.text', 'Activer mon compte');
    });
});
