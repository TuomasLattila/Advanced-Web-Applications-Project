//Code from react-spring's website that is modified a litle for the slider:

import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'

const left = {
  bg: `none`,
  justifySelf: 'end',
}
const right = {
  bg: `none`,
  justifySelf: 'start',
} 

const Slider = ({ children }) => {
  const [{ x, bg, scale, justifySelf }, api] = useSpring(() => ({
    x: 0,
    scale: 1,
    ...left,
  }))
  const bind = useDrag(({ active, movement: [x] }) =>
    api.start({
      x: active ? x : 0,
      scale: active ? 1.1 : 1,
      ...(x < 0 ? left : right),
      immediate: name => active && name === 'x',
    })
  ) 

  const avSize = x.to({
    map: Math.abs,
    range: [50, 300],
    output: [0.5, 1],
    extrapolate: 'clamp',
  })


  return (
    <animated.div {...bind()} style={{ background: bg }}>
      <animated.div style={{ scale: avSize, justifySelf }} />
      <animated.div style={{ x, scale }}>
        {children}
      </animated.div>
    </animated.div>
  )
}

export default Slider 