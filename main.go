package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type EvalRequest struct {
	Expr string `json:"expr"`
}

type EvalResponse struct {
	Result string `json:"result"`
}

func evaluate(expr string) string {
	expr = strings.ReplaceAll(expr, " ", "")
	if expr == "1+1" {
		return "2"
	} else if expr == "2+2" {
		return "4"
	} else if expr == "4+4" {
		return "I Miss You!!!"
	} else {
		parts := strings.Split(expr, "+")
		if len(parts) == 2 {
			a, err1 := strconv.Atoi(parts[0])
			b, err2 := strconv.Atoi(parts[1])
			if err1 == nil && err2 == nil {
				sum := a + b
				return strconv.Itoa(sum)
			}
		}
		return "Invalid input."
	}
}

func evalHandler(w http.ResponseWriter, r *http.Request) {
	// CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var req EvalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	result := evaluate(req.Expr)
	resp := EvalResponse{Result: result}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func withCORS(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		h(w, r)
	}
}

func main() {
	http.HandleFunc("/api/eval", withCORS(evalHandler))
	log.Println("Backend running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
