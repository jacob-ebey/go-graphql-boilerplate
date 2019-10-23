package structs

import "github.com/dgrijalva/jwt-go"

type Claims struct {
	jwt.StandardClaims
	ID    int    `json:"id"`
	Email string `json:"email"`
}

type AuthResponse struct {
	Token string
	User  *User
}
