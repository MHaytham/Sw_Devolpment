# CampusConnect

AI-Enhanced Campus Community Platform — GIU, Software Engineering, Summer 2026 Round II.

A MERN web platform where GIU students browse and RSVP to campus events, club leaders
create and manage their own events, and admins approve club leader accounts.

## Tech Stack

MongoDB · Mongoose · Express · React · Node.js · JWT

## Author

| Name | GIU ID |
|---|---|
| Mohamed Yasser | TBD |

Solo project — all branches, pull requests and commits are by the single author.

## Setup

```bash
npm install
cp .env.example .env    # then put your real MONGO_URI in .env
npm start               # connects to MongoDB and registers the models
```

## Models

- `src/models/User.js` — students, club leaders and admins in one collection, split by `role`
- `src/models/Event.js` — events created by club leaders
- `src/models/Registration.js` — links a student to an event; a compound unique index on
  `{ user, event }` stops a student registering for the same event twice

## Milestones

- Task 1 — Git workflow and Mongoose schemas
- Task 2 — Express API, JWT auth, role-based access control, Hugging Face integration
- Task 3 — React frontend
