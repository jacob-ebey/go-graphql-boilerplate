package resolvers

import (
	"fmt"
	"time"

	"github.com/go-pg/pg"
	"github.com/graphql-go/graphql"

	"github.com/jacob-ebey/go-graphql-boilerplate/src/structs"
)

func GetTodos(params graphql.ResolveParams) (interface{}, error) {
	database := params.Context.Value("database").(*pg.DB)
	user := params.Context.Value("user").(*structs.Claims)

	if !user.VerifyExpiresAt(time.Now().Unix(), true) {
		return nil, fmt.Errorf("Not authenticated.")
	}

	skip, _ := params.Args["skip"].(int)
	limit, _ := params.Args["limit"].(int)
	filter, _ := params.Args["filter"].(string)

	var todos []structs.Todo
	query := database.
		Model(&todos).
		Where("user_id = ?", user.ID)

	switch filter {
	case "active":
		query = query.Where("completed IS NOT TRUE")
		break
	case "complete":
		query = query.Where("completed IS TRUE")
	}

	if err := query.
		OrderExpr("id DESC").
		Offset(skip).
		Limit(limit).
		Select(); err != nil {
		return nil, err
	}

	return todos, nil
}

func TodosLeft(params graphql.ResolveParams) (interface{}, error) {
	database := params.Context.Value("database").(*pg.DB)
	user := params.Context.Value("user").(*structs.Claims)

	if !user.VerifyExpiresAt(time.Now().Unix(), true) {
		return nil, fmt.Errorf("Not authenticated.")
	}

	count, err := database.
		Model(&structs.Todo{}).
		Where("user_id = ?", user.ID).
		Where("completed IS NOT TRUE").
		Count()

	if err != nil {
		return nil, err
	}

	return count, nil
}

func TodosTotal(params graphql.ResolveParams) (interface{}, error) {
	database := params.Context.Value("database").(*pg.DB)
	user := params.Context.Value("user").(*structs.Claims)

	if !user.VerifyExpiresAt(time.Now().Unix(), true) {
		return nil, fmt.Errorf("Not authenticated.")
	}

	count, err := database.
		Model(&structs.Todo{}).
		Where("user_id = ?", user.ID).
		Count()

	if err != nil {
		return nil, err
	}

	return count, nil
}

func CreateTodo(params graphql.ResolveParams) (interface{}, error) {
	database := params.Context.Value("database").(*pg.DB)
	user := params.Context.Value("user").(*structs.Claims)

	if !user.VerifyExpiresAt(time.Now().Unix(), true) {
		return nil, fmt.Errorf("Not authenticated.")
	}

	text, _ := params.Args["text"].(string)

	newTodo := structs.Todo{
		Text:      text,
		Completed: false,
		UserID:    user.ID,
	}

	if err := database.Insert(&newTodo); err != nil {
		return nil, err
	}

	return newTodo, nil
}

func MarkTodoCompleted(params graphql.ResolveParams) (interface{}, error) {
	database := params.Context.Value("database").(*pg.DB)
	user := params.Context.Value("user").(*structs.Claims)

	if !user.VerifyExpiresAt(time.Now().Unix(), true) {
		return nil, fmt.Errorf("Not authenticated.")
	}

	id, _ := params.Args["id"].(int)
	completed, _ := params.Args["completed"].(bool)

	toUpdate := structs.Todo{
		ID: id,
	}

	if err := database.Select(&toUpdate); err != nil {
		return nil, err
	}

	if toUpdate.UserID != user.ID {
		return nil, fmt.Errorf("Not authrorized.")
	}

	toUpdate.Completed = completed

	if err := database.Update(&toUpdate); err != nil {
		return nil, err
	}

	return toUpdate, nil
}

func EditTodo(params graphql.ResolveParams) (interface{}, error) {
	database := params.Context.Value("database").(*pg.DB)
	user := params.Context.Value("user").(*structs.Claims)

	if !user.VerifyExpiresAt(time.Now().Unix(), true) {
		return nil, fmt.Errorf("Not authenticated.")
	}

	id, _ := params.Args["id"].(int)
	text, _ := params.Args["text"].(string)

	toUpdate := structs.Todo{
		ID: id,
	}

	if err := database.Select(&toUpdate); err != nil {
		return nil, err
	}

	if toUpdate.UserID != user.ID {
		return nil, fmt.Errorf("Not authrorized.")
	}

	toUpdate.Text = text

	if err := database.Update(&toUpdate); err != nil {
		return nil, err
	}

	return toUpdate, nil
}

func DeleteTodo(params graphql.ResolveParams) (interface{}, error) {
	database := params.Context.Value("database").(*pg.DB)
	user := params.Context.Value("user").(*structs.Claims)

	if !user.VerifyExpiresAt(time.Now().Unix(), true) {
		return nil, fmt.Errorf("Not authenticated.")
	}

	id, _ := params.Args["id"].(int)

	toDelete := structs.Todo{ID: id}
	if err := database.Select(&toDelete); err != nil {
		return nil, err
	}

	if toDelete.UserID != user.ID {
		return nil, fmt.Errorf("Not authrorized.")
	}

	if err := database.Delete(&toDelete); err != nil {
		return nil, err
	}

	return toDelete, nil
}

func DeleteCompletedTodos(params graphql.ResolveParams) (interface{}, error) {
	database := params.Context.Value("database").(*pg.DB)
	user := params.Context.Value("user").(*structs.Claims)

	if !user.VerifyExpiresAt(time.Now().Unix(), true) {
		return nil, fmt.Errorf("Not authenticated.")
	}

	res, err := database.Exec(`
		DELETE FROM todos
		WHERE user_id = ? AND completed IS TRUE
	`, user.ID)

	if err != nil {
		return nil, err
	}

	return res.RowsAffected(), nil
}
