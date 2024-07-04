Things to do to set up the backend locally

- Have node installed
- Create a `.env` file in the Backend root directory where you can set your local port for testing
  (use `PORT=[port you want to run on]`)
- Run `npm install` to install all dependencies (once)
- Run `npx ts-jest config:init` to configure the jest file
- Run `npm run dev` to run the server (make sure you saved all changes beforehand)

For testing run `npm run test`

To work with Prisma:

- Add the connection string to the `.env` file in the Backend root directory  
  (use `DATABASE_URL="sqlserver://NATSQLDEVAPPS2\INS2;database=AQC_Dev;integratedSecurity=true;trustServerCertificate=true;"`)
- Run `npx prisma generate` to generate the Prisma Client to reflect the schema. This will need to be reran when changes are made in schema.prisma.
- Run `npm run seed` to populate the database with predefined data. This will need to be reran when changes are made in seed.ts
- Run `npx prisma db push` to quickly apply changes made in our Prisma schema to the database (this does not generate a migration file)
- Run `npx prisma migrate dev --name [name_of_migration]` to do the above but generate a migration file. At the moment this will not work