package config

import "strings"

const JwtHeader = "Authorization"
const JwtType = "Bearer"

func GetJwtIssuer() string {
	return "go-graphql-boilerplate"
}

func GetToken(str string) string {
	split := strings.SplitN(str, " ", 2)

	if len(split) == 2 && split[0] == JwtType {
		return split[1]
	}

	return ""
}
