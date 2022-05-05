import React, { useEffect, useState } from "react";
import ColorPlate from "../utils/ColorPlate";

const ColorPicker = ({style, onColorChange}) => {

    const [selected, setSelected] = useState(null);

    useEffect(() => {

        document.querySelectorAll('.colorPickerCell').forEach((t) => {

            t.addEventListener('click', () => {

                const colorId = Number(t.attributes.value.value);

                setSelected(colorId);

                onColorChange(colorId);
            });
        });

    }, [onColorChange]);

    return (
        <div className="d-flex flex-row flex-wrap" style={{background: 'rgba(0, 0, 0, 0.4)',maxWidth: '40%', borderRadius: '5px', ...style}}>

            {ColorPlate.colorsRGB.map((rgb, id) => 
                
                <div key={id} value={id} className="colorPickerCell m-0 m-3" style={{width: '50px', height: '50px', backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
                    ...(id === selected ? {border: `6px dashed rgb(${255 - rgb[0]}, ${255 - rgb[1]}, ${255 - rgb[2]})`} : {})}} />
                         
            )}
        </div>
    );
}

export default ColorPicker;