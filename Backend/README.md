Things to do to set up the backend locally
- Have node installed
- Create a `.env` file in the Backend root directory where you can set your local port for testing
  (use `PORT=[port you want to run on]`)
- Run `npm install` to install all dependencies (once)
- Run `npx ts-jest config:init` to configure the jest file
- Run `npm run dev` to run the server (make sure you saved all changes beforehand)

For testing run `npm run test`