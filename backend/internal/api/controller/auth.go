package controller

import (
	"backend/internal/config"
	databse "backend/internal/database"
	"backend/internal/model"
	"backend/internal/response"
	"backend/internal/service"
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type authController struct {
	validator *validator.Validate
}

func NewAuthController() authController {
	return authController{
		validator: validator.New(validator.WithRequiredStructEnabled()),
	}
}

// Register godoc
//
//	@Summary		Авторизация
//	@Description	Авторизоваться в системе с помощью заранее сгенерированных логина и пароля
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			loginData	body		model.UserLogin		true	"Данные для авторизации"
//	@Success		200			{object}	model.AuthResponse	"Access token, значение для header Authorization"
//	@Failure		401			{object}	string				"Не авторизован"
//	@Failure		422			{object}	string				"Неверный формат данных"
//	@Router			/auth/login [post]
func (ac *authController) Login(c *fiber.Ctx) error {
	var loginData model.UserLogin
	if err := json.Unmarshal(c.Body(), &loginData); err != nil {
		return err.Error()
	}

	if err := ac.validator.Struct(&loginData); err != nil {
		return response.ErrValidationError(ac.modelName, err)
	}

	var user model.User
	// user, err := ac.repo.FindOne(c.Context(), "username", loginData.Username)
	result := databse.DB.First(&user, "email = ?", loginData.Username)

	if err := result.Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "No note with that Id exists"})
		}
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	authResponse, err := service.AuthenticateUser(loginData.Username, user.Password, loginData.Password, config.Cfg.JwtSecret)
	if err != nil {
		return response.ErrUnauthorized(err.Error())
	}

	return c.Status(http.StatusOK).JSON(authResponse)
}
