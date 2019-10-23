package runtime

import (
	"fmt"

	"github.com/dgrijalva/jwt-go"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/config"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/structs"
)

func GetUserFromToken(token string) *structs.Claims {
	parsed, err := jwt.ParseWithClaims(config.GetToken(token), &structs.Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(config.GetJwtSecret()), nil
	})

	// TODO: See if there is a better way to handle unauthenticated than returning an expired MapClaims
	if err != nil {
		return &structs.Claims{
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: 0,
			},
		}
	}

	if claims, ok := parsed.Claims.(*structs.Claims); ok && parsed.Valid {
		return claims
	}

	return &structs.Claims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: 0,
		},
	}
}
