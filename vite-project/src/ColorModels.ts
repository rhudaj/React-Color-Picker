export class HSL {
  /*
    Store H-S-L values.
    Manage how they are created (at random) and changed (clamping)
    Also, convert to/from other colors
  */
  private _h: number;
  private _s: number;
  private _l: number;

  constructor(h: number = 0, s: number = 0, l: number = 0) {
    this._h = h;
    this._s = s;
    this._l = l;
  }

  get h() {
    return this._h;
  }
  get s() {
    return this._s;
  }
  get l() {
    return this._l;
  }

  set h(h: number) {
    if (h > 360) h = 360;
    if (h < 0) h = 0;
    this._h = h;
  }

  set s(s: number) {
    if (s > 100) s = 100;
    if (s < 0) s = 0;
    this._s = s;
  }

  set l(l: number) {
    if (l > 100) l = 100;
    if (l < 0) l = 0;
    this._l = l;
  }

  toString(): string {
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
  }

  toHEX(): string {
    //first to rgb, then to hex
    const rgb = new RGB();
    rgb.fromHSL(this);
    return rgb.toHex();
  }

  fromHEX(hex: string) {
    //First ot rgb, then to hsl
    const rgb = new RGB();
    rgb.fromHEX(hex);
    this.fromRGB(rgb);
  }

  fromRGB(rgb: RGB) {
    //Copy (don't change original)
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;
    //--
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    // set HSL
    this._h = h < 0 ? 60 * h + 360 : 60 * h;
    this._s =
      100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0);
    this._l = (100 * (2 * l - s)) / 2.0;
  }
}

export class RGB {
  /*
    Object to hold r,g & b values
    Convert to hex/hsl
  */

  constructor(
    public r: number = 0,
    public g: number = 0,
    public b: number = 0
  ) {}

  //hsl-2-rgb
  fromHSL(hsl: HSL) {
    let s = hsl.s / 100;
    let l = hsl.l / 100;
    let h = hsl.h;
    //----
    let a = s * Math.min(l, 1 - l);
    let f = (n: number): number => {
      let k = (n + h / 30) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    //Don't round (let UI do that)
    this.r = f(0) * 255;
    this.g = f(8) * 255;
    this.b = f(4) * 255;
  }

  toHex(): string {
    function componentToHex(c: number) {
      c = Math.round(c);
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    return (
      "#" +
      componentToHex(this.r) +
      componentToHex(this.g) +
      componentToHex(this.b)
    );
  }

  fromHEX(hex: string) {
    this.r = parseInt(hex.substring(1, 3), 16);
    this.g = parseInt(hex.substring(3, 5), 16);
    this.b = parseInt(hex.substring(5, 7), 16);
  }
}
