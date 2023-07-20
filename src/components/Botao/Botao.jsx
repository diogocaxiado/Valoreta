import './Botao.css';

export default function Botao({handleClick}) { 
    
    return (
        <div className='Botao'>
            <div className='botao-roleta'>
                <button onClick={() => handleClick()}>Rodar</button>
            </div>
        </div>
    )
}
