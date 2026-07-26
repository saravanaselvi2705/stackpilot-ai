describe('StackPilot AI - Cypress Smoke & Sanity Test Suite', () => {
  const baseUrl = Cypress.env('BASE_URL') || 'https://stackpilot-ai-seven.vercel.app';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('CY-01: Verifies Landing Page and Branding Elements', () => {
    cy.get('h1').should('exist');
    cy.contains('StackPilot').should('be.visible');
  });

  it('CY-02: User Login and Session Initialization', () => {
    cy.visit(`${baseUrl}/login`);
    cy.get('input[type="email"]').clear().type('admin@stackpilot.ai');
    cy.get('input[type="password"]').clear().type('password123');
    cy.get('button').contains('Log In').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Active Projects').should('be.visible');
  });

  it('CY-03: Negative Test - Invalid User Authentication', () => {
    cy.visit(`${baseUrl}/login`);
    cy.get('input[type="email"]').clear().type('invalid_user@stackpilot.ai');
    cy.get('input[type="password"]').clear().type('wrongpass');
    cy.get('button').contains('Log In').click();

    cy.get('.text-red-400').should('be.visible');
  });

  it('CY-04: Navigation Guard Protection Test', () => {
    // Clear tokens
    cy.clearLocalStorage();
    // Attempt direct access to protected /dashboard
    cy.visit(`${baseUrl}/dashboard`);
    // Should be redirected back to /login
    cy.url().should('include', '/login');
  });

  it('CY-05: AI Studio Generator Verification', () => {
    cy.visit(`${baseUrl}/login`);
    cy.get('input[type="email"]').clear().type('admin@stackpilot.ai');
    cy.get('button').contains('Log In').click();

    cy.visit(`${baseUrl}/ai-studio`);
    cy.contains('AI Workflow Assistants').should('be.visible');
  });
});
