import { useState } from 'react'
import { gql } from '@apollo/client'
import { useLazyQuery } from '@apollo/client/react'
import './App.css'

const FIZZBUZZ_RANGE = gql`
  query FizzbuzzRange($n: Int!) {
    fizzbuzzRange(n: $n)
  }
`

function App() {
  const [number, setNumber] = useState('')
  const [fetchFizzbuzz, { loading, error, data }] = useLazyQuery(FIZZBUZZ_RANGE)

  const handleSubmit = (e) => {
    e.preventDefault()
    const n = parseInt(number, 10)
    if (n > 0) {
      fetchFizzbuzz({ variables: { n } })
    }
  }

  return (
    <div className="app">
      <h1>FizzBuzz</h1>
      <p className="subtitle">React + Apollo Client + Rails GraphQL</p>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="number"
          min="1"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter a number"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Go'}
        </button>
      </form>

      {error && (
        <div className="error">
          <p>Something went wrong: {error.message}</p>
          <p>Make sure the Rails server is running on port 3000.</p>
        </div>
      )}

      {data && (
        <div className="results">
          <h2>Results (1 to {number})</h2>
          <div className="grid">
            {data.fizzbuzzRange.map((result, index) => (
              <div
                key={index}
                className={`cell ${result === 'Fizz' ? 'fizz' : ''} ${result === 'Buzz' ? 'buzz' : ''} ${result === 'FizzBuzz' ? 'fizzbuzz' : ''}`}
              >
                <span className="number">{index + 1}</span>
                <span className="value">{result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
