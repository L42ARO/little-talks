package models

import (
	"context"
	"log"
)

type AppVersion struct {
	Version       string `json:"version"`
	Update_assets bool   `json:"update_assets"`
}

func GetAppVersion() *AppVersion {
	appV := new(AppVersion)
	query := `SELECT * FROM app_version`
	err0 := db.QueryRow(context.Background(), query).Scan(&appV.Version, &appV.Update_assets)
	if err0 != nil {
		log.Panic("Something went wrong getting latest app version: " + err0.Error())
	}
	return appV
}
