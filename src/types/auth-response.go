package types

import (
	"github.com/graphql-go/graphql"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/config"
)

var AuthResponseType = graphql.NewObject(graphql.ObjectConfig{
	Name: "AuthResponse",
	Fields: graphql.Fields{
		"refreshToken": &graphql.Field{
			Type:        graphql.String,
			Description: "The token to include in the '" + config.JwtHeader + "' header with the 'refreshToken' mutation. Example: '" + config.JwtType + " yourtokenhere'",
		},
		"token": &graphql.Field{
			Type:        graphql.String,
			Description: "The auth token to include in the '" + config.JwtHeader + "' header. Example: '" + config.JwtType + " yourtokenhere'",
		},
		"user": &graphql.Field{
			Type:        UserType,
			Description: "The user the token is for.",
		},
	},
})
