package resolvers

import "github.com/graphql-go/graphql"

func SayHello(params graphql.ResolveParams) (interface{}, error) {
	name := params.Args["name"]

	if name == nil {
		name = "World"
	}

	return "Hello, " + name.(string) + "!", nil
}
