const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
    });

    afterEach(() => {
        cy.signOut();
    });

    it('should delete Othername field', () => {
        cy.get('a[href="/update/structure"]').click();

        cy.get('[data-field="update/structure@names#1_otherName#0"]')
            .find('input')
            .type('OtherName#1');

        cy.get('[data-testid="btn-add"]').click();

        cy.get('[data-field="update/structure@names#1_otherName#1"]')
            .find('input')
            .type('OtherName#2');

        cy.get('[data-testid="btn-delete-autrenom#1"]').click();

        cy.get('[data-field="update/structure@names#1_otherName#1"]').should(
            'not.exist'
        );
    });

    it('should save Article Select field', () => {
        cy.get('a[href="/update/structure"]').click();

        cy.get('[data-field="update/structure@names#1_article#0"]')
            .find('select')
            .select('aux');

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.reload();

        cy.get('[data-field="update/structure@names#1_article#0"]')
            .find('select')
            .should('have.value', 'aux');
    });

    it('should save empty ShortName field', () => {
        cy.get('a[href="/update/structure"]').click();

        cy.get('[data-field="update/structure@names#1_shortName#0"]')
            .find('input')
            .type('ShortName');

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.reload();

        cy.get('[data-field="update/structure@names#1_shortName#0"]')
            .find('input')
            .type('ShortName');

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.reload();

        cy.get('[data-field="update/structure@names#1_shortName#0"]')
            .find('input')
            .should('have.value', '');
    });
});
