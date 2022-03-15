const baseUrl = Cypress.env('baseUrl');

context('Structure new form infinite otherName and article', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/contrib`);
        cy.newStructure();
    });

    afterEach(() => {
        cy.signOut();
    });

    it('should save new Structure infinite otherName data', () => {
        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;

            cy.get(`[data-field="contrib/structure@names#${id}_otherNames#0"]`)
                .find('input')
                .type('OtherName#0');

            cy.get('[data-testid="btn-add"]').click();

            cy.intercept('PATCH', '/api/structure/**').as('patch');

            cy.get(`[data-field="contrib/structure@names#${id}_otherNames#1"]`)
                .find('input')
                .type('OtherName#1');

            cy.get(`[data-testid="names#${id}-save-button"]`).click();
            cy.wait('@patch');

            cy.reload();

            cy.sectionsNoSticky();

            cy.get(`[data-field="contrib/structure@names#${id}_otherNames#0"]`)
                .find('input')
                .should('have.value', 'OtherName#0');

            cy.get(`[data-field="contrib/structure@names#${id}_otherNames#1"]`)
                .find('input')
                .should('have.value', 'OtherName#1');
        });
    });

    it('should save new Structure article data', () => {
        cy.getCookie('nameId').then((cookie) => {
            cy.intercept('PATCH', '/api/structure/**').as('patch');

            const id = cookie.value;

            cy.get(`[data-field="contrib/structure@names#${id}_otherNames#0"]`)
                .find('input')
                .type('OtherName#0');

            cy.get(`[data-testid="names#${id}-save-button"]`).click();
            cy.wait('@patch');

            cy.reload();

            cy.sectionsNoSticky();

            cy.get(`[data-field="contrib/structure@names#${id}_otherNames#0"]`)
                .find('input')
                .should('have.value', 'OtherName#0');
        });
    });
});
