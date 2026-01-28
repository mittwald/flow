import type { ActionStateValue } from "@/components/Action/models/ActionState";
import { ActionModel } from "@/components/Action/models/ActionModel";

export const useActionState = (): ActionStateValue => {
  const action = ActionModel.use();
  return action.state.useValue();
};
