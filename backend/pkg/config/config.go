package config

import (
	"context"
	"log"

	"little-talks/pkg/utils"

	"github.com/jackc/pgx/v4/pgxpool"
)

var (
	db *pgxpool.Pool
)

func Connect() {
	connString := utils.GetEnvVar("DATABASE_URL")
	conn, err := pgxpool.Connect(context.Background(), connString)
	if err != nil {
		log.Fatal(err)
	}
	// defer conn.Close(context.Background())
	db = conn
}

func GetDB() *pgxpool.Pool {
	return db
}
