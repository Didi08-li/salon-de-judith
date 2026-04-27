// Small helper script: current year and smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function(){
  // Set current year in footer
  var y = new Date().getFullYear();
  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click', function(e){
      var target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Mobile nav toggle
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');
  if(navToggle && mainNav){
    navToggle.addEventListener('click', function(){
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      mainNav.classList.toggle('active');
      // move focus to first link when opening
      if(!expanded){
        var first = mainNav.querySelector('a');
        if(first) first.focus();
      }
    });
  }

  // Booking form handling
  var bookingForm = document.getElementById('booking-form');
  var bookingSuccess = document.getElementById('booking-success');
  // URL corrigée
  var GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwE2NMf1GoT0bYVPeHY66jiih_jAELB1ev6tj5vXSZ77OJ9hLjYLWqEhtAJTcDwwR_3GQ/exec';

  if(bookingForm){
    bookingForm.addEventListener('submit', function(e){
      e.preventDefault();
      var form = this;
      
      // Validation
      if(!form.name.value.trim() || !form.phone.value.trim() || !form.service.value){
        alert('Veuillez renseigner votre nom, téléphone et choisir un service.');
        return;
      }

      // Prépare les données
      var data = {
        name: form.name.value,
        phone: form.phone.value,
        service: form.service.value,
        date: form.date.value || '',
        time: form.time.value || '',
        message: form.message.value || ''
      };

      // Envoie à Google Apps Script
      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(function(resp){ return resp.json(); })
      .then(function(result){
        if(result.status === 'success'){
          form.reset();
          if(bookingSuccess) bookingSuccess.classList.remove('hidden');
          // Masquer le message après 5 secondes
          setTimeout(function(){
            if(bookingSuccess) bookingSuccess.classList.add('hidden');
          }, 5000);
        } else {
          alert('Erreur : ' + (result.message || 'Impossible d\'envoyer la demande'));
        }
      })
      .catch(function(err){
        alert('Erreur de connexion. Veuillez réessayer ou appeler le salon.');
        console.error(err);
      });
    });
  }

  // Bookings list handling (optionnel)
  var loadBookingsBtn = document.getElementById('load-bookings');
  var bookingsList = document.getElementById('bookings-list');
  var bookingsTbody = document.getElementById('bookings-tbody');

  if(loadBookingsBtn && bookingsList && bookingsTbody){
    loadBookingsBtn.addEventListener('click', function(){
      fetch(GOOGLE_APPS_SCRIPT_URL)
      .then(function(resp){ return resp.json(); })
      .then(function(result){
        if(result.status === 'success'){
          bookingsTbody.innerHTML = '';
          result.bookings.forEach(function(booking){
            var row = document.createElement('tr');
            booking.forEach(function(cell){
              var td = document.createElement('td');
              td.textContent = cell;
              row.appendChild(td);
            });
            bookingsTbody.appendChild(row);
          });
          bookingsList.classList.remove('hidden');
        } else {
          alert('Erreur : ' + (result.message || 'Impossible de charger les réservations'));
        }
      })
      .catch(function(err){
        alert('Erreur de connexion. Veuillez réessayer.');
        console.error(err);
      });
    });
  }
});