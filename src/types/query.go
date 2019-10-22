package types

import (
	"github.com/graphql-go/graphql"

	"github.com/jacob-ebey/go-graphql-boilerplate/src/config"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/resolvers"
)

var QueryType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			"hello": &graphql.Field{
				Type:        graphql.String,
				Description: "Say hello!",
				Args: graphql.FieldConfigArgument{
					"name": &graphql.ArgumentConfig{
						Type: graphql.String,
					},
				},
				Resolve: resolvers.SayHello,
			},

			"todos": &graphql.Field{
				Type:        graphql.NewList(TodoType),
				Description: "List of todos.",
				Args: graphql.FieldConfigArgument{
					"skip": &graphql.ArgumentConfig{
						Type:         graphql.Int,
						DefaultValue: 0,
					},
					"limit": &graphql.ArgumentConfig{
						Type:         graphql.Int,
						DefaultValue: config.LimitDefault,
					},
				},
				Resolve: resolvers.GetTodos,
			},

			"todosLeft": &graphql.Field{
				Type:        graphql.NewNonNull(graphql.Int),
				Description: "The number of todos that are not complete.",
				Resolve:     resolvers.TodosLeft,
			},
		},
	},
)
