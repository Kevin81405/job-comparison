// Get the main buttons
const compareButton = document.getElementById("compareButton");
const newComparisonButton = document.getElementById("newComparisonButton");

// Get the main sections
const compareSection = document.getElementById("compare");
const resultsSection = document.getElementById("results");


// ----------------------------------------------------
// COMPARE JOBS
// ----------------------------------------------------

compareButton.addEventListener("click", async function () {

    // Get everything the user entered
    const jobTitle1 = document.getElementById("jobTitle1").value.trim();
    const company1 = document.getElementById("company1").value.trim();
    const description1 = document.getElementById("description1").value.trim();

    const jobTitle2 = document.getElementById("jobTitle2").value.trim();
    const company2 = document.getElementById("company2").value.trim();
    const description2 = document.getElementById("description2").value.trim();


    // Make sure both descriptions were entered
    if (description1 === "" || description2 === "") {
        alert("Please paste both job descriptions before comparing.");
        return;
    }


    // Tell the user something is happening
    compareButton.textContent = "Analyzing jobs...";
    compareButton.disabled = true;


    try {

        // Send the descriptions to OUR backend
        const response = await fetch("/api/compare", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                job1: description1,
                job2: description2
            })

        });


        // Check whether the server returned an error
        if (!response.ok) {
            throw new Error("The comparison could not be completed.");
        }


        // Convert the server response from JSON
        // into a JavaScript object
        const data = await response.json();


        // ----------------------------------------
        // JOB HEADERS
        // ----------------------------------------

        document.getElementById("resultTitle1").textContent =
            jobTitle1 || "Job One";

        document.getElementById("resultCompany1").textContent =
            company1 || "Company not provided";


        document.getElementById("resultTitle2").textContent =
            jobTitle2 || "Job Two";

        document.getElementById("resultCompany2").textContent =
            company2 || "Company not provided";


        // ----------------------------------------
        // JOB 1 RESULTS
        // ----------------------------------------

        document.getElementById("salary1").textContent =
            data.job1.salary;

        document.getElementById("workStyle1").textContent =
            data.job1.workStyle;

        document.getElementById("location1").textContent =
            data.job1.location;

        document.getElementById("experience1").textContent =
            data.job1.experience;

        document.getElementById("education1").textContent =
            data.job1.education;

        document.getElementById("skills1").textContent =
            data.job1.skills;

        document.getElementById("benefits1").textContent =
            data.job1.benefits;


        // ----------------------------------------
        // JOB 2 RESULTS
        // ----------------------------------------

        document.getElementById("salary2").textContent =
            data.job2.salary;

        document.getElementById("workStyle2").textContent =
            data.job2.workStyle;

        document.getElementById("location2").textContent =
            data.job2.location;

        document.getElementById("experience2").textContent =
            data.job2.experience;

        document.getElementById("education2").textContent =
            data.job2.education;

        document.getElementById("skills2").textContent =
            data.job2.skills;

        document.getElementById("benefits2").textContent =
            data.job2.benefits;


        // Comparison summary
        document.getElementById("comparisonSummary").textContent =
            data.summary;


        // Show results
        resultsSection.classList.add("show");


        // Move the screen down to the results
        resultsSection.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while comparing the jobs. Please try again."
        );

    } finally {

        // Change the button back whether it worked or failed
        compareButton.innerHTML =
            'Compare jobs <span>→</span>';

        compareButton.disabled = false;

    }

});


// ----------------------------------------------------
// START NEW COMPARISON
// ----------------------------------------------------

newComparisonButton.addEventListener("click", function () {

    // Hide old results
    resultsSection.classList.remove("show");


    // Clear Job 1
    document.getElementById("jobTitle1").value = "";
    document.getElementById("company1").value = "";
    document.getElementById("description1").value = "";


    // Clear Job 2
    document.getElementById("jobTitle2").value = "";
    document.getElementById("company2").value = "";
    document.getElementById("description2").value = "";


    // Go back to the input section
    compareSection.scrollIntoView({
        behavior: "smooth"
    });

});