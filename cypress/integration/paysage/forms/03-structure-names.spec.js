const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
    });

    afterEach(() => {
        cy.signOut();
    });

    it('should add Name section', () => {
        cy.get('a[href="/update/structure"]').click();

        cy.get('[data-testid="btn-add-names"]').click();

        cy.get('[data-field="update/structure@names#2_officialName#0"]')
            .find('input')
            .should('be.visible');
    });

    it('should save in new section', () => {
        cy.get('a[href="/update/structure"]').click();

        cy.intercept('PATCH', '/api/structure/**').as('patch');

        cy.get('[data-field="update/structure@names#1_officialName#0"]')
            .find('input')
            .type('Officiel1');

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.wait('@patch');

        cy.get('[data-testid="btn-add-names"]').click();

        cy.get('[data-field="update/structure@names#2_officialName#0"]')
            .find('input')
            .type('Officiel2');

        cy.get('[data-testid="noms#2-save-button"]').click();
        cy.wait('@patch');

        cy.reload();

        cy.get('[data-field="update/structure@names#2_officialName#0"]')
            .find('input')
            .should('have.value', 'Officiel2');
    });

    it('should delete new section', () => {
        cy.get('a[href="/update/structure"]').click();

        cy.intercept('DELETE', '/api/structure/**').as('delete');
        cy.intercept('PATCH', '/api/structure/**').as('patch');

        cy.get('[data-field="update/structure@names#1_brandName#0"]')
            .find('input')
            .type('Brand1');

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.wait('@patch');

        cy.get('[data-testid="btn-add-names"]').click();

        cy.get('[data-field="update/structure@names#2_brandName#0"]')
            .find('input')
            .type('Brand2');

        cy.get('[data-testid="btn-delete-noms#2"]').click();
        cy.wait('@delete');

        cy.get('[data-field="update/structure@names#2_officialName#0"]').should(
            'not.exist'
        );
    });
});
