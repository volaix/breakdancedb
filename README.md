## Goal of App
APP = A power user's move database

Roadmap: https://trello.com/invite/b/io1dH18G/ATTI3b20ecf6d8200e4485972068f0d98e1aD9E2704F/dev-roadmap

1. MOVE LVL. video into shapes. Focus on move.
2. TRANSITIONS LVL. shapes into transitions. Focus on movement.
3. FLOW LVL. transitions into flow. Focus on dance.
4. COMBO LVL. flow into performance
5. NODE VIEW for isolation 
6. BONUS MAKE MOVES. rng images with custom weights. (eagle view)
* algorithm auto select moves for optimised learning
* node view and data to see what moves are most used/less used

### 1. MOVE GOAL
<img width="509" alt="image" src="https://github.com/volaix/breakdancedb/assets/16506248/5e3e6368-ee9b-4d4e-b5c2-6d2330627c0f">

### 2. TRANSITIONS GOAL
<img width="316" alt="image" src="https://github.com/volaix/breakdancedb/assets/16506248/69b6b258-8a51-4741-997e-a4acb62e2101">

### 5. NODE VIEW goal:
<img width="687" alt="image" src="https://github.com/volaix/breakdancedb/assets/16506248/a74a0760-47de-4a3b-bec2-30e0b7be46a8">

### 6. BONUS MAKE MOVE VIEW goal:
<img width="306" alt="image" src="https://github.com/volaix/breakdancedb/assets/16506248/e33b41b0-93e0-4274-939c-add8e219c6fb">

## Getting Started
1. yarn install
2. yarn dev
3. [http://localhost:3000](http://localhost:3000)

## Doing PRs
- "yarn format" to check prettier
- "yarn format:fix" to autofix
- "yarn ts" for fixing ts errors
- "yarn lint" for fixing linter errors
- Vercel accepts deployment in PR branch - has weird stuff that linter doesnt find
- Check for conflicts - "git merge main"


## Stack
- React - nextjs
- localstorage for db
- Tailwind CSS
- State management is not set. Zustand is installed but not currently used.

## Deploy
1. yarn build
2. yarn start
 
### Algorithm Tuner Ideas
* Difficulty of move
* How isolated is the node
* Ratio of transitions in, to transitions out
* How many shapes does the move have

# Stretch Goal

- addons: hand placements, anti hooks, "opposite side"
- user profiles on server
- shared data state between devices
- shared moves matcher to practice together
- begin to catalog every breaking movement with words and images
- bigdata- most loved transitions, most learned but isolated moves
