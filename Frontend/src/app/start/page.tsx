async function getData() {
    const res = await fetch('http://localhost:3000/start')
  
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      const errorText = await res.text()

      return "Error fetching data: " + errorText
    }
  
    return res.text()
  }
   
  export default async function Page() {
    const result = await getData()
   
    return <main><h1>The text says: {result}</h1></main>
  }