package config

import (
	"crypto/tls"
	"fmt"
	"os"
	"strings"

	"github.com/go-pg/pg"
)

func IsDevelopment() bool { return os.Getenv("ENVIRONMENT") == "development" }

func ShouldServeStaticFiles() bool { return os.Getenv("GO_SERVES_STATIC") == "true" }

func GetAddress() string {
	addr := ":" + os.Getenv("PORT")
	if IsDevelopment() && !IsDocker() {
		addr = "localhost" + addr
	}

	return addr
}

func GetJwtSecret() []byte {
	secret := os.Getenv("JWT_SECRET")

	if secret == "" {
		panic(fmt.Errorf("No JWT_SECRET environment variable provided."))
	}

	return []byte(secret)
}

func IsDocker() bool { return os.Getenv("IS_DOCKER") == "true" }

func IsHeroku() bool { return os.Getenv("IS_HEROKU") == "true" }

func GetPgOptions() *pg.Options {
	databaseURL := os.Getenv("DATABASE_URL")

	var options *pg.Options
	if strings.Contains(databaseURL, "@") {
		parsed, _ := pg.ParseURL(databaseURL)
		options = parsed
	} else {
		options = &pg.Options{
			Addr:     os.Getenv("POSTGRESS_ADDRESS"),
			Database: os.Getenv("POSTGRESS_DATABASE"),
			User:     os.Getenv("POSTGRESS_USER"),
			Password: os.Getenv("POSTGRESS_PASSWORD"),
		}
	}

	if IsHeroku() {
		if options.TLSConfig == nil {
			options.TLSConfig = &tls.Config{}
		}
		options.TLSConfig.InsecureSkipVerify = true
	}
	return options
}
