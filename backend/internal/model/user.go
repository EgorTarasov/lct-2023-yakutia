package model

import "gorm.io/gorm"

var (
	RoleAdmin      = "admin"
	RoleStudent    = "student"
	UsersTableName = "users"
)

// TODO:transform user into gorm Model

type User struct {
	gorm.Model
	Email     string `gorm:"index"`
	Password  string
	FirstName string
	LastName  string
}

// type User struct {
// 	Id        int       `json:"id"`    // serial
// 	Username  string    `json:"-"`     // not null, unique
// 	Password  string    `json:"-"`     // not null
// 	Role      string    `json:"role"`  // admin, student
// 	Email     string    `json:"email"` // not null, unique
// 	FirstName string    `json:"firstName"`
// 	LastName  string    `json:"lastName"`
// 	CreatedAt time.Time `json:"createdAt"` // default = current timestamp
// 	UpdatedAt time.Time `json:"updatedAt"` // default = current timestamp
// 	GroupIds  []int     `json:"groupIds"`
// }

type UserLogin struct {
	Username string `json:"username" validate:"required" example:"testUser"`
	Password string `json:"password" validate:"required" example:"test123456"`
}

// accessible only for admins
type UserCreate struct {
	Username  string `json:"-"`
	Password  string `json:"-"`
	Role      string `json:"role"`
	Email     string `json:"email"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}
