import { ChangeEvent } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { model } from "../model";
import { HSL, RGB } from "../ColorModels";

export function FormArea() {
  /*
    Struture:
      radio buttons to select which type of form is displayed
      Form - either HSL, RGB or HEX
    Data:
      option: local state, says which one is active.
  */

  const [option, setOption] = useState("hsl");

  function optionSelect(option: string) {
    //Factory function, setter to set the local state 'option'
    return () => setOption(option);
  }

  /*
    Create Component
    - Only display the form that is the active option (using display propert of div)
  */
  return (
    <div
      id="FormArea"
      style={{
        padding: 10,
        flex: "1 1 100%",
        border: "2px solid grey",
      }}
    >
      <div id="options" style={{ display: "flex", gap: 20 }}>
        <Option
          type="hsl"
          clickHandler={optionSelect}
          checked={option === "hsl"}
        />
        <Option
          type="rgb"
          clickHandler={optionSelect}
          checked={option === "rgb"}
        />
        <Option
          type="hex"
          clickHandler={optionSelect}
          checked={option === "hex"}
        />
      </div>
      <div id={"Form"} style={{ padding: 10, flex: "1 1 100%" }}>
        <div hidden={option !== "hsl"}>
          <FormHSL />
        </div>
        <div hidden={option !== "rgb"}>
          <FormRGB />
        </div>
        <div hidden={option !== "hex"}>
          <FormHEX />
        </div>
      </div>
    </div>
  );
}

//-----------------------------------------------------------------------------

export function Option(props: {
  type: string;
  clickHandler: any;
  checked: boolean;
}) {
  /*
    Simple radio button that has a cusstom handler for clicks (defined above)
  */
  return (
    <label>
      <input
        type="radio"
        name="option"
        value={props.type}
        onClick={props.clickHandler(props.type)}
        checked={props.checked}
      />
      {props.type.toUpperCase()}
    </label>
  );
}

//-----------------------------------------------------------------------------

function Control(props: {
  name: string;
  min: number;
  max: number;
  value: number;
  valChange: (val: number) => void;
}) {
  /*
    Define the standard 'Control' for HSL/RGB forms (a text field + slider to change a value)
    Notes:
    - Prop drilling needed: the component has no idea what value it's storing
    - For the UI, round the value to display, but store the actual value.
      Otherwise, if you display the value (round it), and the user does not
      change the value, the actual value will still change
  */
  const round_value = Math.round(props.value);

  function valChange(e: ChangeEvent) {
    //ONLY handle a value changed (not just any input)
    const input_value = Number((e.target as HTMLInputElement).value);
    //Add the difference to the original value
    props.valChange(props.value + (input_value - round_value));
  }

  //Create the component
  return (
    <div
      key={props.name}
      id={props.name}
      style={{ display: "flex", gap: 10, alignItems: "center" }}
    >
      <p style={{ width: 30, textAlign: "right" }}>{props.name}</p>
      <input
        type="number"
        min={props.min}
        max={props.max}
        value={round_value}
        onInput={valChange}
        style={{ width: 50 }}
      />
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={round_value}
        onInput={valChange}
        style={{ flex: "1 1 auto" }}
      />
    </div>
  );
}

function FormHSL() {
  /*
    Has 3 controls, for H, S & L values
    Directly changes and reacts to a change in the model.selectedColor signal
  */
  return (
    <>
      <Control
        name="Hue"
        min={0}
        max={360}
        value={model.selectedColor.value.h}
        valChange={(value) =>
          model.setSelectedColor(value, undefined, undefined)
        }
      />
      <Control
        name="Sat"
        min={0}
        max={100}
        value={model.selectedColor.value.s}
        valChange={(value) =>
          model.setSelectedColor(undefined, value, undefined)
        }
      />
      <Control
        name="Lum"
        min={0}
        max={100}
        value={model.selectedColor.value.l}
        valChange={(value) =>
          model.setSelectedColor(undefined, undefined, value)
        }
      />
    </>
  );
}

export function FormRGB() {
  /*
    Has 3 controls, for R, G & B values
    Changes and reacts to a change in the model.selectedColor signal
  */
  const [rgb] = useState(new RGB());

  // Update local state when App State changes
  useEffect(() => {
    rgb.fromHSL(model.selectedColor.value);
  }, [model.selectedColor.value]);

  //When an r,g or b control changes it's value, update the HSL value in the model
  function updateHSL() {
    let new_hsl: HSL = new HSL();
    new_hsl.fromRGB(rgb);
    model.setSelectedColor(new_hsl.h, new_hsl.s, new_hsl.l);
  }

  return (
    <>
      <Control
        name="R"
        min={0}
        max={255}
        value={rgb.r}
        valChange={(val) => {
          if (rgb.r != val) rgb.r = val;
          updateHSL();
        }}
      />
      <Control
        name="G"
        min={0}
        max={255}
        value={rgb.g}
        valChange={(val) => {
          if (rgb.g != val) rgb.g = val;
          updateHSL();
        }}
      />
      <Control
        name="B"
        min={0}
        max={255}
        value={rgb.b}
        valChange={(val) => {
          if (rgb.b != val) rgb.b = val;
          updateHSL();
        }}
      />
    </>
  );
}

export function FormHEX() {
  /*
    Store a hex value (local state).
    Keep track of cur_text too. When invalid, display cur_text, otherwise
    display the hex value.
  */
  const [hex, setHex] = useState(model.selectedColor.value.toHEX());
  const [curText, setCurText] = useState(hex);
  const [invalid, setInvalid] = useState(false);

  // Update local state when App State changes
  useEffect(() => {
    setHex(model.selectedColor.value.toHEX());
  }, [model.selectedColor.value]);

  //Change the hex value if input is valid. Update the model too.
  function hexChanged(e: ChangeEvent) {
    const new_hex = (e.target as HTMLInputElement).value as string;
    setCurText(new_hex);
    if (/^[#][0-9a-fA-F]{6}$/.test(new_hex)) {
      //Update local state
      setHex(new_hex);
      //Update app state (selectecColor)
      const new_hsl = model.selectedColor.value;
      new_hsl.fromHEX(new_hex);
      model.setSelectedColor(new_hsl.h, new_hsl.s, new_hsl.l);
      if (invalid) setInvalid(false);
    } else {
      setInvalid(true);
    }
  }

  //Reset to good hex value if focus lost on invalid state.
  function focusLost() {
    if (invalid) setInvalid(false);
    setCurText(hex);
  }

  //Create the component
  return (
    <>
      <input
        type="text"
        value={curText}
        onChange={(e: ChangeEvent) => hexChanged(e)}
        onfocusout={focusLost}
      />
      <p hidden={!invalid} style={{ color: "red" }}>
        Invalid: must be valid hex colour
      </p>
    </>
  );
}
