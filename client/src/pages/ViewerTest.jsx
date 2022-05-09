import Viewer from "../components/Viewer";

const ViewerTest = () => {

    return (
        <Viewer blocks={[{x: 2, y: 2, z: 3, colorId: 2}]} />
    );
};

export default ViewerTest;