// Link del Database Google Sheets
const urlDatabase = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSqHK1Ms4zXkFRUkKEDmvdtafufLeJKbCTbkKTu_9LbRA18js99l-Z2pXt94ce1xfSjQVWP7I1Yp7AC/pub?output=csv";

// --- FUNZIONI PER IL MENU ---
function openNav() {
    const sidebar = document.getElementById("mySidebar");
    if(sidebar) sidebar.style.width = "250px";
}

function closeNav() {
    const sidebar = document.getElementById("mySidebar");
    if(sidebar) sidebar.style.width = "0";
}

// --- DATA NELLA TESTATA ---
document.addEventListener("DOMContentLoaded", function() {
    const dateSpan = document.getElementById("current-date");
    if (dateSpan) {
        const oggi = new Date();
        const opzioni = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateSpan.textContent = oggi.toLocaleDateString('it-IT', opzioni);
    }
    // Avvia il caricamento appena il DOM è pronto
    caricaArticoli();
});

// --- FUNZIONE CONDIVIDI ---
function condividiArticolo(titolo, testo) {
    if (navigator.share) {
        navigator.share({
            title: titolo,
            text: `${titolo.toUpperCase()}\n\n${testo}`,
            url: window.location.href
        }).catch((err) => console.log('Errore share:', err));
    } else {
        alert("Copia il link del sito per condividere!");
    }
}

// --- CARICAMENTO ARTICOLI DAL DATABASE ---
async function caricaArticoli() {
    try {
        const risposta = await fetch(urlDatabase);
        const testo = await risposta.text();
        
        // Pulizia righe: rimuoviamo righe vuote e prendiamo i dati
        const righe = testo.split('\n').filter(r => r.trim() !== '').slice(1); 
        const contenitore = document.getElementById('bacheca-articoli');
        
        if (!contenitore) {
            console.error("ERRORE: Non trovo l'elemento 'bacheca-articoli' nell'HTML!");
            return;
        }
        
        contenitore.innerHTML = ''; // Svuota il caricamento precedente

        righe.forEach((riga, i) => {
            // Regex per dividere correttamente le colonne del CSV
            const colonne = riga.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            if (colonne.length >= 4) {
                const titolo = colonne[0].replace(/^"|"$/g, '').trim();
                const categoria = colonne[1].replace(/^"|"$/g, '').toLowerCase().trim();
                const autore = colonne[2].replace(/^"|"$/g, '').trim();
                const testoArticolo = colonne[3].replace(/^"|"$/g, '').trim();
                const linkImmagine = colonne[4] ? colonne[4].replace(/^"|"$/g, '').trim() : "";

                // Creazione elemento card
                const item = document.createElement('div');
                item.className = 'item card-articolo';
                
                let classeColore = "badge-default";
                if (categoria.includes("sport")) classeColore = "badge-sport";
                else if (categoria.includes("scuola")) classeColore = "badge-scuola";
                else if (categoria.includes("gossip")) classeColore = "badge-gossip";
                else if (categoria.includes("eventi")) classeColore = "badge-eventi";

                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="badge ${classeColore}" style="padding: 2px 8px; border-radius: 4px; color: white; font-weight: bold; font-size: 0.75rem; text-transform: uppercase;">
                            ${categoria}
                        </span>
                        <button class="btn-share" style="background: none; border: none; cursor: pointer; font-size: 1.1rem; opacity: 0.7;">
                            📤
                        </button>
                    </div>
                    <div class="item-contenuto" style="display: flex; justify-content: space-between; gap: 10px; margin-top: 10px;">
                        <div class="testo-articolo" style="flex: 1;">
                            <h3 style="margin: 0 0 5px 0;">${titolo}</h3>
                            <p style="font-size: 0.9rem; color: #333; margin: 0; line-height: 1.4;">${testoArticolo}</p>
                        </div>
                        ${linkImmagine ? `<img src="${linkImmagine}" class="img-anteprima" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; flex-shrink: 0;">` : ''}
                    </div>
                    <small style="display: block; margin-top: 10px; color: #777;">Di: <strong>${autore}</strong></small>
                    <hr style="margin-top: 15px; border: 0; border-top: 1px solid #eee;">
                `;

                // Gestore click per il tasto share
                const shareBtn = item.querySelector('.btn-share');
                shareBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    condividiArticolo(titolo, testoArticolo);
                });

                contenitore.appendChild(item);

                // Animazione entrata (Framer Motion style)
                item.animate([
                    { opacity: 0, transform: 'translateY(20px) scale(0.98)' },
                    { opacity: 1, transform: 'translateY(0) scale(1)' }
                ], {
                    duration: 500,
                    delay: i * 80,
                    easing: 'ease-out',
                    fill: 'forwards'
                });
            }
        });
    } catch (err) {
        console.error("Errore fatale:", err);
    }
}