# xiuu-app-backend

## Config
~~~
cd xiuu-app-backend
type nul > .env
~~~

### File .env Configuration
- `ACCESS_TOKEN_LIFE=<time>`
-   For example, "5d" - 5 days.
- `REFRESH_TOKEN_LIFE=<time>`
-   For example, "3m" - 3 months.
- `ACCESS_TOKEN_SECRET=<secret-string>`
- `REFRESH_TOKEN_SECRET=<secret-string>`
- `CONNECT_DATABASE_STRING=<connect-string>`
- `PORT=5000`

## Install
~~~
npm install
~~~
## Run
~~~
npm start
~~~