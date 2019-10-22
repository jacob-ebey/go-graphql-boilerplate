package db

import (
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"

	"github.com/jacob-ebey/go-graphql-boilerplate/src/structs"
)

func Connect(options *pg.Options, dev bool) (*pg.DB, error) {
	db := pg.Connect(options)

	types := []interface{}{
		(*structs.Todo)(nil),
	}

	for _, model := range types {
		err := db.CreateTable(model, &orm.CreateTableOptions{
			Temp:        dev,
			IfNotExists: true,
		})

		if err != nil {
			return nil, err
		}
	}

	return db, nil
}
