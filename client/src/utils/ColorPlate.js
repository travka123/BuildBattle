class ColorPlate {

    static colorsRGB = [
        [0  , 0  , 0  ],
        [255, 0  , 0  ],
        [255, 102, 0  ],
    ];

    static colorsRGBGL;

    static {
        this.colorsRGBGL = this.colorsRGB.map((arr) => {
            
            return arr.map((v) => {

                return v / 255;
            });
        });
    }
}

export default ColorPlate;