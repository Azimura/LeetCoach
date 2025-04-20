# 🧠 LeetCoach – Offline Coding Platform

A mini backend system for practicing coding problems like LeetCode.  
This project contains 3 separate Flask apps:

- `main_app` – Core APIs for problems, users, and submissions
- `admin_app` – Flask-Admin dashboard for managing all models
- `chat_app` – AI-powered code refinement using Ollama

---

## 🔧 Setup Instructions

### 1. 📦 Create a virtual environment
In the `backend` directory, create an environment:
```bash
python -m venv <directory name>
```
For example:
```bash
python -m venv .venv
```
Then activate it:
- **Windows**
```bash
.venv\Scripts\activate
```
- **macOS/Linux**
```bash
source .venv/bin/activate
```

### 2. 🔧 Install dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. ▶️ Run the apps
#### Main App
```bash
python -m main_app
```
By default, the app runs at:
```bash
http://127.0.0.1:5000/
```

#### Admin App
```bash
python -m admin_app
```
By default, the app runs at:
```bash
http://127.0.0.1:5001/
```

#### Chat App
**Step 1**: [Ollama installed](https://ollama.com/download)

**Step 2**: Run required models in Ollama
```bash
ollama create refined -f "backend/chat_app/refine_modelfile"
```
**Step 3**: Run the chat app

```bash
python -m chat_app
```
By default, the app runs at:
```bash
http://127.0.0.1:4999/
```