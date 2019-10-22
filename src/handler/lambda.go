package handler

import (
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/graphql-go/graphql"

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
			log.Print("Could not decode body", err)
		}

		result := graphql.Do(graphql.Params{
			Schema:         *executor.Handler.Schema,
			Context:        executor.Context,
			OperationName:  params.OperationName,
			RequestString:  params.Query,
			VariableValues: params.Variables,
		})

		response, err := json.Marshal(result)
		if err != nil {
			log.Print("Could not decode body")
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
