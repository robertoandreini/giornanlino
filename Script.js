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
        
        // Trasformiamo il testo CSV in righe e saltiamo l'intestazione
        const righe = testo.split('\n').slice(1); 
        const contenitore = document.getElementById('bacheca-articoli');
        
        if (!contenitore) return; // Esce se l'ID non esiste nell'HTML

        // Puliamo la bacheca prima di caricare
        contenitore.innerHTML = '';

        righe.forEach((riga, i) => {
            // Questa Regex serve a dividere per virgola SENZA rompere il testo se ci sono virgole dentro le frasi
            const colonne = riga.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            if (colonne.length >= 4) {
                // Puliamo i dati da eventuali virgolette extra
                const titolo = colonne[0].replace(/^"|"$/g, '');
                const categoria = colonne[1].replace(/^"|"$/g, '');
                const autore = colonne[2].replace(/^"|"$/g, '');
                const testoArticolo = colonne[3].replace(/^"|"$/g, '');

                // Creiamo l'elemento dell'articolo (il "item" che avevi prima)
                const item = document.createElement('div');
                item.className = 'item'; // Usiamo la tua classe CSS esistente
                
                // Effetto entrata fluida
                item.style.opacity = "0";
                item.style.transform = "translateY(20px)";
                item.style.transition = "all 0.5s ease";
                item.style.marginBottom = "20px";

                item.innerHTML = `
                    <span style="color: #007bff; font-weight: bold; font-size: 0.8rem; text-transform: uppercase;">${categoria}</span>
                    <h3 style="margin: 5px 0;">${titolo}</h3>
                    <p style="font-size: 0.95rem; color: #333;">${testoArticolo}</p>
                    <small style="color: #777;">Di: <strong>${autore}</strong></small>
                    <hr style="margin-top: 15px; border: 0; border-top: 1px solid #eee;">
                `;

                contenitore.appendChild(item);

                // Attiviamo l'animazione dopo un brevissimo delay
                setTimeout(() => {
                    item.style.opacity = "1";
                    item.style.transform = "translateY(0)";
                }, i * 150);
            }
        });
    } catch (err) {
        console.error("Errore nel caricamento dati dal comitato:", err);
        const contenitore = document.getElementById('bacheca-articoli');
        if (contenitore) contenitore.innerHTML = "<p>Errore nel caricamento delle notizie.</p>";
    }
}

// Avvia il caricamento
caricaArticoli();