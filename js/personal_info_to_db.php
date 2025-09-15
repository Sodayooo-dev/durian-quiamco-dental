<?php
$servername = "localhost:3306";
$username = "root";
$password = "hyowawa123";
$dbname = "durian_quiamco";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//Required
$name = $_REQUEST['name'] ?? null;
$birthdate = $_REQUEST['birthdate'] ?? null;
$age = $_REQUEST['age'] ?? null;
$sex = $_REQUEST['sex'] ?? null;
$homeAddress = $_REQUEST['homeAddress'] ?? null;
$mobile = $_REQUEST['mobile'] ?? null;
//Optional
$religion = $_REQUEST['religion'] ?? null;
$nationality = $_REQUEST['nationality'] ?? null;
$occupation = $_REQUEST['occupation'] ?? null;
$email = $_REQUEST['email'] ?? null;
$refBy = $_REQUEST['refBy'] ?? null;
$prevDent = $_REQUEST['prevDent'] ?? null;
$lastDentVisit = $_REQUEST['lastDentVisit'] ?? null;
$resForConsult = $_REQUEST['resForConsult'] ?? null;
$physician = $_REQUEST['physician'] ?? null;
$officeContact = $_REQUEST['officeContact'] ?? null;
$medications = $_REQUEST['medications'] ?? null;
$allergy = $_REQUEST['allergy'] ?? null;
$bloodType = $_REQUEST['bloodType'] ?? null;
$bloodPressure = $_REQUEST['bloodPressure'] ?? null;
$pregy = $_REQUEST['pregy'] ?? null;
$nurs = $_REQUEST['nurs'] ?? null;
$bcpills = $_REQUEST['bcpills'] ?? null;
$undr_trtmnt = $_REQUEST['undr_trtmnt'] ?? null;
$surgery = $_REQUEST['surgery'] ?? null;



// SQL insert
if (!empty($name) && !empty($birthdate) && !empty($age) && 
    !empty($sex) && !empty($homeAddress) && !empty($mobile)) {
    $stmt = $conn->prepare("INSERT INTO patient (
        full_name, birthdate, age, sex, home_add, contact_no, und_treatment,
        religion, nationality, occupation, email, refby, prev_dentist, last_dent_visit,
        res_for_cons, physician_name, office_cont, cur_med, allergies, blood_type, blood_pressure,
        pregnant, nursing, bir_con_pills, hos_sur
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?
    )");

    $stmt->bind_param("ssississssssssssssssissss",
        $name, $birthdate, $age, $sex, $homeAddress, $mobile, $undr_trtmnt,
            $religion, $nationality, $occupation, $email, $refBy, $prevDent, $lastDentVisit,
            $resForConsult, $physician, $officeContact, $medications, $allergy, $bloodType, $bloodPressure,
            $pregy, $nurs, $bcpills, $surgery
        );
    
    if ($stmt->execute()) {
        echo "Personal details saved";
    } else {
        echo "Error";
    }
    $stmt->close();
} else {
    echo "There's a missing input.";
}

$conn->close();
?>
