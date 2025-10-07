import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import readline from "node:readline/promises";
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt"
import { TavilySearch } from "@langchain/tavily";

import dotenv from 'dotenv'
import { Agent } from "node:http";
dotenv.config();

/**
 * node define
 * graph workflow
 *  complile and invoke
 */

const tavily_search_tool = new TavilySearch({
  maxResults: 3,
  topic: "general",
  // includeAnswer: false,
  // includeRawContent: false,
  // includeImages: false,
  // includeImageDescriptions: false,
  // searchDepth: "basic",
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
});

const tools  = [tavily_search_tool]
const toolNode = new ToolNode(tools);

const model = new ChatGroq({
    model:"openai/gpt-oss-120b",
    temperature:0,
    maxRetries:2
}).bindTools(tools);

function shouldContinue({messages}){
  const lastMessage = messages[messages.length - 1] 

  if (lastMessage.tool_calls?.length) {
    console.log("tool call...");
    
    return "tools";
  }

  return "__end__";

}

async function callModel(state) {
    console.log("LLM calling ...");
    const response = await model.invoke(state.messages);
  return { messages: [response] };
}



const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent" , shouldContinue)     
  
  
const app = workflow.compile();

const main = async () => {
  const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const prompt = await r1.question("You : ");
    if (prompt === "/bye") break;

    const finalState = await app.invoke({
      messages: [{role:"user" , content:prompt}],
    });
    const aiResponse = finalState.messages[finalState.messages.length - 1].content
    console.log("AI : ", aiResponse);
  }

  r1.close();
};

main();
