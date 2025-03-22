/// <reference types="cypress" />

function generateRandomUser() {
    const randomSuffix = Math.floor(Math.random() * 1000000);
    const username = `testuser${randomSuffix}`;
    const email = `testuser${randomSuffix}@example.com`;
    return { username, email };
}

describe('User Registration', () => {
    beforeEach(() => {
        cy.intercept('POST', 'http://localhost:4000/api/register').as('registerUser');
  
        cy.visit('http://localhost:3000/welcome');
    });
  
    it('should register a new user with randomized username and email', () => {
        const { username, email } = generateRandomUser();
  
        cy.get('#get-started').click({ force: true });
  
        cy.get('input').eq(0).type(username);
        cy.get('input').eq(1).type(email);
        cy.get('input').eq(2).type('password123');
        cy.get('input').eq(3).type('password123');
  
        cy.get('button[type="submit"]').contains('SIGN UP').click();
  
        cy.wait('@registerUser').its('response.statusCode').should('eq', 201);
  
        cy.url().should('eq', 'http://localhost:3000/home', { timeout: 15000 });
    });
});

describe('Create a Post', () => {
    beforeEach(() => {
      cy.intercept('POST', 'http://localhost:4000/api/posts').as('createPost');
  
      cy.intercept('GET', /http:\/\/localhost:4000\/api\/posts.*/).as('getPosts');
  
      cy.visit('http://localhost:3000/social');
    });
  
    it('should create a post and display it in the feed', () => {
        cy.wait('@getPosts');
    
        cy.contains('LOCATION').click();
    
        cy.contains('button', 'Albania').click({ force: true });
    
        const postContent = `Hello from Albania! ${Date.now()}`;
        cy.get('textarea[placeholder="What\'s on your mind?"]')
            .type(postContent);
    
        cy.contains('POST').click();
    
        cy.wait('@createPost')
            .its('response.statusCode')
            .should('eq', 201);
    
        cy.wait('@getPosts');
    
        cy.contains(postContent).should('be.visible');
    });
  });

describe('Logout Test', () => {
    beforeEach(() => {
        cy.intercept('POST', 'http://localhost:4000/api/logout').as('logout');
        cy.visit('http://localhost:3000/home');
    });
  
    it('logs out on hover + click', () => {
        cy.contains('PROFILE').realHover();
        
        cy.wait(200);
    
        cy.contains('LOG OUT').should('be.visible').click();
    
        cy.wait('@logout').its('response.statusCode').should('eq', 200);
    
        cy.url().should('eq', 'http://localhost:3000/welcome');
    });
});