const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
    });

    afterEach(() => {
        cy.signOut();
    });

    it('should save Article Select field', () => {
        cy.get('[data-cy="update/structure"]').click();

        cy.get('[data-field="update/structure@names#1_article"]')
            .find('select')
            .select('aux', { force: true });

        cy.intercept('PATCH', '/api/structure/**').as('patch');

        cy.get('[data-testid="noms#1-save-button"]').click({ force: true });

        cy.wait('@patch');
        cy.reload();

        cy.get('[data-field="update/structure@names#1_article"]')
            .find('select')
            .should('have.value', 'aux');
    });

    it('should delete Othername field', () => {
        cy.get('[data-cy="update/structure"]').click();

        cy.get('[data-field="update/structure@names#1_otherName#0"]')
            .find('input')
            .type('OtherName#0', { force: true });

        cy.get('[data-testid="btn-add"]').click({ force: true });

        cy.get('[data-field="update/structure@names#1_otherName#1"]')
            .find('input')
            .type('OtherName#1', { force: true });

        cy.intercept('DELETE', '/api/structure/**').as('delete');

        cy.get('[data-testid="btn-delete-autrenom#1"]').click({ force: true });

        cy.wait('@delete');

        cy.get('[data-field="update/structure@names#1_otherName#1"]').should(
            'not.exist'
        );
    });

    it('should save empty ShortName field', () => {
        cy.get('[data-cy="update/structure"]').click();

        cy.get('[data-field="update/structure@names#1_shortName"]')
            .find('input')
            .type('ShortName', { force: true });

        cy.intercept('PATCH', '/api/structure/**').as('ShortName');

        cy.get('[data-testid="noms#1-save-button"]').click({ force: true });

        cy.wait('@ShortName');

        cy.reload();

        cy.get('[data-field="update/structure@names#1_shortName"]')
            .find('input')
            .type('toutouyoutou', { force: true })
            .clear();

        cy.intercept('PATCH', '/api/structure/**').as('NoShortName');

        cy.get('[data-testid="noms#1-save-button"]').click({ force: true });

        cy.wait('@NoShortName');

        cy.reload();

        cy.get('[data-field="update/structure@names#1_shortName"]')
            .find('input')
            .should('have.value', '');
    });
});
