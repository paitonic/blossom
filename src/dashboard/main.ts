import { mount } from "svelte";
import App from "./App.svelte";
import { migrate } from "@/shared/migrations";

const init = async () => {
  await migrate();
  const app = mount(App, {
    target: document.getElementById("app"),
  });
  return app;
};

const app = init();

export default app;
