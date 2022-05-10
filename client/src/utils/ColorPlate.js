class ColorPlate {

    static colorsRGB = [
        [0  , 0  , 0  ],
        [255, 0  , 0  ],
        [255, 102, 0  ],
        [255, 255, 0  ],
        [0  , 255, 0  ],
        [30 , 144, 255],
        [0  , 0  , 255],
        [153, 50 , 204],
        [255,   0, 255],
        [255, 255, 255],
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