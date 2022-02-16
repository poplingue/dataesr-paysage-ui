const baseUrl = Cypress.env('baseUrl');

context('Structure new form infinite otherName and article', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
        cy.newStructure();
    });

    afterEach(() => {
        cy.signOut();
    });

    it('should save new Structure infinite otherName data', () => {
        cy.get('[data-field="update/structure@names#1_otherName#0"]')
            .find('input')
            .type('OtherName#0');

        cy.get('[data-testid="btn-add"]').click();

        cy.get('[data-field="update/structure@names#1_otherName#1"]')
            .find('input')
            .type('OtherName#1');

        cy.intercept('PATCH', '/api/structure/**').as('patch');

        cy.get('[data-testid="noms#1-save-button"]').click();

        cy.wait('@patch');

        cy.reload();

        cy.sectionsNoSticky();

        cy.get('[data-field="update/structure@names#1_otherName#0"]')
            .find('input')
            .should('have.value', 'OtherName#0');

        cy.get('[data-field="update/structure@names#1_otherName#1"]')
            .find('input')
            .should('have.value', 'OtherName#1');
    });

    it('should save new Structure article data', () => {
        cy.get('[data-field="update/structure@names#1_otherName#0"]')
            .find('input')
            .type('OtherName#0');

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.wait('@patch');

        cy.reload();

        cy.sectionsNoSticky();

        cy.get('[data-field="update/structure@names#1_otherName#0"]')
            .find('input')
            .should('have.value', 'OtherName#0');
    });
});
