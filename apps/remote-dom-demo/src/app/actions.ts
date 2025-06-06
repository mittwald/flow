"use server";

import type { ActionState } from "@/app/remote/action-form/page";

const sleep = () => new Promise((res) => setTimeout(res, 2000));

export async function getServerData() {
  await sleep();
  return "Data from server action";
}

export async function login(formState: unknown | null, formData: FormData) {
  await sleep();
  console.log(formData, "Server");

  return {
    success: true,
  };
}

export async function formServerAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  console.log("Calling form server action with data: ", formData);
  await sleep();

  return { increment: prevState.increment + 1 };
}

export async function formReactHookServerAction(
  prevState: unknown,
  formData: FormData,
) {
  await sleep();
  console.log("action form", formData);
}
