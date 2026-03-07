// Link del Database Google Sheets
const urlDatabase = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSqHK1Ms4zXkFRUkKEDmvdtafufLeJKbCTbkKTu_9LbRA18js99l-Z2pXt94ce1xfSjQVWP7I1Yp7AC/pub?output=csv";

// --- FUNZIONI PER IL MENU ---
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

// --- DATA NELLA TESTATA ---
document.addEventListener("DOMContentLoaded", function() {
    const dateSpan = document.getElementById("current-date");
    if (dateSpan) {
        const oggi = new Date();
        const opzioni = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateSpan.textContent = oggi.toLocaleDateString('it-IT', opzioni);
    }
});

// --- CARICAMENTO ARTICOLI DAL DATABASE ---
async function caricaArticoli() {
    try {
        const risposta = await fetch(urlDatabase);
        const testo = await risposta.text();
        const righe = testo.split('\n').slice(1); 
        const contenitore = document.getElementById('bacheca-articoli');
        
        if (!contenitore) return;
        contenitore.innerHTML = '';

        righe.forEach((riga, i) => {
            const colonne = riga.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            if (colonne.length >= 4) {
                const titolo = colonne[0].replace(/^"|"$/g, '');
                const categoria = colonne[1].replace(/^"|"$/g, '').toLowerCase().trim();
                const autore = colonne[2].replace(/^"|"$/g, '');
                const testoArticolo = colonne[3].replace(/^"|"$/g, '');
                const linkImmagine = colonne[4] ? colonne[4].replace(/^"|"$/g, '').trim() : "";

                const item = document.createElement('div');
                item.className = 'item card-articolo'; // Aggiunta classe per SASS
                
                // Determina la classe del colore in base alla categoria
                let classeColore = "badge-default";
                if (categoria.includes("sport")) classeColore = "badge-sport";
                else if (categoria.includes("scuola")) classeColore = "badge-scuola";
                else if (categoria.includes("gossip")) classeColore = "badge-gossip";
                else if (categoria.includes("eventi")) classeColore = "badge-eventi";

                item.innerHTML = `
                    <span class="badge ${classeColore}" style="padding: 2px 8px; border-radius: 4px; color: white; font-weight: bold; font-size: 0.75rem; text-transform: uppercase;">
                        ${categoria}
                    </span>
                    <div class="item-contenuto" style="display: flex; justify-content: space-between; gap: 10px; margin-top: 10px;">
                        <div class="testo-articolo" style="flex: 1;">
                            <h3 style="margin: 0 0 5px 0;">${titolo}</h3>
                            <p style="font-size: 0.9rem; color: #333; margin: 0;">${testoArticolo}</p>
                        </div>
                        ${linkImmagine ? `<img src="${linkImmagine}" class="img-anteprima" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">` : ''}
                    </div>
                    <small style="display: block; margin-top: 10px; color: #777;">Di: <strong>${autore}</strong></small>
                    <hr style="margin-top: 15px; border: 0; border-top: 1px solid #eee;">
                `;

                contenitore.appendChild(item);

                // --- ANIMAZIONE STILE FRAMER MOTION ---
                // Gli elementi entrano uno dopo l'altro (i * 100) con un rimbalzo morbido
                item.animate([
                    { opacity: 0, transform: 'translateY(30px) scale(0.95)' }, // Inizio
                    { opacity: 1, transform: 'translateY(0) scale(1)' }        // Fine
                ], {
                    duration: 600,
                    delay: i * 100, 
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    fill: 'forwards'
                });
            }
        });
    } catch (err) {
        console.error("Errore nel caricamento:", err);
    }
}

// Avvia il caricamento
caricaArticoli();