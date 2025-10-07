import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import readline from "node:readline/promises";
import { ChatGroq } from "@langchain/groq";
import dotenv from 'dotenv'
dotenv.config();

/**
 * node define
 * graph workflow
 *  complile and invoke
 */

const model = new ChatGroq({
    model:"openai/gpt-oss-120b",
    temperature:0,
    maxRetries:2
})
async function callModel(state) {
    const response = await model.invoke(state.messages);
  return { messages: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addEdge("agent", "__end__");

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
    console.log("FinalState ", aiResponse);
  }

  r1.close();
};

main();
