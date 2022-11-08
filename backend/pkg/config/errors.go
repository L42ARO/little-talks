package config

import "errors"

var (
	ErrExists   = errors.New("item Exists")
	ErrNotFound = errors.New("item not found")
	ErrEmpty    = errors.New("request item is empty")
)
