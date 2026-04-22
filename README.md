# LeetCoach 

**An open-source, LLM-powered coding assistant that promotes incidental learning through cognitive forcing strategies.**
 
> Published at the **Fortieth AAAI Conference on Artificial Intelligence (AAAI-26)**  
> *"How Does LLM-powered Coding Assistance Shape Incidental Learning? Exploring Cognitive Forcing Strategies in Programming Education"*  
> Ba-Thinh Tran-Le, Patrick Thomas, Nicholas M Stiffler, Thuy Ngoc Nguyen - University of Dayton
 
---

## Overview

LeetCoach is a LeetCode-style coding platform that applies **cognitive forcing**. Instead of providing complete solutions, it prompts you to think, reflect, and work through problems step by step. The goal is to support **incidental learning**: the acquisition of programming knowledge and problem-solving skills as a *byproduct* of engaging with the task, not from being handed the answer.
 
Built on an open-source LLM via Ollama, LeetCoach is lightweight, transparent, and fully configurable for educational settings.
 
---
 
## Key Features
 
- **Chat Assistant** - Socratic, explanation-only AI guidance available during intervention tasks
- **Code Refinement** - Translates pseudocode or non-Python drafts into executable Python, so you can focus on logic rather than syntax
- **Solution Evaluation** - Run your code against visible test cases for feedback, or submit for full evaluation against hidden cases
- **Timer** - Option to skip a problem after 10 minutes
- **Model Agnostic** - Designed to work with any open-source LLM via Ollama
---
 
## Architecture
 
LeetCoach has three layers:
 
| Layer | Technology | Role |
|-------|-----------|------|
| Frontend | React | Problem display, code editor, chat UI |
| Backend | Flask | Problem management, dialogue coordination, model inference |
| LLM | via Ollama | Guided assistance with in-context learning |
 
The LLM is given a fixed system prompt that enforces pedagogical rules (see `Prompt Design` below). Each request is augmented with the problem description and the user's recent chat history to maintain conversational continuity.
 
---
 
## Prompt Design
 
The chat assistant's behavior is defined entirely through a role-based system prompt embedded at inference time. The prompt enforces:
 
1. **Never provide full solutions** - not even if the user asks repeatedly
2. **Socratic questioning** - guide with questions, not answers
3. **Conceptual debugging** - discuss *why* code might fail, without fixing it
4. **Reasoning-first scaffolding** - require users to commit to an approach before receiving feedback
5. **Encouraging tone** - supportive and conversational throughout
This approach operationalizes *explanation-only* and *reasoning-first* interaction patterns shown in prior research to produce significant learning gains.
 
---

## Installation
 
```bash
# Clone the repo
git clone https://github.com/Azimura/LeetCoach.git
cd LeetCoach
```
 
Then follow the setup instructions for each component:
 
- **Frontend**: see [`frontend/README.md`](frontend/README.md)
- **Backend**: see [`backend/README.md`](backend/README.md)
 
---
 
## Customization
 
LeetCoach is **model agnostic**. You can use any Ollama-compatible model by updating the model reference in the backend configuration. The system prompt can also be modified to adjust the assistant's pedagogical strategy, difficulty level, or domain scope.
 
---
 
## Citation
 
If you use LeetCoach in your research, please cite:
 
```bibtex
@inproceedings{tran2026does,
  title={How Does LLM-powered Coding Assistance Shape Incidental Learning? Exploring Cognitive Forcing Strategies in Programming Education},
  author={Tran-Le, Ba-Thinh and Thomas, Patrick and Stiffler, Nicholas M and Nguyen, Thuy Ngoc},
  booktitle={Proceedings of the AAAI Conference on Artificial Intelligence},
  volume={40},
  number={48},
  pages={40880--40888},
  year={2026}
}
```
 
---
 
## Acknowledgements
 
This work was supported by the **National Science Foundation (NSF) CRII Award No. 2451134** to Thuy Ngoc Nguyen.
 
Department of Computer Science, University of Dayton, OH 45469, USA.
 
---

## License
 
See [LICENSE](LICENSE) for details.
