package controller

import (
	"github.com/go-playground/validator/v10"
)

type userController struct {
	validator *validator.Validate
}

func NewUserController() userController {
	return userController{
		validator: validator.New(validator.WithRequiredStructEnabled()),
	}
}
