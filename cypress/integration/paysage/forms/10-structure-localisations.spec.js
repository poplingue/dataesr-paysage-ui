const baseUrl = Cypress.env('baseUrl');

context('Structure localisation', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/contrib`);
        cy.newStructure();
    });

    it('Locality should display suggestions', () => {
        cy.getCookie('localisationId').then((cookie) => {
            const id = cookie.value;

            cy.intercept('POST', '/api/public?validatorId=locality').as(
                'search'
            );

            cy.get(
                `[data-field="contrib/structure@localisations#${id}_locality"]`
            )
                .find('input')
                .type('Nantes');

            cy.wait('@search');

            cy.get('[data-cy="suggestions"]').should('be.visible');
        });
    });

    it('On blur should close suggestions', () => {
        cy.getCookie('localisationId').then((cookie) => {
            const id = cookie.value;

            cy.intercept('POST', '/api/public?validatorId=locality').as(
                'search'
            );

            cy.get(
                `[data-field="contrib/structure@localisations#${id}_locality"]`
            )
                .find('input')
                .type('Nantes');

            cy.wait('@search');

            cy.get(
                `[data-field="contrib/structure@localisations#${id}_telephone"]`
            )
                .find('input')
                .type('09');

            cy.get('[data-cy="suggestions"]').should('not.exist');
        });
    });

    it('On click should pick locality and postalCode', () => {
        cy.getCookie('localisationId').then((cookie) => {
            const id = cookie.value;

            cy.intercept('POST', '/api/public?validatorId=locality').as(
                'search'
            );

            cy.get(
                `[data-field="contrib/structure@localisations#${id}_locality"]`
            )
                .find('input')
                .type('bordeaux');

            cy.wait('@search');

            cy.get('[data-cy="suggestions"]')
                .contains('Bordeaux-en-Gâtinais - 45041')
                .click();

            cy.get(
                `[data-field="contrib/structure@localisations#${id}_locality"]`
            )
                .find('input')
                .should('have.value', 'Bordeaux-en-Gâtinais');
            cy.get(
                `[data-field="contrib/structure@localisations#${id}_postalCode"]`
            )
                .find('input')
                .should('have.value', '45041');
        });
    });
});
