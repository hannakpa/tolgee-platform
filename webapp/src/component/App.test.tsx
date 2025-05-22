
import { App } from './App';
import { test, expect } from 'vitest';
import {render, screen} from '@testing-library/react'


describe('App', () => {
  it('muestra el texto Tolgee', () =>{
render (<App />)
  expect(screen.getByText(/Tolgee/i)).toBeInTheDocument()
  })
  
})
