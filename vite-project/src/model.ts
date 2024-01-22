import { HSL } from "./ColorModels";
import { signal } from "@preact/signals";

//HELPER : Returns an integer in [min,max]
function rand(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min));
}

class Model {
  /*
  Model
    I copied the same model from previous 2 assigments.
    Only difference, is that state's are now Signal's.
  */
  //Constants
  private _min: number = 1; // min # colors
  private _max: number = 16; // max # colors
  private start_n: number = 10; // starting # of colors

  //Internal State
  private _colors: HSL[] = [];

  //App State (SIGNALS)
  public selected = signal(this.start_n - 1);
  public selectedColor = signal(new HSL());

  constructor() {
    // Create <start_n> random colors
    for (let i = 0; i < this.start_n; i++) {
      this._colors.push(this.newRandomColor());
    }
    this.selectedColor.value = this._colors[this.start_n - 1];
  }

  //HELPER
  newRandomColor() {
    return new HSL(rand(0, 360), rand(0, 100), rand(0, 100));
  }

  // GETTERS

  get n() {
    return this._colors.length;
  }

  get colors() {
    return this._colors;
  }

  //Setters (works carefully with the signals)

  setSelectedColor(h?: number, s?: number, l?: number) {
    //Update Model
    const col = this._colors[this.selected.value];
    col.h = h ?? col.h; //HSL does clamping
    col.s = s ?? col.s; //HSL does clamping
    col.l = l ?? col.l; //HSL does clammping
    //Update State (need to create a deep copy to activate signal)
    this.selectedColor.value = new HSL(col.h, col.s, col.l);
  }

  setSelected(i: number) {
    //Only send the signals if selected index changed
    if (this.selected.value == i) return;
    this.selected.value = i; //sends a signal
    const sel_col = this._colors[i];
    if (this.selectedColor.value === sel_col) return;
    this.setSelectedColor(sel_col.h, sel_col.s, sel_col.l); //sends a signal
  }

  add(): boolean {
    /*
      Don't add if it would make # colors > max
      SENDS SIGNAL ONLY IF ADDITION HAPPENS
      Return wether or not the addition happened (boolean)
    */
    if (this._colors.length >= this._max) return false;
    this._colors.push(this.newRandomColor());
    this.setSelected(this._colors.length - 1);
    return true;
  }

  delete(): boolean {
    /*
      Don't delete if it would make # colors < min
      SEND SIGNAL ONLY IF THE DELETION HAPPENS
      Return wether or not the addition happened (boolean)
    */
    if (this._colors.length <= this._min) return false;
    this._colors.splice(this.selected.value, 1);
    this.setSelected(this._colors.length - 1);
    return true;
  }
}

export const model = new Model(); //for reference to signals
