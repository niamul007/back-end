import { readData, writeData } from "../model/habitModel.mjs";
import crypto from "crypto";

export const showAllHabit = async () => {
  const data = await readData();
  return data;
};

export const addHabit = async (task) => {
    const data = await readData();
    const newData = {
      id: crypto.randomUUID(),
      task, // shorthand for task: task
      isDone: false,
    };
    
    data.push(newData); // This modifies the 'data' array in place
    await writeData(data); // Save the actual array ('data'), not the result of .push()
    return newData; // Return the new item so the Controller can show it
};


export const delHabit = async (id) =>{
  const data = await readData();
  const update = data.filter((item) => item.id !== id);

  if(update.length === data.length){
    throw new Error("Not found")
  }
  await writeData(update)
  return update;
}