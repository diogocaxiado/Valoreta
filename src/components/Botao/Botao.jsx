import './Botao.css';

export default function Botao({filtro}) {

    return (
        <div className='Botao'>
            <div className='botao-roleta'>
                <button onClick={() => filtro()}>Rodar</button>
            </div>
        </div>
    )
}
