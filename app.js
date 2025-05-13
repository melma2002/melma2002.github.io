let totalVotes, akura, totalEdres, dunameis;

document.getElementById('votes-edres').addEventListener('submit', function(event) {
    event.preventDefault();

    // Παίρνουμε τις τιμές και τις αποθηκεύουμε global
    totalVotes = parseFloat(document.getElementById('votes').value);
    akura = parseFloat(document.getElementById('akura').value);
    totalEdres = parseInt(document.getElementById('edres').value);
    dunameis = parseInt(document.getElementById('dunameis').value);

    // Κρύβουμε την πρώτη φόρμα και εμφανίζουμε τη δεύτερη
    document.getElementById('votes-edres').style.display = 'none';
    document.getElementById('second-form').style.display = 'block';

    const partiesContainer = document.getElementById('parties-container');
    partiesContainer.innerHTML = '';

    for (let i = 1; i <= dunameis; i++) {
        const row = document.createElement('div');
        row.className = 'party-row';

        // Δημιουργία στοιχείων
        const nameField = document.createElement('div');
        nameField.innerHTML = `<label>Όνομα ${i}:<input type="text" id="party${i}_name" required></label>`;

        const votesField = document.createElement('div');
        votesField.innerHTML = `<label>Ψήφοι:<input type="number" id="party${i}_votes" required></label>`;

        const choiceField = document.createElement('div');
        const select = document.createElement('select');
        select.id = `party${i}_choice`;
        ['ΔΑΠ', 'ΠΚΣ', 'ΠΑΣΠ','ΕΑΑΚ','ATTACK', 'ΡΕΒΑΝΣ','ΣΑΣ', 'ΑΛΛΑ ΔΕΞΙΑ', 'ΑΛΛΑ ΑΡΙΣΤΕΡΑ', 'ΔΙΚΤΥΟ','ΑΓΩΝΙΣΤΙΚΕΣ', 'ΣΣΠ','ΠΟΡΕΙΑ']
        .forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            select.appendChild(opt);
        });
        choiceField.appendChild(select);

        // Σύνθεση
        row.appendChild(nameField);
        row.appendChild(votesField);
        row.appendChild(choiceField);
        partiesContainer.appendChild(row);
    }
});


document.getElementById('second-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const resultsContainer = document.getElementById('results');
    let metro = (totalVotes - akura) / totalEdres;

    let partyVotes = [], upoloipo = [], edresPerParty = new Array(dunameis + 1).fill(0);
    let edresLeft = totalEdres;

    for (let i = 1; i <= dunameis; i++) {
        const votes = parseFloat(document.getElementById(`party${i}_votes`).value);
        partyVotes[i] = votes;
        edresPerParty[i] = Math.floor(votes / metro);
        upoloipo[i] = (votes / metro) - edresPerParty[i];
        edresLeft= edresLeft - edresPerParty[i];
    }


    while (edresLeft > 0) {
        let maxUpoloipo = -1;
        let maxIndexes = [];
        for (let i = 1; i <= dunameis; i++) {
            if (upoloipo[i] > maxUpoloipo) {
                maxUpoloipo = upoloipo[i];
                maxIndexes = [i];
            }
            if (edresLeft==1 && upoloipo[i] == maxUpoloipo){
                maxIndexes.push(i);
            }
        if (edresLeft === 1 && maxIndexes.length > 1) {
            const partyNames = maxIndexes.map(i =>
                document.getElementById(`party${i}_name`).value || `Παράταξη ${i}`
        );

            let tieText = `<br><strong>Η τελευταία έδρα παίζεται ανάμεσα σε:</strong> ${partyNames.join(' και ')}<br>`;
            tieText += `<em>Πιθανά σενάρια κατανομής:</em><br>`;

            maxIndexes.forEach(idx => {
                let hypothetical = [...edresPerParty];
                hypothetical[idx]++;
                tieText += `${partyNames[idx - 1]} παίρνει την έδρα: `;
                for (let j = 1; j <= dunameis; j++) {
                    const name = document.getElementById(`party${j}_name`).value || `Παράταξη ${j}`;
                    tieText += `${name}: ${hypothetical[j]} | `;
                }
                tieText += `<br>`;
        });

        resultsContainer.innerHTML += tieText;
        break; // Exit the loop without assigning the last seat definitively
    }

    // Otherwise assign seat to party with max remainder
    const idx = maxIndexes[0];
    edresPerParty[idx]++;
    upoloipo[idx] = 0;
    edresLeft--;
}

    // Εμφάνιση αποτελεσμάτων
    let resultsText = 'Αποτελέσματα Εδρών:<br>';
    for (let i = 1; i <= dunameis; i++) {
        const name = document.getElementById(`party${i}_name`).value;
        resultsText += `${name || 'Παράταξη ' + i}: ${edresPerParty[i]} έδρες<br>`;
    }
    resultsContainer.innerHTML = resultsText;
});
