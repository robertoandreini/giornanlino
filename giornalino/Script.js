// Funzioni per il Menu
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

// Inserisce la data di oggi nella testata
document.addEventListener("DOMContentLoaded", function() {
    const dateSpan = document.getElementById("current-date");
    const oggi = new Date();
    const opzioni = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateSpan.textContent = oggi.toLocaleDateString('it-IT', opzioni);
});