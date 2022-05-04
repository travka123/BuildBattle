const colors = [
    [0   / 255, 0   / 255, 0   / 255],
    [255 / 255, 0   / 255, 0   / 255],
    [255 / 255, 102 / 255, 0   / 255],
];

function colorById(id) {
    return (colors[id - 1]);
}

export default colorById;