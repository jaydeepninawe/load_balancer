# 🚀 Load Balancer

A lightweight, production-inspired **software Load Balancer** built using JavaScript (Node.js) and Docker.  
This project demonstrates core distributed systems concepts such as **traffic distribution, high availability, scalability, and fault tolerance**.

Designed to simulate real-world infrastructure components used in modern cloud environments.

---

## 📌 Why This Project Matters

Modern applications must handle thousands (or millions) of concurrent requests efficiently.  
A load balancer ensures:

- ✅ No single server becomes a bottleneck  
- ✅ High availability and redundancy  
- ✅ Horizontal scalability  
- ✅ Better performance under load  
- ✅ Fault tolerance when a service fails  

This project demonstrates how a load balancer distributes incoming traffic across multiple backend servers using a custom distribution algorithm.

---

## 🧠 How It Works

1. Clients send HTTP requests to the Load Balancer.
2. The Load Balancer selects a backend server using a distribution algorithm (e.g., Round-Robin).
3. The request is forwarded to the selected backend.
4. The backend processes the request and returns a response.
5. The Load Balancer sends the response back to the client.

---

## 🏗️ Architecture Diagram

```
                        ┌───────────────────┐
                        │      Clients      │
                        └──────────┬────────┘
                                   │
                                   ▼
                        ┌───────────────────┐
                        │   Load Balancer   │
                        │  (Round Robin)    │
                        └───────┬─────┬─────┘
                                │     │
              ┌─────────────────┘     └─────────────────┐
              ▼                                           ▼
      ┌──────────────────┐                       ┌──────────────────┐
      │   Backend 1      │                       │   Backend 2      │
      │  (App Server)    │                       │  (App Server)    │
      └──────────────────┘                       └──────────────────┘
```

---

## ⚙️ Features

- 🔁 Round-Robin traffic distribution
- 🐳 Fully Dockerized setup
- ⚡ Lightweight and fast
- 🧩 Modular and extensible architecture
- 🛠️ Configurable backend services via `docker-compose`
- 📦 Clean and simple project structure

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|------------|
| Language | JavaScript (Node.js) |
| Containerization | Docker |
| Orchestration | Docker Compose |
| Networking | HTTP |

---

## 📁 Project Structure

```
load_balancer/
│
├── balancer/          # Core load balancer logic
├── server/            # Backend server implementation
├── docker-compose.yml # Multi-container setup
└── README.md
```

- **balancer/** – Contains load balancing logic and routing.
- **server/** – Sample backend servers to demonstrate distribution.
- **docker-compose.yml** – Spins up load balancer + multiple backend containers.

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Docker installed
- Docker Compose installed

### 📦 Installation

```bash
git clone https://github.com/jaydeepninawe/load_balancer.git
cd load_balancer
```

### ▶️ Run the Project

```bash
docker compose up --build
```

This will start:
- The Load Balancer service
- Multiple backend server instances

---

## 🧪 Testing Load Distribution

Open your browser or use curl:

```bash
curl http://localhost:<load_balancer_port>
```

Refresh multiple times and observe responses coming from different backend servers.

You should see responses alternating between servers, demonstrating traffic distribution.

---

## 🔍 Example Distribution Logic (Round Robin)

```javascript
let currentIndex = 0;

function getNextServer(servers) {
    const server = servers[currentIndex];
    currentIndex = (currentIndex + 1) % servers.length;
    return server;
}
```

---

## 📈 Future Improvements

- 🔥 Least Connections algorithm
- 🩺 Active health checks for backend servers
- 🔐 HTTPS / SSL termination
- 📊 Metrics & monitoring (Prometheus/Grafana)
- ⚖️ Rate limiting
- 🌍 Kubernetes deployment support
- 🧠 Sticky sessions
- 🚦 Circuit breaker pattern

---

## 🎯 What This Demonstrates to Recruiters

- Strong understanding of distributed systems fundamentals
- Backend networking knowledge
- Infrastructure-level problem solving
- Docker & containerized architecture design
- Modular and scalable application design
- Production-oriented thinking

---

## 🤝 Contributing

Pull requests are welcome.  
Feel free to fork and experiment with new load balancing strategies.

---

## 📜 License

MIT License

---

## 👨‍💻 Author

**Jaydeep Ninawe**  
GitHub: https://github.com/jaydeepninawe  

---

⭐ If you found this project interesting, consider giving it a star!
