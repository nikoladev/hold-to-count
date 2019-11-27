import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import './App.css'

// counter resets at this value
const LIMIT = 24
// after how much ms the counter decrements/increments
const INTERVAL = 100
// how much ms the user has to hold the button to start decrementing/incrementing automatically
const COUNT_FROM = 500

function increment (num) {
  num = (num + 1) % LIMIT
  return num
}

function decrement (num) {
  num = (num - 1) % LIMIT
  if (num < 0) {
    num = LIMIT - 1
  }
  return num
}

// Modified from: https://codesandbox.io/embed/confident-williams-kdzdk
function useInterval(callback, delay) {
  const savedCallback = useRef()
  const intervalId = useRef(null)
  const [ running, setRunningInner ] = useState(false)

  const setRunning = useCallback(
    (bool) => setRunningInner(bool),
    []
  )

  const clear = useCallback(() => clearInterval(intervalId.current), [])

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback
  }, [ callback ])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (!running) {
        return
      }
      savedCallback.current()
    }

    if (intervalId.current) {
      clear()
    }

    if (running) {
      intervalId.current = setInterval(tick, delay)
    }

    return clear
  }, [ delay, clear, running ])

  return [ running, setRunning ]
}

function DeOrIncrementButton ({ setNumber, deOrIncrementFunction, children }) {
  // how long the user has held the button
  const [ holdTimer, setHoldTimer ] = useState(0)

  const [ , setRunning ] = useInterval(() => {
    // only start counting after user holds the button for a bit
    if (holdTimer >= COUNT_FROM) {
      setNumber(deOrIncrementFunction)
    }
    setHoldTimer((prevTimer) => prevTimer + INTERVAL)
  }, INTERVAL)

  function onPress (evt) {
    // immediately increment timer once on first touch
    setNumber(deOrIncrementFunction)
    setRunning(true)
  }

  function onRelease (evt) {
    setRunning(false)
    // reset holdTimer
    setHoldTimer(0)
  }

  return (
    <button
      className='button'
      // for devices with a mouse
      onMouseDown={onPress}
      onMouseUp={onRelease}
      // for touch devices
      onTouchStart={onPress}
      onTouchEnd={onRelease}
    >
      {children}
    </button>
  )
}

function App() {
  const [ number, setNumber ] = useState(0)
  const formatNumber = (num) => ('00' + num).slice(-2)

  return (
    <div
      id='wrapper'
    >
      <DeOrIncrementButton
        setNumber={setNumber}
        deOrIncrementFunction={increment}
      >
        +
      </DeOrIncrementButton>
      <div>
        {formatNumber(number)}
      </div>
      <DeOrIncrementButton
        setNumber={setNumber}
        deOrIncrementFunction={decrement}
      >
        -
      </DeOrIncrementButton>
    </div>
  )
}

export default App
