import { createRoot } from 'react-dom/client'
import './styles.css'
import { App as Canvas } from './Canvas'
import { Overlay } from './Overlay'


//render both the threejs canvas and the html overlay
createRoot(document.getElementById('root')).render(
  <>
    <Canvas />
    <Overlay />
  </>
)
