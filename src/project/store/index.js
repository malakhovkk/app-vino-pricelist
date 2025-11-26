import { create } from "zustand";
import axios from "axios";
const logMiddleware = (config) => (set, get, api) =>
  config((args) => {
    console.log("State before update:", get());
    set(args);
    console.log("State after update:", get());
  });

const useStore = create(
  logMiddleware((set, get) => ({
    todos: [],
    loading: false,
    error: null,
    info: {},
    login: "",
    password: "",
    token: "",
    updateInfo() {
      const todos = get().todos;
      const { length: total } = todos;
      const active = todos.filter((t) => !t.done).length;
      const done = total - active;
      const left = Math.round((active / total) * 100) + "%";
      set({ info: { total, active, done, left } });
    },
    addTodo(newTodo) {
      const todos = [...get().todos, newTodo];
      set({ todos });
    },
    updateTodo(id) {
      const todos = get().todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      );
      set({ todos });
    },
    removeTodo(id) {
      const todos = get().todos.filter((t) => t.id !== id);
      set({ todos });
    },
    completeActiveTodos() {
      const todos = get().todos.map((t) => (t.done ? t : { ...t, done: true }));
      set({ todos });
    },
    removeCompletedTodos() {
      const todos = get().todos.filter((t) => !t.done);
      set({ todos });
    },
    setLogin: (login) => set(() => ({ login })),
    setPassword: (password) => set(() => ({ password })),
    setToken: (token) => set(() => ({ token })),
    async fetchTodos() {
      set({ loading: true });

      //{ запрос {{base_url}}/api/shop/e419c34f-6856-11ea-8298-001d7dd64d88 }
      let data = await axios(
        "http://194.87.239.231:55555/api/shop/e419c34f-6856-11ea-8298-001d7dd64d88",
        {
          headers: {
            User: "admin",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJleHAiOjE3MjA3MDc4MzAsImlzcyI6IldpbmVTZXJ2ZXIiLCJhdWQiOiJhZG1pbiJ9.45aCF4KH_vSZPdTw6tRsOMjySjOE0YqA-Jo1lgmxQRc",
          },
          // headers: {
          //   //"content-type": "application/x-www-form-urlencoded",
          //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          //   User: `${localStorage.getItem("login")}`,
          // },
        }
      );
      console.log(await data);
      set({ stocks: await data });

      // try {
      //   const response = await fetch(SERVER_URI);
      //   if (!response.ok) throw response;
      //   set({ todos: await response.json() });
      // } catch (e) {
      //   let error = e;
      //   // custom error
      //   if (e.statusCode === 400) {
      //     error = await e.json();
      //   }
      //   set({ error });
      // } finally {
      //   set({ loading: false });
      // }
    },
  }))
);

export default useStore;
