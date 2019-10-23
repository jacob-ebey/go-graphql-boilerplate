# Deploying to azure

## Publishing to Docker
```bash
> docker build . -t jacob9706/go-graphql-boilerplate
```

```bash
> docker push jacob9706/go-graphql-boilerplate
```

## Create a resource group

```bash
> az group create --name go-graphql-boilerplate-rg --location "West US"
```

## Create a service plan

```bash
> az appservice plan create --name go-graphql-boilerplate-sp --resource-group go-graphql-boilerplate-rg --sku F1 --is-linux
```

## Create the web app

```bash
> az webapp create --resource-group go-graphql-boilerplate-rg --plan go-graphql-boilerplate-sp  --name go-graphql-boilerplate --deployment-container-image-name jacob9706/go-graphql-boilerplate
```

# Configure envrionment variables

```bash
> az webapp config appsettings set --name go-graphql-boilerplate --resource-group go-graphql-boilerplate-rg --settings DATABASE_URL='postgres://username:password@host:5432/dbname' POSTGRESS_ADDRESS='host:5432' GO_SERVES_STATIC='true' ENVIRONMENT='production' JWT_SECRET='your-jwt-secret'
```

# View the status of the deployment

```bash
> az webapp log tail --name go-graphql-boilerplate --resource-group go-graphql-boilerplate-rg
```