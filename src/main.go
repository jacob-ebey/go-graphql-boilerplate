package main

import (
	"fmt"
	"net/http"
	"path"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"

	"github.com/jacob-ebey/go-graphql-boilerplate/src/config"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/dev"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/runtime"
)

func main() {
	godotenv.Load(".env")

	options := config.GetPgOptions()

	handler, close := runtime.NewHandler(options, config.IsDevelopment())
	defer close()

	router := mux.NewRouter()
	router.HandleFunc("/graphql", handler)

	if config.ShouldServeStaticFiles() {
		fileServer := http.FileServer(http.Dir(path.Clean("./frontend/build")))
		router.PathPrefix("/static").Handler(fileServer)
		router.Handle("/favicon.ico", fileServer)

		router.PathPrefix("/").HandlerFunc(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, path.Clean("./frontend/build/index.html"))
		}))
	}

	if config.IsDevelopment() && config.ShouldServeStaticFiles() {
		go dev.WatchFrontend()
	}

	server := &http.Server{
		Handler:      router,
		Addr:         config.GetAddress(),
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	if err := server.ListenAndServe(); err != nil {
		fmt.Println(err)
	}
}
