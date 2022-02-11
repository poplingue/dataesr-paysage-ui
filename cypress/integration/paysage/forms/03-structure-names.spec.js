const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);

        cy.newStructure();
    });

    afterEach(() => {
        cy.signOut();
    });

    it('should add Name section', () => {
        cy.get('[data-testid="btn-add-names"]').click();

        cy.get('[data-field="update/structure@names#2_officialName"]')
            .find('input')
            .should('be.visible');
    });

    it('should save in new section', () => {
        cy.get('[data-field="update/structure@names#1_officialName"]')
            .find('input')
            .type('Officiel1', { force: true });

        cy.get('[data-testid="noms#1-save-button"]').click({ force: true });
        cy.wait('@patch');

        cy.get('[data-testid="btn-add-names"]').click();

        cy.get('[data-field="update/structure@names#2_officialName"]')
            .find('input')
            .type('Officiel2', { force: true });

        cy.get('[data-testid="noms#2-save-button"]').click({ force: true });
        cy.wait('@patch');

        cy.reload();
        cy.sectionsNoSticky();

        cy.get('[data-field="update/structure@names#2_officialName"]')
            .find('input')
            .should('have.value', 'Officiel2');
    });

    it('should delete new section', () => {
        cy.intercept('DELETE', '/api/structure/**').as('delete');
        cy.intercept('PATCH', '/api/structure/**').as('patch');

        cy.get('[data-field="update/structure@names#1_brandName"]')
            .find('input')
            .type('Brand1', { force: true });

        cy.get('[data-testid="noms#1-save-button"]').click({ force: true });
        cy.wait('@patch');

        cy.get('[data-testid="btn-add-names"]').click();

        cy.get('[data-field="update/structure@names#2_brandName"]')
            .find('input')
            .type('Brand2', { force: true });

        cy.get('[data-testid="btn-delete-noms#2"]').click({ force: true });
        cy.wait('@delete');

        cy.get('[data-field="update/structure@names#2_officialName"]').should(
            'not.exist'
        );
    });
});
