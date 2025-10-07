# Talker AI 🤖

A simple, yet powerful, conversational AI agent built with Node.js, **LangChain.js**, and **LangGraph**. This project demonstrates how to create a cyclical, tool-using AI that can access real-time information from the web to answer your questions.

## Features ✨

-   **Conversational Loop:** Engage in a continuous conversation directly from your terminal.
-   **LangGraph State Machine:** Built on a robust state graph that manages the flow between the AI and its tools.
-   **Tool-Augmented AI:** The agent can decide when to use tools to answer questions it doesn't know the answer to.
-   **Live Web Search:** Integrated with **Tavily Search** to pull in up-to-date information from the internet.
-   **High-Speed LLM:** Powered by the **Groq API** for fast and efficient language model inference.
-   **Persistent Memory:** Includes a basic `MemorySaver` to maintain conversation history within a session.

## Tech Stack 🛠️

-   **Runtime:** [Node.js](https://nodejs.org/)
-   **AI Framework:** [LangChain.js](https://js.langchain.com/)
-   **Graph State Machine:** [@langchain/langgraph](https://js.langchain.com/docs/langgraph)
-   **LLM Provider:** [@langchain/groq](https://js.langchain.com/docs/integrations/chat/groq)
-   **Web Search Tool:** [@langchain/tavily](https://js.langchain.com/docs/integrations/tools/tavily_search)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)
-   A **Groq API Key**. You can get one for free at [GroqCloud](https://console.groq.com/keys).
-   A **Tavily API Key**. You can get one at [Tavily AI](https://app.tavily.com/).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sudhanshuJha01/talker-ai-agent.git
    cd talker-ai
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a file named `.env` in the root of your project and add your API keys:
    ```env
    GROQ_API_KEY="gsk_..."
    TAVILY_API_KEY="tvly-..."
    ```

### Running the Application

Once the setup is complete, you can start the conversational agent with the following command:

```bash
node index.js
```

You can now start chatting with the AI! To end the session, type `/bye` and press Enter.

## How It Works 🧠

This project uses **LangGraph** to define a state machine that orchestrates the conversation.



1.  **Start:** The graph starts when the user provides input.
2.  **Agent Node:** The input is passed to the `agent` node. This node, powered by the Groq LLM, decides whether it can answer the question directly or if it needs to use a tool.
3.  **Conditional Edge (`shouldContinue`):**
    -   If the LLM's response includes a request to use a tool (a "tool call"), the graph transitions to the `tools` node.
    -   If the LLM can answer directly, the graph transitions to the end state (`__end__`), and the response is printed.
4.  **Tool Node:** The `tools` node executes the requested function (in this case, `TavilySearch`).
5.  **Loop:** The output from the tool is sent back to the `agent` node, which uses this new information to generate a final answer.

This cyclical process allows the agent to iteratively gather information until it has enough context to provide a comprehensive answer.
