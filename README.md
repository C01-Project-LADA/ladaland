# LADA LAND #

## Description ##
LADA Land is a travel website designed to help users track their travel history, explore new destinations based on their preferences, and manage trip planning with personalized budgeting and visa requirements. Our platform gamifies travel by providing interactive maps, leaderboards, and social sharing features.

## Motivation ##
Many travelers struggle to keep track of where they’ve been and where they want to go. Existing solutions are fragmented—some use spreadsheets, others rely on scratch maps or various travel forums. LADA Land consolidates these needs into a single platform, making travel tracking, budgeting, and planning more engaging, accessible, and interactive. Our AI-driven recommendations and integrated social features enhance the travel experience by fostering a global community of explorers.

## Installation ##

### Prerequisites ###
Ensure you have the following tools installed:
* Node.js

### Setup ###
1. Clone the repository:
```
git clone https://github.com/UTSC-CSCC01-Software-Engineering-I/term-group-project-lada.git
cd term-group-project-lada
```
2. Install dependencies:
```
npm install && npm --prefix core install && npm --prefix client install
```
3. Set up the environment variables:
* Copy `.env.local` to `.env`
* Update the database URL and API keys as needed
4. Generate database:
```
npx prisma generate
```
5. Run database migrations:
```
npx prisma migrate dev
```
6. Start the development server:
```
npm run dev
```
7. You will now be able to access the frontend on `http://localhost:3000` and backend on `http://localhost:4000`

## Contribution ##
We welcome contributions! Follow the guidelines below to get involved.

### Git Workflow ###
* We use **Git Flow** to manage development.
* Branch naming conventions:
    * LADA-{ticket number}

### Issue Tracking ###

* We use Jira for issue tracking.
* Each feature or bug fix should have a corresponding Jira ticket.
* Pull requests should follow these guidelines:
    * Include a meaningful title and description.
    * Reference the related Jira ticket.

### Pull Requests ###
* Submit a pull request targeting `dev`
* Two reviews are needed to merge PR
* Merge only after passing test and reviews

LADA Land aims to make travel planning seamless and enjoyable—join us in building a community for explorers!