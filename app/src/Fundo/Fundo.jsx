import './Fundo.css';
import ValorantScreen from '../assets/video/Valorant.mp4'

function Fundo() {
    return (
    <div className="Fundo">
        <video autoPlay loop muted>
            <source src={ValorantScreen} type="video/mp4" />
        </video>
    </div>
    )
}

export default Fundo