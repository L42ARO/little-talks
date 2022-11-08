package models

import (
	"context"
	"little-talks/pkg/config"
	"log"
	"math/rand"
	"strconv"

	"fmt"

	"github.com/georgysavva/scany/pgxscan"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	_ "github.com/lib/pq"
)

var db *pgxpool.Pool

func init() {
	config.Connect()
	db = config.GetDB()
}

type HighFive struct {
	Username string `json:"username"`
	Points   int    `json:"points"`
}
type Challenge struct {
	Answer string    `json:"answer"`
	Ses_id uuid.UUID `json:"ses_id"`
}

func Insert2Scoreboard(username string) {
	query0 := `SELECT * FROM leaderboard WHERE username=$1`
	err0 := db.QueryRow(context.Background(), query0, username).Scan()
	if err0 == pgx.ErrNoRows {
		fmt.Println("user doesn't exist yet, adding to leaderboard... ")
		query1 := `INSERT INTO leaderboard (username, points) VALUES ($1,$2)`
		_, err := db.Exec(context.Background(), query1, username, 1)
		if err != nil {
			log.Fatal("Error inserting user: ", err)
		}
		return
	}
	query1 := `UPDATE leaderboard SET points = points + 1 WHERE username = $1`
	_, err := db.Exec(context.Background(), query1, username)
	if err != nil {
		log.Fatal("Error updating user: ", err)
	}
}

func GetScoreboard() []HighFive {
	var entries []HighFive
	query := `SELECT * FROM leaderboard`
	rows, err := db.Query(context.Background(), query)
	if err != nil {
		log.Panic("Error executing query: ", err)
	}
	defer rows.Close()
	if err := pgxscan.ScanAll(&entries, rows); err != nil {
		log.Panic("Error reading scanning query: ", err)
	}
	return entries
}

func AddWord(newWord string) error {
	query0 := `SELECT * FROM words WHERE answer=$1`
	err0 := db.QueryRow(context.Background(), query0, newWord).Scan()
	if err0 == pgx.ErrNoRows {
		query := `INSERT INTO words (answer) VALUES ($1)`
		_, err := db.Exec(context.Background(), query, newWord)
		if err != nil {
			log.Panic("Error inserting new word")
		}
		return nil
	}
	return config.ErrExists
}

func GetRandWord() (*Challenge, string) {
	posCurrEntry, err := GetCurrWord()
	if err != config.ErrEmpty {
		return posCurrEntry, "Current"
	}
	query0 := `SELECT answer FROM words WHERE used=false`
	err0 := db.QueryRow(context.Background(), query0).Scan()
	if err0 == pgx.ErrNoRows {
		ClearRound()
	}
	query := `SELECT answer, ses_id FROM words WHERE used=false ORDER BY times_called ASC,`
	posRows := []string{`rand1`, `rand2`, `rand3`}
	posOrd := []string{`ASC`, `DESC`}
	randRow := posRows[rand.Intn(len(posRows))]
	randOrd := posOrd[rand.Intn(len(posOrd))]
	query += ` ` + randRow + ` ` + randOrd + ` LIMIT 3`
	rows, err := db.Query(context.Background(), query)
	defer rows.Close()
	if err != nil {
		log.Fatal("Error executing query: ", err)
	}
	var posAns []Challenge
	if err := pgxscan.ScanAll(&posAns, rows); err != nil {
		log.Fatal("Error reading scanning query: ", err)
	}
	var words []interface{}
	for _, v := range posAns {
		words = append(words, v.Answer)
	}
	SetCallNums(words)
	randEntry := posAns[rand.Intn(len(posAns))]
	query2 := `UPDATE words SET curr_use=true WHERE answer = $1`
	_, err2 := db.Exec(context.Background(), query2, randEntry.Answer)
	if err2 != nil {
		log.Fatal("Error updating word usage status: ", err2)
	}
	return &randEntry, "New"
}
func GetCurrWord() (*Challenge, error) {
	var currEntry Challenge
	query := `SELECT answer,ses_id FROM words WHERE curr_use=true`
	err0 := db.QueryRow(context.Background(), query).Scan(&currEntry.Answer, &currEntry.Ses_id)
	if err0 == pgx.ErrNoRows {
		return nil, config.ErrEmpty
	}
	return &currEntry, nil
}

func SetCallNums(calledWords []any) {
	query := `UPDATE words SET times_called = times_called + 1 WHERE`
	for i := range calledWords {
		if i != 0 {
			query += ` OR`
		}
		query += ` answer=$` + strconv.Itoa(i+1)
	}
	_, err := db.Exec(context.Background(), query, calledWords...)
	if err != nil {
		log.Fatal("Error updating user: ", err)
	}

}
func SetUsed(word string) {
	query := `UPDATE words SET (used,curr_use) = (true,false) WHERE answer=$1`
	_, err := db.Exec(context.Background(), query, word)
	if err != nil {
		log.Fatal("Error updating last used word: ", err)
	}
}

func ClearRound() {
	query := `UPDATE words SET used = false WHERE used=true`
	_, err := db.Exec(context.Background(), query)
	if err != nil {
		log.Fatal("Error updating clearing round usage: ", err)
	}
}
