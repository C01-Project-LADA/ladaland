# LADA Land

## Iteration 04

- **Start Date:** Mar 24, 2025
- **End Date:** Apr 04, 2025

---

## Process

### Roles & Responsibilities

- **Core Developers:**  
  Andrey Zinovyev, Daniel Alyoshin, Elizabeth Ilina  
  *Develop backend/core systems.*

- **Client Developers:**  
  Andre Fong, Elizabeth Ilina 
  *Develop frontend/client systems.*

### Events

- **Daily Async Standup:**  
  Post updates in the standup channel using the Y/T format:
  - **Y:** What you did yesterday.
  - **T:** What you will do today.

- **Weekly Group Call:**  
  A 30-minute meeting every Sunday to discuss progress, blockers, and solutions.

### Artifacts

- **JIRA Board:**  
  All stories and tasks are tracked on a single JIRA board. Tickets are processed on a first-come, first-served basis and are labeled as CORE, CLIENT, or Integration. Additional tasks not covered by these labels are available for anyone to pick up.

---

## Product

### Goals and Tasks

- **Image uploads for posts:**  
  Аs an existing user, I would like to upload an image to my post about my trips and experiences so that I can share real footage with others and inspire other travelers.

- **[Client] AI Budget-based travel suggestions:**
  Аs an existing user, I would like to input my budget and receive travel suggestions, so that I can explore options within my financial means.

- **CI/CD:**  
  As an existing user or a potential new user, I want to go to [ladaland.com](https://ladaland.com/), so that I can use all of LADA LAND's wonderful features from any web browser.

- **Map Bug Fix:**
  Bug: When marking some countries as 'visited' (like France and Norway), it also implicitly selected other countries. For ex., when a user marked France as 'visited', it also marked Norway as 'visited' and vice versa. 
  Desired output: when user marks a country as 'visited', only that country should be marked as 'visited'.

### Artifacts

For the purpose of the presentation, one or more team members will share their screens and use their localhost on the up-to-date development branch to demonstrate our progress. We can also use Postman for more precise API calls if necessary.
