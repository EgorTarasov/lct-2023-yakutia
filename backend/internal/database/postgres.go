package databse

import (
	"backend/internal/config"
	"backend/internal/logging"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() error {
	var err error
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", config.Cfg.PostgresHost, config.Cfg.PostgresUser, config.Cfg.PostgresPassword, config.Cfg.PostgresDb, config.Cfg.PostgresPort)

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
	DB.Logger = logger.Default.LogMode(logger.Info)

	logging.Log.Info("Running Migrations")
	// DB.AutoMigrate(&models.Note{})

	logging.Log.Info("🚀 Connected Successfully to the Database")
	return nil
}
