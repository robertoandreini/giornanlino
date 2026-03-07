righe.forEach((riga, i) => {
            const colonne = riga.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            if (colonne.length >= 4) {
                const titolo = colonne[0].replace(/^"|"$/g, '').trim();
                const categoria = colonne[1].replace(/^"|"$/g, '').toLowerCase().trim();
                const autore = colonne[2].replace(/^"|"$/g, '').trim();
                const testoArticolo = colonne[3].replace(/^"|"$/g, '').trim();
                const linkImmagine = colonne[4] ? colonne[4].replace(/^"|"$/g, '').trim() : "";

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
                            <p style="font-size: 0.9rem; color: #333; margin: 0;">${testoArticolo}</p>
                        </div>
                        ${linkImmagine ? `<img src="${linkImmagine}" class="img-anteprima" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">` : ''}
                    </div>
                    <small style="display: block; margin-top: 10px; color: #777;">Di: <strong>${autore}</strong></small>
                    <hr style="margin-top: 15px; border: 0; border-top: 1px solid #eee;">
                `;

                // --- GESTIONE CLICK CONDIVISIONE (Senza errori di sintassi) ---
                const shareBtn = item.querySelector('.btn-share');
                shareBtn.addEventListener('click', () => {
                    condividiArticolo(titolo, testoArticolo);
                });

                contenitore.appendChild(item);

                // --- ANIMAZIONE ---
                item.animate([
                    { opacity: 0, transform: 'translateY(30px) scale(0.95)' }, 
                    { opacity: 1, transform: 'translateY(0) scale(1)' }        
                ], {
                    duration: 600,
                    delay: i * 100, 
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    fill: 'forwards'
                });
            }
        });