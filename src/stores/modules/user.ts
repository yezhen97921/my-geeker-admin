import { defineStore } from "pinia"
import { UserState } from "@/stores/interface"
import pinisPersistConfig from "@/stores/helper/persist"

export const useUserStore = defineStore({
  id: "geeker-user",
  state: (): UserState => ({
    token: "",
    userInfo: { name: "Geeker" }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set userInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    }
  },
  persist: pinisPersistConfig("geeker-user")
});
