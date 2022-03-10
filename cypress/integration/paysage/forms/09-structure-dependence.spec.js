const baseUrl = Cypress.env('baseUrl');

context('Structure fields dependence', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
        cy.newStructure();
    });

    it('Acronyme En should not be visible', () => {
        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;

            cy.get(`[data-field="update/structure@names#${id}_acronymEn"]`)
                .find('input')
                .should('not.be.visible');
        });
    });

    it('On change Name En should display Acronyme En', () => {
        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;
            cy.get(`[data-field="update/structure@names#${id}_nameEn"]`)
                .find('input')
                .type('English');

            cy.get(`[data-field="update/structure@names#${id}_acronymEn"]`)
                .find('input')
                .should('be.visible');
        });
    });
});
