# FastAPI CRUD Guide

## Introduction

This guide demonstrates how to implement CRUD (Create, Read, Update, Delete) operations using Python and FastAPI. The approach is minimalist, focusing only on FastAPI's core functionality without additional dependencies.

## Requirements

- Python 3.8+
- FastAPI
- Uvicorn (server to run the FastAPI application)

```bash
pip install fastapi uvicorn
```

## Project Structure

```
fastapi_crud/
├── main.py
└── requirements.txt
```

## Setting Up a Simple In-Memory Database

Since we're keeping this guide minimal without external database libraries, we'll use a simple Python dictionary to store our data in memory.

## Implementing CRUD Operations with FastAPI

### main.py

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List
import uvicorn

# Initialize FastAPI app
app = FastAPI(title="Simple FastAPI CRUD API")

# Pydantic model for data validation
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    is_available: bool = True

# In-memory storage
items: Dict[int, Item] = {}
counter = 0

# CREATE - Add a new item
@app.post("/items/", response_model=Item)
def create_item(item: Item):
    global counter
    counter += 1
    items[counter] = item
    return item

# READ - Get all items
@app.get("/items/", response_model=List[Item])
def read_items():
    return list(items.values())

# READ - Get a specific item by ID
@app.get("/items/{item_id}", response_model=Item)
def read_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return items[item_id]

# UPDATE - Update an existing item
@app.put("/items/{item_id}", response_model=Item)
def update_item(item_id: int, item: Item):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    items[item_id] = item
    return item

# DELETE - Remove an item
@app.delete("/items/{item_id}", response_model=Item)
def delete_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    item = items[item_id]
    del items[item_id]
    return item

# Run the application
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

## Running the Application

To start the FastAPI application, run:

```bash
python main.py
```

Or directly with Uvicorn:

```bash
uvicorn main:app --reload
```

## Testing the API

### API Documentation

FastAPI automatically generates interactive API documentation. You can access it by visiting:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Example Requests

Here are some examples of how to interact with your API using curl:

#### Create an Item (POST)

```bash
curl -X 'POST' \
  'http://localhost:8000/items/' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "is_available": true
}'
```

#### Get All Items (GET)

```bash
curl -X 'GET' 'http://localhost:8000/items/'
```

#### Get a Specific Item (GET)

```bash
curl -X 'GET' 'http://localhost:8000/items/1'
```

#### Update an Item (PUT)

```bash
curl -X 'PUT' \
  'http://localhost:8000/items/1' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Laptop",
  "description": "High-performance laptop with upgraded specs",
  "price": 1199.99,
  "is_available": true
}'
```

#### Delete an Item (DELETE)

```bash
curl -X 'DELETE' 'http://localhost:8000/items/1'
```

## Advanced Considerations

### Persistence

This example uses an in-memory dictionary which doesn't persist data between application restarts. For a production application, you would want to:

1. Use a proper database (SQLite, PostgreSQL, MongoDB, etc.)
2. Implement proper error handling and validation
3. Add authentication and authorization

### Enhancing the API

You could enhance this basic CRUD API by:

1. Adding query parameters for filtering and pagination
2. Implementing proper response models
3. Adding background tasks
4. Implementing dependency injection for services

## Conclusion

This guide demonstrates a minimalist approach to creating a CRUD API using only FastAPI. The in-memory storage solution is perfect for learning and prototyping, while FastAPI's built-in features like automatic documentation and request validation make development efficient.

For production applications, you would want to extend this foundation with a proper database solution, but this guide gives you the core patterns needed to implement CRUD operations with FastAPI.
