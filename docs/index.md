# GO GraphQL Boilerplate

A simple to uses, deploys anywhere boilerplate to get you going in GO and GraphQL.

Example: https://go-graphql-boilerplate.herokuapp.com/


## Getting started

Get started by installing GO and Node(NPM), then cloneing this repo.

Once cloned, install the GO dependencies:

```shell
> go get ./...
```

CD into the `frontend` directory and install the NPM dependencies:

```shell
> npm install
```


## Dev mode

Create A .env file in the root of the project, feel free to copy or rename the .env.example file. This is pre-configured for use with the docker-compose.yml file provied.

Configure a combination of the following properties:

```
DATABASE_URL="postgres://postgres@localhost:54320/postgres"
POSTGRESS_ADDRESS="localhost:54320"
JWT_SECRET="your-jwt-secret"
GO_SERVES_STATIC="true"
ENVIRONMENT="development"
PORT="8080"
```

OR

```
POSTGRESS_ADDRESS="localhost:54320"
POSTGRESS_DATABASE="postgres"
POSTGRESS_USER="postgres"
POSTGRESS_PASSWORD=""
JWT_SECRET="your-jwt-secret"
GO_SERVES_STATIC="true"
ENVIRONMENT="development"
PORT="8080"
```

Both of the above configs are valid for the docker-compose.yml file provided. To spin up your DB, run:

```bash
> docker-compose up -d
```

Now we can start the GO backend. In if `ENVIRONMENT` is set to development, we will get auto rebuilding of the frontend.


## Production

You have a few options for deploying the boilerplate out of the box:

- [Azure](azure)
- [Heroku](heroku)
- [Zeit Now](zeit-now)
