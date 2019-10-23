# Deploying to Heroku

## Create a heroku application (called go-graphql-boilerplate in this case)

```bash
> heroku create -s container go-graphql-boilerplate
```

## Provision database

```bash
> heroku addons:create heroku-postgresql:hobby-dev
```

## Configure environment variables

```bash
> heroku config:set ENVIRONMENT="production"
> heroku config:set IS_HEROKU=true
> heroku config:set GO_SERVES_STATIC=true
> heroku config:set JWT_SECRET="your-jwt-secret"
```

Even though the above database provisioning command added the DATABASE_URL environment variable for us,
the container startup process requies the host of the DB as another environment variable to verify that
it is up. To get your DATABASE_URL to figure out the DB host execute:

```bash
> heroku config:get DATABASE_URL
```

This will give you a connection string similar to:

```bash
> postgres://username:password@host:5432/dbname
```

We will extract the `host:5432` portion directly after the `@` and set it as our POSTGRESS_ADDRESS
environment variable:

```bash
> heroku config:set POSTGRESS_ADDRESS="host:5432"
```

## Deploy the application

```bash
> git push heroku master
```
