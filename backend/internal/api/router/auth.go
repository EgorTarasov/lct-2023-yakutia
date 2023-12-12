package router

import (
	"backend/internal/api/controller"

	"github.com/gofiber/fiber/v2"
)

func (r *Router) setupAuthRoutes(auth fiber.Router) error {

	authController := controller.NewAuthController()

	auth.Post("/login", authController.Login)

	return nil
}
