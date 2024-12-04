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

export async function formServerAction(formData: FormData) {
  console.log(formData);
  await sleep();

  return {
    success: true,
  };
}
