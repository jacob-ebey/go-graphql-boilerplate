# Deploying to Zeit Now

Zeit deployment is stupid simple, just do it:

```bash
> now -n go-graphql-boilerplate -e DATABASE_URL="postgres://username:password@host:5432/dbname" -e ENVIRONMENT="production" -e JWT_SECRET="your-jwt-secret"
```