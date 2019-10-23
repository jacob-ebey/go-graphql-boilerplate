package handler

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/graphql-go/graphql"

	"github.com/jacob-ebey/go-graphql-boilerplate/src/config"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/runtime"
)

func NewLambdaHandler(executor runtime.Executor) func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var params struct {
		Query         string                 `json:"query"`
		OperationName string                 `json:"operationName"`
		Variables     map[string]interface{} `json:"variables"`
	}

	return func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		if err := json.Unmarshal([]byte(request.Body), &params); err != nil {
			return events.APIGatewayProxyResponse{
				Body:       `{"errors": [{ message: "Invalid request body." }]}`,
				StatusCode: 400,
			}, nil
		}

		authHeader := request.Headers[config.JwtHeader]
		user := runtime.GetUserFromToken(authHeader)
		ctx := context.WithValue(executor.Context, "user", user)

		result := graphql.Do(graphql.Params{
			Schema:         *executor.Handler.Schema,
			Context:        ctx,
			OperationName:  params.OperationName,
			RequestString:  params.Query,
			VariableValues: params.Variables,
		})

		response, err := json.Marshal(result)
		if err != nil {
			fmt.Println("Could not encode response body")
		}

		return events.APIGatewayProxyResponse{
			Body:       string(response),
			StatusCode: 200,
		}, nil
	}
}

// func main() {
// 	executor := runtime.NewExecutor(config.GetPgOptions(), false)
// 	defer executor.Close()

// 	lambda.Start(NewLambdaHandler(executor))
// }
