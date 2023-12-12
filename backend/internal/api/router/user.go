package router

import "github.com/gofiber/fiber/v2"

func (r *Router) setupUserRoutes(user fiber.Router) error {
	userController := controller.NewUserController()

}
