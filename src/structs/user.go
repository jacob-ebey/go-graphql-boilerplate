package structs

type User struct {
	ID       int
	Email    string
	Password string
	Todos    []*Todo
}
