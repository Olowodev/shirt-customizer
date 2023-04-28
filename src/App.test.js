import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'
import {Overlay, Customizer} from './Overlay'
import { App, Backdrop, CameraRig, NameTexture, NumberTexture, Shirt } from './Canvas.js'

afterEach(cleanup)

describe("Overlay component", () => {
    it("should render the overlay component without crashing", () => {
        render(<Overlay />)
    })

    
    it("renders customizer component", () => {
        render(<Customizer />)
    })
})