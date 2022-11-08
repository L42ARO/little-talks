package controllers

import (
	"fmt"
	"little-talks/pkg/config"
	"little-talks/pkg/models"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pusher/pusher-http-go"
)

type Challenge struct {
	Answer string `json:"answer"`
}
type Hint struct {
	Correct []string  `json:"correct"`
	Ses_Id  uuid.UUID `json:"ses_id"`
}
type HighFive struct {
	Username string `json:"username"`
	Points   int    `json:"points"`
}

type NewWordRequest struct {
	Username string    `json:"username"`
	Password string    `json:"password"`
	Request  Challenge `json:"request"`
}
type LastMessage struct {
	PrevUserCount int
	Username      string
	Time          int64
	CurrGoID      uuid.UUID
}
type BotMind struct {
	Name string
	// Guess Hint
}

var challenges []*Challenge
var leaderBoard []*HighFive
var pusherClient pusher.Client
var currChallenge *models.Challenge
var lastMsg *LastMessage
var usedChallenges []int
var processingCorrect bool

func init() {
	rand.Seed(time.Now().UnixNano())
	lastMsg = new(LastMessage)
	fillAvailBotRes()
	createThreesome()
	pusherClient = pusher.Client{
		AppID:   "1423009",
		Key:     "2d74d42707108f59bde7",
		Secret:  "5b02c742baae02b7555b",
		Cluster: "us2",
		Secure:  true,
	}
	// 	AppID:   "1438204",
	// 	Key:     "223be03af29491e92fcf",
	// 	Secret:  "97c63c4a9e4ac10a3fb6",
	// 	Cluster: "mt1",
	// 	Secure:  true,
	// }
	//PUSHER Connection must be made first in case people case we need to send boot up message
	SetChallenges()
	updateCurrChallenge(1)
}

func HandleJoin(c *fiber.Ctx) error {
	if processingCorrect {
		startWait := time.Now().Unix()
		for processingCorrect {
			if currTime := time.Now().Unix(); (currTime - startWait) > 120 {
				break
			}
		}
	}
	// currentChallenge, _ := models.GetCurrWord()
	letterNum := len(currChallenge.Answer)
	// letterNum := len(currentChallenge.Answer)
	var hintArr []string
	for i := 0; i < letterNum; i++ {
		hintArr = append(hintArr, "")
	}
	res := Hint{
		Correct: hintArr,
		Ses_Id:  currChallenge.Ses_id,
	}
	return c.JSON(res)
}

func HandleRand(c *fiber.Ctx) error {
	randChallenge, _ := models.GetRandWord()
	return c.JSON(*randChallenge)
}

func HandleMessage(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err
	}
	msg := data["message"]
	go func() {
		pusherClient.Trigger("chat", "message", data)
		fmt.Println(data)
	}()
	if strings.ToLower(msg) == currChallenge.Answer && !processingCorrect {
		processingCorrect = true
		fmt.Println("Someone got it!")
		go func() {
			models.Insert2Scoreboard(data["username"])
			scoreboard := models.GetScoreboard()
			for _, v := range scoreboard {
				fmt.Print(v)
				fmt.Print(",")
			}
		}()

		go updateCurrChallenge(2)
		go func() {
			data2 := map[string]string{
				"username":  "serverAdmin",
				"message":   "correct!",
				"unique_id": string(data["unique_id"]),
			}
			pusherClient.Trigger("chat", "message", data2)
		}()
		msg = ""
	} else {
		go func() {
			lastMsg.Time = time.Now().Unix() //Global variable that all go routines will have access
			var goRoutID = uuid.New()        //Local variable to evalute if needed to kill go routine
			lastMsg.CurrGoID = goRoutID
			var limpDif = []int{30, 20, 20, 15, 15, 15, 10, 10, 10, 10}
			var limpDifIdx = 0
			var loneDif = []int{30, 20, 15, 10, 5, 1} //The 30 will never execute
			if data["username"] == lastMsg.Username {
				if lastMsg.PrevUserCount < len(loneDif)-1 {
					lastMsg.PrevUserCount++
				}
			} else {
				lastMsg.Username = data["username"]
				lastMsg.PrevUserCount = 0
			}
			var initStartTime = lastMsg.Time                    //Time for first interval evaluation
			for ((time.Now().Unix() - lastMsg.Time) / 60) < 5 { //Bot go-routine will run for max 5 minutes if user is IDLE
				if lastMsg.CurrGoID != goRoutID { //If go-routine time is different from time of last message means a new message arrived
					return //So the go-routine must die
				}
				var currTimeDif = time.Now().Unix() - initStartTime
				if lastMsg.PrevUserCount > 0 {
					if loneEvalTime := int64(loneDif[lastMsg.PrevUserCount]); currTimeDif > loneEvalTime {
						log.Printf("\nResponding Lonely Dude (texted %d times)------------", lastMsg.PrevUserCount)
						go botResponse()
						initStartTime = time.Now().Unix()
						limpDifIdx = 0
						lastMsg.PrevUserCount = -1
						continue
					}
				}
				var limpEvalTime = int64(limpDif[limpDifIdx])
				if currTimeDif > limpEvalTime {
					log.Printf("\nResponding Idle Time-----------")
					go botResponse()
					initStartTime = time.Now().Unix()
					if limpDifIdx < len(limpDif)-1 {
						limpDifIdx++
					}
					continue
				}

			}
			createThreesome()
		}()
	}
	correctChars := TeaseHint(msg)
	res := Hint{
		Correct: correctChars,
		Ses_Id:  currChallenge.Ses_id,
	}
	return c.JSON(res)
}

func TeaseHint(msg string) []string {
	var correctChars []string
	ans2comp := []rune(strings.ToLower(currChallenge.Answer))
	val2comp := []rune(strings.ToLower(msg))
	var length int
	if len(ans2comp) < len(val2comp) {
		length = len(ans2comp)
	} else {
		length = len(val2comp)
	}
	correctChars = make([]string, len(currChallenge.Answer))
	for i := 0; i < length; i++ {
		if ans2comp[i] == val2comp[i] {
			correctChars[i] = string(ans2comp[i])
		}
	}
	return correctChars
}

var availBotRes []int

func fillAvailBotRes() {
	availBotRes = make([]int, len(botResponses))
	for i := range botResponses {
		availBotRes[i] = i
	}
}

var botThreesome []BotMind

func createThreesome() {
	botThreesome = make([]BotMind, 3)
	availNames := make([]int, len(botNames))
	for i := range availNames {
		availNames[i] = i
	}
	for i := range botThreesome { //Avail names is only local to this function
		randIdx := rand.Intn(len(availNames) - 1)
		botThreesome[i].Name = botNames[availNames[randIdx]]
		availNames[randIdx] = availNames[len(availNames)-1]
		availNames = availNames[:len(availNames)-1] //Since the loop only goes 3 times is imposible for availNames to become empty
	}
	fmt.Println("---------------------- CREATED NEW BOT THREESOME ----------------------")
	fmt.Println(botThreesome)
	fmt.Println("-----------------------------------------------------------------------")
}

type WordEval struct {
	WordIdx int
	Points  int
	Used    int
}

func botResponse() {
	botIdx := rand.Intn(len(botThreesome) - 1)
	fmt.Println(botIdx)
	currBot := botThreesome[botIdx]
	if len(availBotRes) == 1 {
		fillAvailBotRes()
	}
	// emptyCorrect := make([]string, len(currChallenge.Answer))
	// if len(currBot.Guess.Correct) == 0 || currBot.Guess.Ses_Id != currChallenge.Ses_id {
	// 	currBot.Guess.Correct = emptyCorrect
	// 	currBot.Guess.Ses_Id = currChallenge.Ses_id
	// }
	var botWord string
	//NOTE: Loop is done in case rand word is the answer
	for i := 0; i < 5; i++ { //NOTE: is 5 times just in case there's a word repeated 5 times in the array (although theere shouldn't be)
		availIdx := rand.Intn(len(availBotRes) - 1)
		botWord = botResponses[availBotRes[availIdx]]
		availBotRes[availIdx] = availBotRes[len(availBotRes)-1]
		availBotRes = availBotRes[:len(availBotRes)-1]
		if botWord != currChallenge.Answer { //NOTE: It will repeat the loop at max 5 times until it gets a word that's not the answer
			break
		}
	}
	res := map[string]string{
		"username":  currBot.Name,
		"message":   botWord,
		"unique_id": "000000000000",
	}
	pusherClient.Trigger("chat", "message", res) //TODO Uncomment this before pushing to prod
	// fmt.Println(res) //TODO Comment this before pushing to prod
}

func HandleScoreboard(c *fiber.Ctx) error {
	res := models.GetScoreboard()
	return c.JSON(res)
}

func HandleNewWord(c *fiber.Ctx) error {
	newChallenge := new(NewWordRequest)
	if err := c.BodyParser(newChallenge); err != nil {
		return err
	}
	if newChallenge.Username != "Halliday" && newChallenge.Password != "MonstersAndMen2011" {
		return fiber.NewError(fiber.StatusBadRequest, "Excuse me who are you and why are you trying to access my DB?")
	}
	err1 := models.AddWord(newChallenge.Request.Answer)
	if err1 == config.ErrExists {
		return fiber.NewError(fiber.StatusBadRequest, "Request already exists in DB")
	}
	return c.JSON(fiber.Map{
		"Request": "Valid and included in DB",
	})
}

func HandleGetAppVersion(c *fiber.Ctx) error {
	versionNum := models.GetAppVersion()
	return c.JSON(versionNum)
}
