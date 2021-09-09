context('Structure form page', () => {
    beforeEach(() => {
        cy.deleteIndexDB();
        cy.visit('http://localhost:3000/structure/create');
    });

    it('should display current page BreadCrumbs', () => {
        cy.get('[data-cy="current-page"]').find('a').should('have.text', 'Ajouter une structure');
    });

    it('should switch toggle value', () => {
        cy.get('[data-cy="structure/create@etat#0/test#0"]').click();
        cy.get('[data-cy="structure/create@etat#0/test#0"]').find('input').should('be.checked');

        cy.get('[data-cy="structure/create@etat#0/test#0"]').click();
        cy.get('[data-cy="structure/create@etat#0/test#0"]').find('input').should('not.be.checked');
    });

    it('should render the Add button', () => {
        cy.get('[data-testid="btn-add-etat"]').should('exist');
    });

    it('should render new Toggle', () => {
        cy.get('[data-testid="btn-add-etat"]').click();
        cy.get('[data-cy="structure/create@etat#1/test#0"]').should('exist');
        cy.get('[data-testid="btn-delete-etat#1"]').should('exist');
    });

    it('should clean new Toggle', () => {
        cy.get('[data-testid="btn-add-etat"]').click();
        cy.get('[data-testid="btn-delete-etat#1"]').click({ force: true });
        cy.get('[data-cy="structure/create@etat#1/test#0"]').should('not.exist');
    });

    it('should expand accordion', () => {
        cy.get('[data-testid="accordion-button"]').eq(1).click();
        cy.get('[data-testid="accordion-button"]').eq(1).invoke('attr', 'aria-expanded').should('eq', 'false');
        cy.get('[data-testid="accordion-button"]').eq(1).click();
        cy.get('[data-testid="accordion-button"]').eq(1).invoke('attr', 'aria-expanded').should('eq', 'true');
    });

    it('should select catégorie 2 Type value', () => {
        cy.get('[data-testid="structure/create@categories#0/type#0"]').find('select').select('catégorie 2');
        cy.get('[data-testid="structure/create@categories#0/type#0"]').find('select').should('have.value', 'catégorie 2');
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
        cy.get('[data-testid="btn-delete-categories#1"]').click({ force: true });
        cy.get('.fr-accordion__btn').contains('Catégories#1').should('not.exist');
        cy.get('.fr-accordion__btn').contains('Catégories#0').should('exist');
        cy.get('[data-testid="btn-add-categories"]').should('exist');

    });

    it('should add, change and delete Catégorie section', () => {
        cy.get('[data-testid="structure/create@categories#0/type#0"]').find('select').select('catégorie 1');
        cy.get('[data-testid="btn-add-categories"]').click();
        cy.get('[data-testid="structure/create@categories#1/type#0"]').find('select').select('catégorie 2');
        cy.get('[data-testid="structure/create@categories#1/start-day#0"]').find('select').select('12');
        cy.get('[data-testid="structure/create@categories#1/end-month#0"]').find('select').select('12');
        cy.get('[data-testid="structure/create@categories#1/end-year#0"]').find('select').select('2012');
        cy.get('[data-testid="btn-add-categories"]').click();
        cy.get('[data-testid="structure/create@categories#2/end-day#0"]').find('select').select('1');
        cy.get('[data-testid="structure/create@categories#2/start-month#0"]').find('select').select('1');
        cy.get('[data-testid="structure/create@categories#2/end-year#0"]').find('select').select('2000');
        cy.get('[data-testid="btn-delete-categories#1"]').click({ force: true });

        cy.wait(1000);
        cy.get('[data-testid="structure/create@categories#1/end-day#0"]').find('select').should('have.value', '1');
        cy.get('[data-testid="structure/create@categories#1/start-month#0"]').find('select').should('have.value', '1');
        cy.get('[data-testid="structure/create@categories#1/end-year#0"]').find('select').should('have.value', '2000');
    });
    //
    it('should should select today date', () => {
        const now = new Date();

        cy.get('[data-testid="today-categories#0"]').first().click();
        cy.get('[data-testid="structure/create@categories#0/start-day#0"]').find('select').should('have.value', now.getDay());
        cy.get('[data-testid="structure/create@categories#0/start-month#0"]').find('select').should('have.value', now.getMonth() + 1);
        cy.get('[data-testid="structure/create@categories#0/start-year#0"]').find('select').should('have.value', now.getFullYear());

    });

    it('should should select 1st january date', () => {
        const now = new Date();

        cy.get('[data-testid="firstJanuary-categories#0"]').last().click();
        cy.get('[data-testid="structure/create@categories#0/end-day#0"]').find('select').should('have.value', '1');
        cy.get('[data-testid="structure/create@categories#0/end-month#0"]').find('select').should('have.value', '1');
        cy.get('[data-testid="structure/create@categories#0/end-year#0"]').find('select').should('have.value', now.getFullYear());

    });
});
