package types

import (
	"github.com/graphql-go/graphql"
)

var TodoType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Todo",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"text": &graphql.Field{
				Type: graphql.NewNonNull(graphql.String),
			},
			"completed": &graphql.Field{
				Type: graphql.Boolean,
			},
		},
	},
)
