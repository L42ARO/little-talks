package main

import (
	"fmt"
	"little-talks/pkg/controllers"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	// pusherClient := pusher.Client{
	// 	AppID:   "1435013",
	// 	Key:     "6cdcae7bf5a3729a1716",
	// 	Secret:  "f03396bc1598f00e9706",
	// 	Cluster: "sa1",
	// 	Secure:  true,
	// }
	app := fiber.New()
	app.Use(recover.New())
	// app.Use(cors.New(cors.Config{
	// 	AllowOrigins: "*",
	// }))
	app.Use(cors.New(cors.Config{
		AllowOrigins: "https://liltalks.netlify.app", //TODO: Uncomment this before deploying to prod
		// AllowOrigins: "*", //TODO: Comment this out when deploying to prod
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	app.Get("/subscribe", controllers.HandleJoin)
	app.Post("/api/messages", controllers.HandleMessage)
	app.Get("/scoreboard", controllers.HandleScoreboard)
	//app.Get("/rand-challenge", controllers.HandleRand)
	app.Post("/admin/new-word-entry", controllers.HandleNewWord)
	app.Get("/app-version", controllers.HandleGetAppVersion)

	app.Listen(GetPort())
}
func GetPort() string {
	var port = os.Getenv("PORT")
	if port == "" {
		port = "8000"
		fmt.Println("Defaulting to port " + port)
	}
	return ":" + port
}
