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
  let allergies = "";

  // Prevent selecting past dates
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;

  //FOR ALLERGIES CHECKING
  function checkAllergies() {
    const localAnesthetic = document.getElementById("locAnesth");
    const aspirin = document.getElementById("aspirin");
    const penicillin = document.getElementById("penicillin");
    const latex = document.getElementById("latex");
    const sulfaDrugs = document.getElementById("sulfa");
    
    if (localAnesthetic.checked) {
      allergies += ", Local Anesthetic";
    }
    if (aspirin.checked) {
      allergies += ", Aspirin";
    }
    if (penicillin.checked) {
      allergies += ", Penicillin";
    }
    if (latex.checked) {
      allergies += ", Latex";
    }
    if (sulfaDrugs.checked) {
      allergies += ", Sulfa Drugs";
    }
    //Other Allergies
    if (document.getElementById("otherAllergiesCB").checked) {
      allergies += ", " + document.getElementById("otherAllergies").value;
    }

    if (allergies != "") {
      allergies = allergies.slice(2);
    } else {
      allergies = "None";
    }
    return allergies;
  }

  //For option "others" Event Listener
  document.getElementById("otherAllergiesCB").addEventListener("change", (e) => {
    if (document.getElementById("otherAllergiesCB").checked) {
      document.getElementById("otherAllergies").disabled = false;
    } else {
      document.getElementById("otherAllergies").disabled = true;
      document.getElementById("otherAllergies").value = "";
    }
    
  });

  //Input Checking for women
  function pregnant() {
    if (document.getElementById("pregy").checked) {
      return "Yes";
    } else {
      return "No";
    }
  }
  function nursing() {
    if (document.getElementById("nurs").checked) {
      return "Yes";
    } else {
      return "No";
    }
  }
  function birthContPills() {
    if (document.getElementById("bcpills").checked) {
      return "Yes";
    } else {
      return "No";
    }
  }

  // INPUT CHECKING IF NULL
  function checkInput(input) {
    if (input === null || input.trim() === "") {
      return "N/A";
    }
    return input;
  }
  
  function dateValid() {
    if (document.getElementById("lastVisit").value === null || document.getElementById("lastVisit").value === "") {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const formatted = `${yyyy}-${mm}-${dd}`;
      return formatted;
    } else {
      return document.getElementById("lastVisit").value;
    }
  }

  //FOR DATABASE
  function submitDataToDB() {
    const getVal = id => document.getElementById(id).value;
    const getOpt = id => checkInput(getVal(id));

    let formData = {
      // Required
      name: getVal("name"),
      birthdate: getVal("birthdate"),
      age: getVal("age"),
      sex: getVal("sex"),
      homeAddress: getVal("homeAddress"),
      mobile: getVal("mobile"),
      // Optional
      religion: getOpt("religion"),
      nationality: getOpt("nationality"),
      occupation: getOpt("occupation"),
      email: getOpt("email"),
      refBy: getOpt("referrer"),
      prevDent: getOpt("prevDentist"),
      lastDentVisit: dateValid(),
      resForConsult: getOpt("reason"),
      physician: getOpt("physician"),
      officeContact: getOpt("physicianOffice"),
      medications: getOpt("medications"),
      allergy: checkAllergies(),
      bloodType: getOpt("bloodType"),
      bloodPressure: getOpt("bloodPressure"),
      pregy: pregnant(),
      nurs: nursing(),
      bcpills: birthContPills(),
      undr_trtmnt: document.getElementById("gHealthN").checked ? getOpt("medCondition") : "N/A",
      surgery: document.getElementById("hoSurY").checked ? getOpt("surgeryDetails") : "N/A"
    };

    let params = new URLSearchParams(formData);

    fetch("./js/personal_info_to_db.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    })
    .then(response => response.text())
    .then(data => alert(data));
  }


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
    submitDataToDB();
  });

  //EVENT LISTENER FOR THE RADIO BUTTONS
  //Good Health
  document.getElementById("gHealthY").addEventListener("change", (e) => {
    document.getElementById("medCondition").disabled = true;
    document.getElementById("medCondition").value = "";
  });
  document.getElementById("gHealthN").addEventListener("change", (e) => {
    document.getElementById("medCondition").disabled = false;
  });

  //Hospitalized
  document.getElementById("hoSurY").addEventListener("change", (e) => {
    document.getElementById("surgeryDetails").disabled = false;
  });
  document.getElementById("hoSurN").addEventListener("change", (e) => {
    document.getElementById("surgeryDetails").disabled = true;
    document.getElementById("surgeryDetails").value = "";
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
