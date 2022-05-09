import { useEffect } from "react";

const EvaluationBar = ({style, rating, setSelected}) => {

    useEffect(() => {

        var elems = document.querySelectorAll('.evaluationBarCell');

        elems.forEach((t) => {

            const onClick = () => {

                const value = Number(t.attributes.value.value);
    
                if (setSelected) {
    
                    setSelected(value);
                }
            };

            t.addEventListener('click', onClick);

            t.attributes.value.cb = onClick;
        });

        return () => elems.forEach((t) => t.removeEventListener('click', t.attributes.value.cb));
    }, [setSelected]);

    return (
        <div className="EvaluationBar">
            <div className="d-flex flex-row flex-wrap text-center" style={{background: 'rgba(0, 0, 0, 0.4)', borderRadius: '5px', userSelect: 'none', ...style}}>
                {[1, 2, 3, 4, 5].map((i) => 
                    <div key={i} value={i} className="m-3 evaluationBarCell" style={{width: '50px', height: '50px', backgroundColor: 'white',
                        ...(i === rating ? {backgroundColor: 'gold'} : {})}}>
                        <h2>{i}</h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EvaluationBar;