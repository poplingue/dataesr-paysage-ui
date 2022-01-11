const baseUrl = Cypress.env('baseUrl');

context('Structure form page', () => {
    beforeEach(() => {
        cy.deleteIndexDB();
        cy.visit(`${baseUrl}/demo/structure`);
    });

    it('should switch toggle value', () => {
        cy.get('[data-cy="demo/structure@etat#0/test#0"]').click();
        cy.get('[data-cy="demo/structure@etat#0/test#0"]')
            .find('input')
            .should('be.checked');

        cy.get('[data-cy="demo/structure@etat#0/test#0"]').click();
        cy.get('[data-cy="demo/structure@etat#0/test#0"]')
            .find('input')
            .should('not.be.checked');
    });

    it('should render the Add button', () => {
        cy.get('[data-testid="btn-add-etat"]').should('exist');
    });

    it('should render new Toggle', () => {
        cy.get('[data-testid="btn-add-etat"]').click();
        cy.get('[data-cy="demo/structure@etat#1/test#0"]').should('exist');
        cy.get('[data-testid="btn-delete-etat#1"]').should('exist');
    });

    it('should clean new Toggle', () => {
        cy.get('[data-testid="btn-add-etat"]').click();
        cy.get('[data-testid="btn-delete-etat#1"]').click({ force: true });
        cy.get('[data-cy="demo/structure@etat#1/test#0"]').should('not.exist');
    });

    it('should expand accordion', () => {
        cy.get('[data-cy="accordion"]')
            .eq(1)
            .find('.fr-accordion__btn')
            .click();
        cy.get('[data-cy="accordion"]')
            .eq(1)
            .find('.fr-accordion__btn')
            .invoke('attr', 'aria-expanded')
            .should('eq', 'false');
        cy.get('[data-cy="accordion"]')
            .eq(1)
            .find('.fr-accordion__btn')
            .click();
        cy.get('[data-cy="accordion"]')
            .eq(1)
            .find('.fr-accordion__btn')
            .invoke('attr', 'aria-expanded')
            .should('eq', 'true');
    });

    it('should select catégorie 2 Type value', () => {
        cy.get('[data-testid="demo/structure@categories#0/type#0"]')
            .find('select')
            .select('catégorie 2');
        cy.get('[data-testid="demo/structure@categories#0/type#0"]')
            .find('select')
            .should('have.value', 'catégorie 2');
    });

    it('should select Potentiel État value', () => {
        cy.get('[data-cy="Potentiel"]').find('label').click();
        cy.get('[data-cy="Potentiel"]').find('input').should('be.checked');
    });

    it('should add Catégorie section', () => {
        cy.get('[data-testid="btn-add-categories"]').click();
        cy.get('.fr-accordion__btn').contains('Catégories#1').should('exist');
    });

    it('should delete Catégorie section', () => {
        cy.get('[data-testid="btn-add-categories"]').click();
        cy.get('[data-testid="btn-delete-categories#1"]').click({
            force: true,
        });
        cy.get('.fr-accordion__btn')
            .contains('Catégories#1')
            .should('not.exist');
        cy.get('.fr-accordion__btn').contains('Catégories#0').should('exist');
        cy.get('[data-testid="btn-add-categories"]').should('exist');
    });

    it('should add, change and delete Catégorie section', () => {
        cy.get('[data-testid="demo/structure@categories#0/type#0"]')
            .find('select')
            .select('catégorie 1');
        cy.get('[data-testid="btn-add-categories"]').click();
        cy.get('[data-testid="demo/structure@categories#1/type#0"]')
            .find('select')
            .select('catégorie 2');
        cy.get('[data-testid="demo/structure@categories#1/startday#0"]')
            .find('select')
            .select('12');
        cy.get('[data-testid="demo/structure@categories#1/endmonth#0"]')
            .find('select')
            .select('12');
        cy.get('[data-testid="demo/structure@categories#1/endyear#0"]')
            .find('select')
            .select('2012');
        cy.get('[data-testid="btn-add-categories"]').click();
        cy.get('[data-testid="demo/structure@categories#2/endday#0"]')
            .find('select')
            .select('1');
        cy.get('[data-testid="demo/structure@categories#2/startmonth#0"]')
            .find('select')
            .select('1');
        cy.get('[data-testid="demo/structure@categories#2/endyear#0"]')
            .find('select')
            .select('2000');
        cy.get('[data-testid="btn-delete-categories#1"]').click({
            force: true,
        });

        cy.wait(1000);
        cy.get('[data-testid="demo/structure@categories#1/endday#0"]')
            .find('select')
            .should('have.value', '1');
        cy.get('[data-testid="demo/structure@categories#1/startmonth#0"]')
            .find('select')
            .should('have.value', '1');
        cy.get('[data-testid="demo/structure@categories#1/endyear#0"]')
            .find('select')
            .should('have.value', '2000');
    });
    //
    it('should select today date', () => {
        const now = new Date();

        cy.get('[data-testid="today-categories#0"]').first().click();
        cy.get('[data-testid="demo/structure@categories#0/startday#0"]')
            .find('select')
            .should('have.value', now.getDate());
        cy.get('[data-testid="demo/structure@categories#0/startmonth#0"]')
            .find('select')
            .should('have.value', now.getMonth() + 1);
        cy.get('[data-testid="demo/structure@categories#0/startyear#0"]')
            .find('select')
            .should('have.value', now.getFullYear());
    });

    it('should select 1st january date', () => {
        const now = new Date();

        cy.get('[data-testid="firstJanuary-categories#0"]').last().click();
        cy.get('[data-testid="demo/structure@categories#0/endday#0"]')
            .find('select')
            .should('have.value', '1');
        cy.get('[data-testid="demo/structure@categories#0/endmonth#0"]')
            .find('select')
            .should('have.value', '1');
        cy.get('[data-testid="demo/structure@categories#0/endyear#0"]')
            .find('select')
            .should('have.value', now.getFullYear());
    });
});
