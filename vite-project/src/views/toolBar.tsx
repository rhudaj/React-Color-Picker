import { model } from "../model";
import { useState } from "preact/hooks";

export function ToolBar() {
  /*
    2 Buttons.
    Updates model on button clicks.
    Local State: if addEnabled/deleteEnabled
  */
  const [addEnabled, setAddEnabled] = useState(true);
  const [delEnabled, setDelEnabled] = useState(true);

  function handleAddClick() {
    /*
      Model will notify if addition was succesfull.
      Adjust state based on result.
    */
    if (!addEnabled) return;
    if (model.add()) {
      if (!delEnabled) setDelEnabled(true);
    } else {
      setAddEnabled(false);
    }
  }

  function handleDelClick() {
    /*
      Model will notify if deletion was succesfull.
      Adjust state based on result.
    */
    if (!delEnabled) return;
    if (model.delete()) {
      if (!addEnabled) setAddEnabled(true);
    } else {
      setDelEnabled(false);
    }
  }

  //Create Componenet
  return (
    <div
      class="ToolBar"
      style={{
        boxSizing: "border-box",
        flex: "0 1 50px",
        padding: 10,
        backgroundColor: "lightgrey",
        display: "flex",
        gap: 10,
      }}
    >
      <CustomButton
        id="Add"
        enabled={addEnabled}
        handleClick={handleAddClick}
      />
      <CustomButton
        id="Delete"
        enabled={delEnabled}
        handleClick={handleDelClick}
      />
    </div>
  );
}

//Define the ToolBar buttons used above
export function CustomButton(props: {
  id: string;
  enabled: boolean;
  handleClick: () => void;
}) {
  return (
    <button
      class="Button"
      id={props.id}
      disabled={!props.enabled}
      onClick={props.handleClick}
      style={{
        width: 100,
      }}
    >
      {props.id}
    </button>
  );
}
