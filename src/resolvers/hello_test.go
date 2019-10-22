package resolvers

import (
	"testing"

	"github.com/graphql-go/graphql"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/test"
)

func TestSayHello(t *testing.T) {
	res, err := SayHello(graphql.ResolveParams{
		Args: map[string]interface{}{
			"name": "",
		},
	})

	test.AssertEqual(t, err, nil)
	test.AssertEqual(t, res, "Hello, World!")
}

func TestSayHelloToName(t *testing.T) {
	args := map[string]interface{}{
		"name": "test",
	}

	res, err := SayHello(graphql.ResolveParams{
		Args: args,
	})

	test.AssertEqual(t, err, nil)
	test.AssertEqual(t, res, "Hello, test!")
}
