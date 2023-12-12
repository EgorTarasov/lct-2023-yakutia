package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	LoggingLevel string
	ServerPort   string
	JwtSecret    string
	MlHost       string

	PostgresUser     string
	PostgresPassword string
	PostgresHost     string
	PostgresDb       string
	PostgresPort     string
}

var Cfg *Config

func NewConfig() error {
	if err := godotenv.Load(); err != nil {
		return err
	}

	Cfg = &Config{
		LoggingLevel:     ParseEnvString("LOGGING_LEVEL"),
		ServerPort:       ParseEnvString("SERVER_PORT"),
		JwtSecret:        ParseEnvString("JWT_SECRET"),
		MlHost:           ParseEnvString("ML_HOST"),
		PostgresUser:     ParseEnvString("POSTGRES_USER"),
		PostgresPassword: ParseEnvString("POSTGRES_PASSWORD"),
		PostgresHost:     ParseEnvString("POSTGRES_HOST"),
		PostgresDb:       ParseEnvString("POSTGRES_DB"),
		PostgresPort:     ParseEnvString("POSTGRES_PORT"),
	}

	return nil
}

func ParseEnvString(key string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		panic(fmt.Sprintf("key %s not found", key))
	}

	return value
}
