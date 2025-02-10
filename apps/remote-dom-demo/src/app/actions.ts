"use server";

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

export async function formServerAction(prevState: number, formData: FormData) {
  console.log("Calling form server action with data: ", formData);
  await sleep();
  console.log("Done");
  return prevState + 1;
}

export async function formReactHookServerAction(
  prevState: unknown,
  formData: FormData,
) {
  await sleep();
  console.log("action form", formData);
}
