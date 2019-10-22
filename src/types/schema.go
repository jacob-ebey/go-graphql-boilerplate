package types

import (
	"github.com/graphql-go/graphql"
)

var SchemaType, _ = graphql.NewSchema(
	graphql.SchemaConfig{
		Query:    QueryType,
		Mutation: MutationType,
	},
)
