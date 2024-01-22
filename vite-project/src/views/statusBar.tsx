import { model } from "../model";

export function StatusBar() {
  /*
    Simply display model state facts(selected, n)
  */
  return (
    <div
      class="StatusBar"
      style={{
        height: 50,
        paddingRight: 10,
        backgroundColor: "lightgrey",
      }}
    >
      <p style={{ textAlign: "right" }}>
        {model.n} swatches (selected # {model.selected.value + 1})
      </p>
    </div>
  );
}
