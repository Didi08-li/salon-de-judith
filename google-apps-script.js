// Google Apps Script — Déployer sur https://script.google.com
// Après déploiement, copiez l'URL du déploiement dans le formulaire HTML

function doPost(e) {
  try {
    // Récupère les données du formulaire
    var data = JSON.parse(e.postData.contents);
    
    // Accès à la feuille Google Sheet active
    var sheet = SpreadsheetApp.getActiveSheet();
    
    // Crée les entêtes si la feuille est vide
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date', 'Nom', 'Téléphone', 'Service', 'Date souhaitée', 'Heure souhaitée', 'Commentaire']);
    }
    
    // Ajoute la nouvelle ligne
    sheet.appendRow([
      new Date().toLocaleString('fr-FR'),
      data.name || '',
      data.phone || '',
      data.service || '',
      data.date || '',
      data.time || '',
      data.message || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Demande enregistrée avec succès'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    // Supprime l'entête si présent
    if (data.length > 0) data.shift();
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      bookings: data
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Instructions de déploiement :
// 1. Allez sur https://script.google.com
// 2. Créez un nouveau projet et collez ce code
// 3. Cliquez sur "Déployer" → "Nouvel déploiement"
// 4. Type : "Application web"
// 5. Exécuter en tant que : [votre compte]
// 6. Accès : "Tous les utilisateurs"
// 7. Cliquez sur "Déployer"
// 8. Copiez l'URL d'exécution (elle ressemble à : https://script.google.com/macros/d/.../usercontent)
// 9. Remplacez "YOUR_APPS_SCRIPT_URL" dans le formulaire HTML par cette URL
