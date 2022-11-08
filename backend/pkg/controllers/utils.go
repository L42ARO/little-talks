package controllers

import (
	"fmt"
	"little-talks/pkg/models"
)

func SetChallenges() {
	Answers := [...]string{"band", "beige", "herbs", "month", "wavy", "bird", "mom", "chaos", "year", "blue", "sad", "bean", "limit", "spark"}
	for _, v := range Answers {
		challenges = append(challenges, &Challenge{Answer: v})
	}
}

func updateCurrChallenge(time int) {
	defer func() {
		processingCorrect = false
		fmt.Println("Procesing Correct Ended")
	}()
	// isUsed := true
	// for isUsed {
	// 	isUsed = false
	// 	currChallenge = rand.Intn(len(challenges))
	// 	for _, v := range usedChallenges {
	// 		if currChallenge == v {
	// 			isUsed = true
	// 		}
	// 	}
	// 	if len(usedChallenges) == len(challenges) {
	// 		usedChallenges = nil
	// 	}
	// }
	// fmt.Printf("New Word: %s\n", *challenges[currChallenge])
	// usedChallenges = append(usedChallenges, currChallenge)
	if currChallenge != nil {
		models.SetUsed(currChallenge.Answer)
	}
	var status string
	currChallenge, status = models.GetRandWord()
	//IF the server selects a new word and it's in the middle of a round, then it means it crashed when assigning the previous word
	//ELSE the server wouldn't have slected a new word and the game would've continued as normal
	if status == "New" && time == 1 {
		bootingUpMsg := map[string]string{
			"username":  "serverAdmin",
			"message":   "bootingUp!",
			"unique_id": "12345678910",
		}
		pusherClient.Trigger("chat", "message", bootingUpMsg)
	}
	fmt.Printf("\n"+status+" Word: %s\n", *currChallenge)

}

func AddToLeaderboard(username string) {
	userExists := false
	for _, v := range leaderBoard {
		if username == v.Username {
			v.Points++
			userExists = true
			break
		}
	}
	if !userExists {
		leaderBoard = append(leaderBoard, &HighFive{Username: username, Points: 1})
	}
}
