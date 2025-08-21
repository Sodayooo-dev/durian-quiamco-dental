document.addEventListener('DOMContentLoaded', () => {
  const nextBtn = document.getElementById('goNext');
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const dateInput = document.getElementById('appointmentDate');
  const timeSelect = document.getElementById('appointmentTime');
  const summary = document.getElementById('apptSummary');
  const hiddenDate = document.getElementById('hiddenAppointmentDate');
  const hiddenTime = document.getElementById('hiddenAppointmentTime');
  const form = document.getElementById('bookingForm');

  // Prevent selecting past dates
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;

  nextBtn.addEventListener('click', () => {
    const dateVal = dateInput.value;
    const timeVal = timeSelect.value;

    if (!dateVal || !timeVal) {
      alert('Please select both a date and a time.');
      return;
    }

    // Fill hidden inputs for PHP later
    hiddenDate.value = dateVal;
    hiddenTime.value = timeVal;

    // Show summary (pretty time)
    const prettyTime = prettyTimeLabel(timeVal);
    summary.textContent = `Appointment: ${formatDateHuman(dateVal)} at ${prettyTime}`;

    // Swap steps
    step1.classList.remove('active');
    step2.classList.add('active');
  });

  // For now, prevent real submission; remove e.preventDefault() to enable PHP post
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // <-- remove this line when process_booking.php is ready
    alert('Your appointment request has been captured.\n(Connect PHP to submit for real.)');
  });

  function prettyTimeLabel(value) {
    // value like "14:00" -> "2:00 PM"
    const [h, m] = value.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = ((h + 11) % 12) + 1;
    return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
    }

  function formatDateHuman(iso) {
    const d = new Date(iso);
    const opts = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString(undefined, opts);
  }
});
