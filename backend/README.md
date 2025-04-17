# 🧠 LeetCoach – Offline Coding Platform

A mini backend system for practicing coding problems like LeetCode.  
Supports test cases, user code submissions, result evaluation, and progress tracking.

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

### 3. ▶️ Run the main app
```bash
python -m main_app
```
By default, the app runs at:
```bash
http://127.0.0.1:5000/
```