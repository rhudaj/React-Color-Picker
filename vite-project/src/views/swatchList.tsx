import { model } from "../model";

export function Swatch(props: {
  selected: boolean;
  id: number;
  colour: string;
}) {
  /*
    Simple div, that takes a color and wether or not it's selected.
    Only the selected swatch will get updates from the model.
  */
  return (
    <div
      key={props.id}
      onClick={() => model.setSelected(props.id)}
      style={{
        backgroundColor: `${
          props.selected ? model.selectedColor.value : props.colour
        }`,
        height: 50,
        width: 50,
        border: `solid ${props.selected ? "black" : "lightgrey"}`,
      }}
    ></div>
  );
}

export function SwatchList() {
  /*
    Holds the swatches.
    Looks at model.selected and model.n
  */
  function createSwatches(selected: number) {
    let swatches: any[] = [];
    model.colors.forEach((hsl, index) => {
      swatches.push(
        <Swatch
          selected={index === selected}
          id={index}
          colour={hsl.toString()}
        />
      );
    });
    return swatches;
  }

  //Create the component
  return (
    <div
      class="SwatchList"
      style={{
        paddingTop: 10,
        paddingLeft: 10,
        flex: "1 1 100%",
        display: "flex",
        gap: 20,
        rowGap: 10,
        flexWrap: "wrap",
        alignContent: "start",
      }}
    >
      {createSwatches(model.selected.value)}
    </div>
  );
}
