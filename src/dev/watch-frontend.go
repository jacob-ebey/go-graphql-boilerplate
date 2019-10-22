package dev

import (
	"log"
	"os"
	"os/exec"
	"path"
)

func WatchFrontend() {
	command := exec.Command("node", path.Clean("./scripts/watch.js"))
	command.Dir = path.Clean("./frontend")
	command.Stdout = os.Stdout
	command.Stderr = os.Stderr

	if err := command.Run(); err != nil {
		log.Fatal(err)
	}
}
