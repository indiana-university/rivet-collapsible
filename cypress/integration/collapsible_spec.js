const COLLAPSIBLE_BUTTON = '[data-collapsible="default-collapsible"]';
const COLLAPSIBLE_CONTENT = '#default-collapsible';
const DEV_SERVER = "http://localhost:3000";

describe('Rivet collapsible interactions', function() {
  it('Click the default Rivet collapsible toggle button', function() {
    cy.visit(DEV_SERVER);

    cy.get(COLLAPSIBLE_BUTTON)
      .click()
      .should('have.attr', 'aria-expanded', 'true');

    cy.get(COLLAPSIBLE_CONTENT)
      .should('have.attr', 'aria-hidden', 'false')
      .and('be.visible');

    cy.get(COLLAPSIBLE_BUTTON)
      .click()
      .should('have.attr', 'aria-expanded', 'false');

    cy.get(COLLAPSIBLE_CONTENT)
      .should('have.attr', 'aria-hidden', 'true')
      .and('be.hidden');
  });
});

describe('Collapsible API methods', function() {
  it('Call the .open() method', function() {
    cy.visit(DEV_SERVER);
    cy.window().then(win => {
      const toggleButton = win.document.querySelector(COLLAPSIBLE_BUTTON);
      win.Collapsible.open(toggleButton);
    });

    cy.get(COLLAPSIBLE_BUTTON).should('have.attr', 'aria-expanded', 'true');

    cy.get(COLLAPSIBLE_CONTENT)
      .should('have.attr', 'aria-hidden', 'false')
      .and('be.visible');
  });

  it('Call the .close() method', function() {
    cy.window().then(win => {
      const toggleButton = win.document.querySelector(COLLAPSIBLE_BUTTON);
      win.Collapsible.close(toggleButton);
    });

    cy.get(COLLAPSIBLE_BUTTON).should('have.attr', 'aria-expanded', 'false');

    cy.get(COLLAPSIBLE_CONTENT)
      .should('have.attr', 'aria-hidden', 'true')
      .and('be.hidden');
  });
});
