import { model } from "../model";
import { useLayoutEffect, useRef } from "preact/hooks";

export function DMArea() {
  /*
    Hold a canvas with a slider and a color picker
  */

  //create the component
  return (
    <div
      id="DMArea"
      style={{
        flex: "1 1 100%",
        border: "2px solid black",
        display: "flex",
        gap: 10,
        padding: 10,
      }}
    >
      <SLPicker
        s={model.selectedColor.value.s}
        l={model.selectedColor.value.l}
      />
      <HSlider hue={model.selectedColor.value.h} />
    </div>
  );
}

type SLPicker_Props = {
  s: number;
  l: number;
};

export function SLPicker(props: SLPicker_Props) {
  /*
    Render a canvas for the sat,lum values of the given hue
    Let the user pick a value on the gradient.
  */
  //Constants
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const w = 200;
  const h = 200;
  const hue = model.selectedColor.value.h;
  //Update the x,y position
  let x = props.s * (w / 100);
  let y = h - props.l * (h / 100);

  //Drawing
  useLayoutEffect(() => {
    const gc = canvasRef.current?.getContext("2d");
    if (gc) draw(gc);
  });

  //Draw the point for the s,l values
  function drawPoint(gc: CanvasRenderingContext2D) {
    gc.lineWidth = 2;
    //White, Outer Circle
    gc.strokeStyle = "white";
    gc.beginPath();
    gc.arc(x, y, 5, 0, 2 * Math.PI);
    gc.stroke();
    //Black, Inner Circle
    gc.strokeStyle = "black";
    gc.beginPath();
    gc.arc(x, y, 3, 0, 2 * Math.PI);
    gc.stroke();
  }

  //Draw teh gradient:
  function draw(gc: CanvasRenderingContext2D) {
    gc.save();
    gc.clearRect(0, 0, w, h);
    //--------
    gc.globalCompositeOperation = "overlay";
    //---------------------
    const lum_grad = gc.createLinearGradient(0, 0, 0, 200);
    lum_grad.addColorStop(0, `hsl(${hue},50%,100%)`);
    lum_grad.addColorStop(1, `hsl(${hue},50%,0%)`);
    gc.fillStyle = lum_grad;
    gc.fillRect(0, 0, w, h);
    //---------------------
    const sat_grad = gc.createLinearGradient(w, 0, 0, 0);
    sat_grad.addColorStop(0, `hsl(${hue},100%,50%)`);
    sat_grad.addColorStop(1, `hsl(${hue},0%,50%)`);
    gc.fillStyle = sat_grad;
    gc.fillRect(0, 0, w, h);
    //---------------------
    gc.globalCompositeOperation = "source-over";
    drawPoint(gc);
    //--------
    gc.restore();
  }

  //Handle a click -> update the model's sat/lum values for the selected color
  const handleClick = (e: MouseEvent) => {
    if (e.offsetX < 0 || e.offsetX > w || e.offsetY < 0 || e.offsetY > h)
      return;
    const new_s = e.offsetX / (w / 100);
    const new_l = (h - e.offsetY) / (h / 100);
    model.setSelectedColor(hue, new_s, new_l);
  };

  //create the component (a canvas)
  return (
    <canvas
      ref={canvasRef}
      width={w}
      height={h}
      onClick={handleClick}
      style={{ width: w, height: h }}
    />
  );
}

export function HSlider(props: { hue: number }) {
  /*
    Simple canvas to display hue gradient and let the user
    update the selected color's hue value.
  */
  //Constants
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const x = 210;
  const w = 20;
  const h = 200;
  //State (pos)
  let pos = props.hue * (h / 360);

  //On a click, update the model.selectedColor's hue value
  const handleClick = (e: MouseEvent) => {
    if (e.offsetX < 0 || e.offsetX > w || e.offsetY < 0 || e.offsetY > h)
      return;
    const new_hue = Math.round(e.offsetY / (h / 360));
    model.setSelectedColor(new_hue, undefined, undefined);
  };

  //Drawing
  useLayoutEffect(() => {
    const gc = canvasRef.current?.getContext("2d");
    if (gc) draw(gc);
  });

  //Draw the bar the the user can move
  function drawBar(gc: CanvasRenderingContext2D) {
    gc.lineWidth = 2;
    gc.strokeStyle = "white";
    gc.strokeRect(0, pos, w, 5);
    gc.strokeStyle = "black";
    gc.strokeRect(1, pos + 1, w - 2, 3);
  }

  //Draw the hue gradient
  function draw(gc: CanvasRenderingContext2D) {
    gc.save();
    gc.clearRect(x, 0, w, h);
    //--------
    const hue_grad = gc.createLinearGradient(0, 0, 0, h);
    for (let i = 0; i <= 360; i++)
      hue_grad.addColorStop(i / 360, `hsl(${i},100%,50%)`);
    gc.fillStyle = hue_grad;
    gc.fillRect(0, 0, w, h);
    //---------
    drawBar(gc);
    //--------
    gc.restore();
  }

  //create the component (a canvas)
  return (
    <canvas
      ref={canvasRef}
      width={w}
      height={h}
      onClick={handleClick}
      style={{ width: w, height: h }}
    />
  );
}
