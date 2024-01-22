import { render } from "preact";
import * as Views from "./views/index";

export function App() {
  /*
    Main App Structure.
    Has no state, just div's to contain views.
  */
  return (
    <div
      id="root"
      style={{
        height: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Views.ToolBar></Views.ToolBar>
      <div
        id="CentralWidget"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 100%",
        }}
      >
        <div
          id="Editor"
          style={{
            display: "flex",
            gap: 10,
            backgroundColor: "whitesmoke",
            padding: 10,
            flex: "1 1 100%",
          }}
        >
          <Views.DMArea></Views.DMArea>
          <Views.FormArea></Views.FormArea>
        </div>
        <Views.SwatchList></Views.SwatchList>
      </div>
      <Views.StatusBar></Views.StatusBar>
    </div>
  );
}

render(<App />, document.getElementById("app")!);
