import { defineStore } from "pinia";

export interface ConfirmData {
  id: number;
  name: string;
}
export const useConfirmStore = defineStore("confirmStore", {
  state: (): {
    data: ConfirmData[];
  } => ({
    data: [
      { id: 1, name: "Hannes" },
      { id: 2, name: "Hennes" },
    ],
  }),
});
