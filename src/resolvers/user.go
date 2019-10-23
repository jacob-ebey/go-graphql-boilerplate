package resolvers

import (
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-pg/pg"
	"github.com/graphql-go/graphql"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/config"
	"github.com/jacob-ebey/go-graphql-boilerplate/src/structs"
	"golang.org/x/crypto/bcrypt"
)

var LoginError = fmt.Errorf("Email or password is invalid.")
var UserExistsError = fmt.Errorf("User with the provided email already exists.")
var PasswordsDoNotMatchError = fmt.Errorf("The provided passwords do not match.")

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func createToken(user *structs.User) (string, error) {
	issuedAt := time.Now()
	expiresAt := issuedAt.Add(10 * time.Minute)

	t := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), structs.Claims{
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  issuedAt.Unix(),
			ExpiresAt: expiresAt.Unix(),
		},
		ID:    user.ID,
		Email: user.Email,
	})

	return t.SignedString(config.GetJwtSecret())
}

func SignIn(params graphql.ResolveParams) (interface{}, error) {
	database := params.Context.Value("database").(*pg.DB)

	email, _ := params.Args["email"].(string)
	password, _ := params.Args["password"].(string)

	user := structs.User{}
	if err := database.
		Model(&user).
		Where("email = ?", email).
		Select(); err != nil {
		return nil, LoginError
	}

	if !checkPasswordHash(password, user.Password) {
		return nil, LoginError
	}

	token, err := createToken(&user)

	if err != nil {
		return nil, err
	}

	return structs.AuthResponse{
		Token: token,
		User:  &user,
	}, nil
}

func SignUp(params graphql.ResolveParams) (interface{}, error) {
	database := params.Context.Value("database").(*pg.DB)

	email, _ := params.Args["email"].(string)
	password, _ := params.Args["password"].(string)
	confirmPassword, _ := params.Args["confirmPassword"].(string)

	if password != confirmPassword {
		return nil, PasswordsDoNotMatchError
	}

	user := structs.User{}
	if err := database.
		Model(&user).
		Where("email = ?", email).
		Select(); err == nil {
		return nil, UserExistsError
	}

	hashedPassword, err := hashPassword(password)

	if err != nil {
		return nil, err
	}

	user = structs.User{
		Email:    email,
		Password: hashedPassword,
	}

	if err := database.Insert(&user); err != nil {
		return nil, err
	}

	token, err := createToken(&user)

	if err != nil {
		return nil, err
	}

	return structs.AuthResponse{
		Token: token,
		User:  &user,
	}, nil
}
