/* import { cacheLife } from 'next/cache'; */

const RandomPage = () => {
    'use cache'; // Esto es para que nextjs sepa que esta pagina es estatica y no se vuelva a generar
    
    /* cacheLife({
        stale:5, // Tiempo en segundos que la pagina puede estar stale antes de ser regenerada
        revalidate:10, // Tiempo en segundos que la pagina puede estar revalidada antes de ser regenerada
        expire: 60 // Tiempo en segundos que la pagina puede estar en cache antes de ser eliminada
    }) */
    
    const random = Math.floor(Math.random() * 100) + 1;
    const now = Date.now();
    const date = new Date(now).toLocaleString();
    const uuid = crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
  return (
    <div>
        <p>Random: {random}</p>
        <p>now: {now}</p>
        <p>Date: {date}</p>
        <p>UUID: {uuid}</p>
        <p>Bytes: {Array.from(bytes).join(', ')}</p>
    </div>
  )
}

export default RandomPage;