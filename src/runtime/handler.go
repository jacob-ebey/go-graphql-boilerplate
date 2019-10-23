package runtime

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-pg/pg"
	"github.com/graphql-go/handler"

	"github.com/jacob-ebey/go-graphql-boilerplate/src/config"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/db"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/types"
)

type Executor struct {
	Handler *handler.Handler
	Context context.Context
	Close   func() error
}

func NewExecutor(pgOptions *pg.Options, dev bool) Executor {
	database, err := db.Connect(pgOptions, dev)
	if err != nil {
		panic(err)
	}

	ctx := context.WithValue(context.Background(), "database", database)

	fmt.Println("Database connected")

	return Executor{
		handler.New(
			&handler.Config{
				Schema:     &types.SchemaType,
				Pretty:     true,
				GraphiQL:   false,
				Playground: true,
			},
		),
		ctx,
		database.Close,
	}
}

func NewHandler(pgOptions *pg.Options, dev bool) (func(w http.ResponseWriter, r *http.Request), func() error) {
	executor := NewExecutor(pgOptions, dev)

	handler := func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get(config.JwtHeader)
		user := GetUserFromToken(authHeader)
		ctx := context.WithValue(executor.Context, "user", user)

		executor.Handler.ContextHandler(ctx, w, r)
	}

	return handler, executor.Close
}
