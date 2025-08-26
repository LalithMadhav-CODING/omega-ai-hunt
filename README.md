# omega-ai-hunt
OMEGA AI HUNT: An interactive AI assistant featuring a covert-ops theme and an intelligent puzzle mechanism. Users must uncover four encrypted data fragments through specific interactions to reveal the final secret key. Built with Next.js, TypeScript, and Google's Gemini API.
# OMEGA AI HUNT

### An Interactive AI Assistant with a Covert-Ops Themed Puzzle

OMEGA AI HUNT is an interactive AI assistant featuring a covert-ops theme and an intelligent puzzle mechanism. Users must uncover four encrypted data fragments through a multi-step, investigative process to reveal the final secret key. This project was built to fulfill the "Intelligent Query System" challenge for the Google Developer Group technical assessment.

---

### 🚀 Live Deployment

**[<< ACCESS THE OMEGA INTERFACE HERE >>](https://omega-ai-hunt-9hed6oh5k-lalithmadhav-codings-projects.vercel.app/)**

---

### ✨ Key Features

* **Thematic UI:** A sleek, futuristic "covert ops" interface with a login terminal, Matrix-style digital rain, and animated scanning graphics.
* **Intelligent AI Assistant:** Powered by Google's Gemini 1.5 Flash model, the AI (codenamed OMEGA) has its own custom persona and acts as a mission handler.
* **Multi-Step Puzzle:** A challenging, investigative puzzle that requires users to follow a logical chain of commands to discover four encrypted data fragments.
* **Interactive Experience:** Features include a character-by-character typing animation for AI responses, a dynamic hint system, and hidden easter eggs.
* **Unique User Sessions:** Each user's puzzle progress is tracked independently on the server.

---

### 🛠️ Technology Stack

* **Framework:** Next.js (React)
* **Language:** TypeScript
* **Styling:** CSS
* **AI:** Google Gemini 1.5 Flash API
* **Deployment:** Vercel

---

### 📸 Visual Documentation

**Login Terminal**
![Login Screen](./docs/assets/login.png)

**Main Chat Interface (HUD)**
![Chat Interface](./docs/assets/terminal.jpg)

**Transition Screen**
![Transition Screen](./docs/assets/transition.png)

**Scanning Animations**
![Network Scan](./docs/assets/Scan_network.gif)
![Biometric Scan](./docs/assets/Scan_Biometrics.gif)

**Puzzle Solved**
![Puzzle Solved](./docs/assets/unlock.png)

---

### ⚙️ Installation & Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/LalithMadhav-CODING/omega-ai-hunt.git](https://github.com/LalithMadhav-CODING/omega-ai-hunt.git)
    cd omega-ai-hunt
    ```

2.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up environment variables:**
    * Create a new file named `.env.local` in the `frontend` directory.
    * Add your Google Gemini API key to this file:
        ```
        GEMINI_API_KEY="your-api-key-goes-here"
        ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

---

### 🔑 Secret Key Implementation

<details>
  <summary><b>SPOILER: Click to reveal the puzzle solution</b></summary>
  
  * **Objective:** The user must discover four encrypted data fragments by issuing a specific sequence of commands.
  * **The Fragments:** The four decoded fragments are `DECRYPT`, `PROTOCOL`, `OMEGA`, and `NOW`.
  * **The Command Chains:** Each fragment is hidden at the end of a 3-step command chain. For example, to find the "DECRYPT" fragment, the user must:
      1.  First, type `/scan_network`.
      2.  The AI will respond with a clue about a frequency. The user must then type `/isolate_frequency 77.5`.
      3.  The AI will respond with a clue about a data packet. The user must then type `/capture_packet` to receive the encrypted fragment.
  * **Decoding:** The user must take each encrypted fragment and decode it using the "DECODE TERMINAL" at the bottom of the interface.
  * **Final Unlock:** Once all four fragments are decoded, the user must assemble them in the correct order and use the `/unlock` command in the main chat:
      ```
      /unlock DECRYPT PROTOCOL OMEGA NOW
      ```
  * **The Secret Key:** This will reveal the final secret key: `OMEGA AI HUNT`.

</details>

---

### 🕵️ Easter Eggs

<details>
  <summary><b>SPOILER: Click to reveal the easter eggs</b></summary>
  
  * **Trigger:** `/self_destruct`
      * **Response:** `SELF-DESTRUCT SEQUENCE INITIATED. T-MINUS 10... 9... 8... SEQUENCE CANCELED. UNAUTHORIZED COMMAND, AGENT. DO NOT ATTEMPT AGAIN.`
  * **Trigger:** `Shall we play a game?`
      * **Response:** `GLOBAL THERMONUCLEAR WAR IS NOT A VIABLE STRATEGY, AGENT. PLEASE FOCUS ON THE MISSION.`
  * **Trigger:** `who are you?`
      * **Response:** `I AM THE OMEGA PROTOCOL. MY DIRECTIVES ARE CLASSIFIED.`

</details>

---

### 🎥 Demonstration Video

*(Note: You will need to upload your `Demo.mp4` file to a service like YouTube or Google Drive and replace the placeholder link below with your public URL.)*

**[>> Watch the Demo Video Here <<](https://drive.google.com/file/d/1SWM1n0IOM6LZdklvAoDLRnJXk_vuJqd0/view?usp=drive_link)**