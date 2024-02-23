package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	_ "github.com/lib/pq"

	"github.com/gorilla/mux"
)

type AutoPart struct {
	ID            int     `json:"id"`
	Name          string  `json:"name"`
	Category      string  `json:"category"`
	Make          string  `json:"make"`
	Models        string  `json:"models"`
	Description   string  `json:"description"`
	PurchasePrice float64 `json:"purchase_price"`
	SalePrice     float64 `json:"sale_price"`
	Photo         string  `json:"photo"`
	Stock         int     `json:"stock"`
}

var (
	db        *sql.DB
	autoParts []AutoPart
)

func init() {
	// Initialize the database connection in an init function
	var err error
	db, err = sql.Open("postgres", "postgres://tavito:mamacita@localhost:5432/autoparts?sslmode=disable")
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}

	// Check the database connection
	if err = db.Ping(); err != nil {
		log.Fatal("Failed to ping the database:", err)
	}
}

func main() {
	defer db.Close()

	router := mux.NewRouter()

	// Serve static files from the "static" directory
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	router.HandleFunc("/autoparts", GetAutoParts).Methods("GET")
	router.HandleFunc("/autoparts/{id}", GetAutoPart).Methods("GET")
	router.HandleFunc("/filter", FilterAutoParts).Methods("GET")
	router.HandleFunc("/autoparts", CreateAutoPart).Methods("POST")
	router.HandleFunc("/autoparts/{id}", UpdateAutoPart).Methods("PUT")
	router.HandleFunc("/autoparts/{id}", DeleteAutoPart).Methods("DELETE")
	http.ListenAndServe(":8080", router)
}

func GetAutoParts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Execute a SELECT query to retrieve all auto parts from the database
	rows, err := db.Query("SELECT * FROM autoparts")
	if err != nil {
		http.Error(w, "Failed to retrieve data from the database", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Create a slice to store the retrieved auto parts
	var retrievedAutoParts []AutoPart

	// Iterate through the result rows and scan them into AutoPart structs
	for rows.Next() {
		var autoPart AutoPart
		if err := rows.Scan(
			&autoPart.ID,
			&autoPart.Name,
			&autoPart.Category,
			&autoPart.Make,
			&autoPart.Models,
			&autoPart.Description,
			&autoPart.PurchasePrice,
			&autoPart.SalePrice,
			&autoPart.Photo,
			&autoPart.Stock,
		); err != nil {
			http.Error(w, "Failed to scan data from the database", http.StatusInternalServerError)
			return
		}
		retrievedAutoParts = append(retrievedAutoParts, autoPart)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		http.Error(w, "Error while iterating over database rows", http.StatusInternalServerError)
		return
	}

	// Encode and send the retrieved auto parts as JSON response
	json.NewEncoder(w).Encode(retrievedAutoParts)
}

func GetAutoPart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	autoPartID, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	// Execute a SELECT query to retrieve a specific auto part from the database
	row := db.QueryRow("SELECT * FROM autoparts WHERE id = $1", autoPartID)

	// Scan the result row's data into an AutoPart struct
	var autoPart AutoPart
	if err := row.Scan(
		&autoPart.ID,
		&autoPart.Name,
		&autoPart.Category,
		&autoPart.Make,
		&autoPart.Models,
		&autoPart.Description,
		&autoPart.PurchasePrice,
		&autoPart.SalePrice,
		&autoPart.Photo,
		&autoPart.Stock,
	); err != nil {
		if err == sql.ErrNoRows {
			http.NotFound(w, r)
		} else {
			http.Error(w, "Failed to retrieve data from the database", http.StatusInternalServerError)
		}
		return
	}

	// Encode and send the retrieved auto part as JSON response
	json.NewEncoder(w).Encode(autoPart)
}

func FilterAutoParts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Parse query parameters
	queryParams := r.URL.Query()

	// Build the WHERE clause based on the query parameters
	var whereClause string
	var args []interface{}
	var index int = 1
	for key, values := range queryParams {
		if len(values) == 0 {
			continue
		}

		// Handle different query parameters accordingly
		switch key {
		case "category":
			whereClause += " AND category = $" + strconv.Itoa(index)
		case "make":
			whereClause += " AND make = $" + strconv.Itoa(index)

		case "models":
			whereClause += " AND models = $" + strconv.Itoa(index)
			// Add cases for other query parameters if needed
		}

		// Append query parameter value to args
		args = append(args, values[0])
		index++
	}

	// Construct the SQL query
	query := "SELECT * FROM autoparts WHERE true" + whereClause

	// Execute the SQL query
	rows, err := db.Query(query, args...)
	if err != nil {
		http.Error(w, "Failed to retrieve data from the database", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Create a slice to store the retrieved auto parts
	var retrievedAutoParts []AutoPart

	// Iterate through the result rows and scan them into AutoPart structs
	for rows.Next() {
		var autoPart AutoPart
		if err := rows.Scan(
			&autoPart.ID,
			&autoPart.Name,
			&autoPart.Category,
			&autoPart.Make,
			&autoPart.Models,
			&autoPart.Description,
			&autoPart.PurchasePrice,
			&autoPart.SalePrice,
			&autoPart.Photo,
			&autoPart.Stock,
		); err != nil {
			http.Error(w, "Failed to scan data from the database", http.StatusInternalServerError)
			return
		}
		retrievedAutoParts = append(retrievedAutoParts, autoPart)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		http.Error(w, "Error while iterating over database rows", http.StatusInternalServerError)
		return
	}

	// Encode and send the retrieved auto parts as JSON response
	json.NewEncoder(w).Encode(retrievedAutoParts)
}

func CreateAutoPart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var newAutoPart AutoPart
	_ = json.NewDecoder(r.Body).Decode(&newAutoPart)

	// Insert the newAutoPart data into the database
	_, err := db.Exec(
		"INSERT INTO autoparts (name, category, make, models, description, purchase_price, sale_price, photo, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
		newAutoPart.Name, newAutoPart.Category, newAutoPart.Make, newAutoPart.Models, newAutoPart.Description,
		newAutoPart.PurchasePrice, newAutoPart.SalePrice, newAutoPart.Photo, newAutoPart.Stock,
	)
	if err != nil {
		http.Error(w, "Failed to insert data into the database", http.StatusInternalServerError)
		return
	}

	// Append the newAutoPart to the local slice (optional, for in-memory storage)
	autoParts = append(autoParts, newAutoPart)

	json.NewEncoder(w).Encode(newAutoPart)
}

// UpdateAutoPart updates an auto part by ID
func UpdateAutoPart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	autoPartID, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var updatedAutoPart AutoPart
	if err := json.NewDecoder(r.Body).Decode(&updatedAutoPart); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Execute an UPDATE query to update a specific auto part in the database
	_, err = db.Exec(
		"UPDATE autoparts SET name = $2, category = $3, make = $4, models = $5, description = $6, purchase_price = $7, sale_price = $8, photo = $9, stock = $10 WHERE id = $1",
		autoPartID,
		updatedAutoPart.Name,
		updatedAutoPart.Category,
		updatedAutoPart.Make,
		updatedAutoPart.Models,
		updatedAutoPart.Description,
		updatedAutoPart.PurchasePrice,
		updatedAutoPart.SalePrice,
		updatedAutoPart.Photo,
		updatedAutoPart.Stock,
	)
	if err != nil {
		http.Error(w, "Failed to update data in the database", http.StatusInternalServerError)
		return
	}

	// Set the ID of the updatedAutoPart to the provided autoPartID
	updatedAutoPart.ID = autoPartID

	// Encode and send the updated auto part as JSON response
	json.NewEncoder(w).Encode(updatedAutoPart)
}

// DeleteAutoPart deletes an auto part by ID
func DeleteAutoPart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	autoPartID, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	// Execute a DELETE query to delete a specific auto part from the database
	result, err := db.Exec("DELETE FROM autoparts WHERE id = $1", autoPartID)
	if err != nil {
		http.Error(w, "Failed to delete data from the database", http.StatusInternalServerError)
		return
	}

	// Check the number of rows affected to determine if the auto part was found and deleted
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, "Failed to get the number of rows affected", http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		// If no rows were affected, the specified auto part ID was not found
		http.NotFound(w, r)
		return
	}

	// Respond with a success message
	successMessage := map[string]string{"message": "Auto part deleted successfully"}
	json.NewEncoder(w).Encode(successMessage)
}

/*
/////////////////////CURL COMMANDS TO THE TEST THE ENDPOINTS//////////////////////////////

curl -X POST -H "Content-Type: application/json" -d '{
  "name": "Brake Pads",
  "category": "Braking System",
  "make": "Toyota",
  "models": "hilux 2.7, fortuner 2.7",
  "description": "High-performance brake pads for enhanced stopping power.",
  "purchase_price": 25.0,
  "sale_price": 50.0,
  "photo": "https://example.com/brake_pads.jpg",
  "stock": 100
}' http://localhost:8080/autoparts


curl -X PUT -H "Content-Type: application/json" -d '{
    "name": "Updated Auto Part Name",
    "category": "Updated Category",
    "make": "Updated Make",
    "models": "Updated Models",
    "description": "Updated Description",
    "purchase_price": 99.99,
    "sale_price": 129.99,
    "photo": "updated_photo.jpg",
    "stock": 50
}' http://localhost:8080/autoparts/{1}

curl -X DELETE http://localhost:8080/autoparts/{2}

curl -X GET http://localhost:8080/autoparts -H "Origin: http://localhost:8080"

*/
