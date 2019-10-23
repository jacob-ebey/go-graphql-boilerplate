package types

import (
	"github.com/graphql-go/graphql"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/config"
)

var AuthResponseType = graphql.NewObject(graphql.ObjectConfig{
	Name: "AuthResponse",
	Fields: graphql.Fields{
		"token": &graphql.Field{
			Type:        graphql.String,
			Description: "The auth token to include in the '" + config.JwtHeader + "' header.",
		},
		"user": &graphql.Field{
			Type:        UserType,
			Description: "The user the token in for.",
		},
	},
})
