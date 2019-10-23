package types

import (
	"github.com/graphql-go/graphql"
)

var UserType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "User",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"email": &graphql.Field{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
	},
)
