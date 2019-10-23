package types

import (
	"github.com/graphql-go/graphql"

	"github.com/jacob-ebey/go-graphql-boilerplate/src/resolvers"
)

var MutationType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Mutation",
		Fields: graphql.Fields{
			"createTodo": &graphql.Field{
				Type:        TodoType,
				Description: "Create a new todo.",
				Args: graphql.FieldConfigArgument{
					"text": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: resolvers.CreateTodo,
			},

			"editTodo": &graphql.Field{
				Type:        TodoType,
				Description: "Update a todo.",
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.Int),
					},
					"text": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: resolvers.EditTodo,
			},

			"markTodo": &graphql.Field{
				Type:        TodoType,
				Description: "Update a todo status.",
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.Int),
					},
					"completed": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.Boolean),
					},
				},
				Resolve: resolvers.MarkTodoCompleted,
			},

			"deleteTodo": &graphql.Field{
				Type:        TodoType,
				Description: "Delete a todo.",
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.Int),
					},
				},
				Resolve: resolvers.DeleteTodo,
			},

			"deleteCompletedTodos": &graphql.Field{
				Type:        graphql.NewNonNull(graphql.Int),
				Description: "Delete all completed todos.",
				Resolve:     resolvers.DeleteCompletedTodos,
			},

			"signIn": &graphql.Field{
				Type:        AuthResponseType,
				Description: "Sign in with username and password.",
				Args: graphql.FieldConfigArgument{
					"email": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"password": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: resolvers.SignIn,
			},

			"signUp": &graphql.Field{
				Type:        AuthResponseType,
				Description: "Sign up with email and password.",
				Args: graphql.FieldConfigArgument{
					"email": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"password": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"confirmPassword": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: resolvers.SignUp,
			},

			"refreshToken": &graphql.Field{
				Type:        AuthResponseType,
				Description: "Refrsh tokens for a user.",
				Resolve:     resolvers.RefreshToken,
			},
		},
	},
)
