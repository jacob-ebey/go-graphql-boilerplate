package handler

import (
	"net/http"

	"github.com/jacob-ebey/go-graphql-boilerplate/src/config"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/runtime"
)

var handler, _ = runtime.NewHandler(config.GetPgOptions(), false)

func Handler(w http.ResponseWriter, r *http.Request) {
	handler(w, r)
}
