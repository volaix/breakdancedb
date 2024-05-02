## Goal of App
* Database of users breaking moves
* 3 moves. Focus on dance. Called FLOW view.
* 2 moves. Focus on movement. Called TRANSITION view.
* 1 move. Focus on shapes. Called MOVE view.
* algorithm auto select moves for optimised learning
* node view and data to see what moves are most used/less used

###Algorithm Tuner Ideas
* Difficulty of move
* How isolated is the node
* Ratio of transitions in, to transitions out
* How many shapes does the move have
 
## Getting Started
1. yarn install
2. yarn dev
3. [http://localhost:3000](http://localhost:3000)


## Tech
- Next.js
- Tailwind CSS
- State management is not set. Zustand is installed but not currently used.

## Deploy Plan
* Probably will use Vercel for hosting
1. yarn build
2. yarn start

#Stretch Goal
* addons: hand placements, anti hooks, "opposite side" 
* user profiles on server
 * shared data state between devices
* shared moves matcher to practice together
* begin to catalog every breaking movement with words and images
* bigdata- most loved transitions, most learned but isolated moves
