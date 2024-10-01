// Add an event listener for the form submission
document.getElementById('add-member-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const profileLink = document.getElementById('profile-link').value;
    addMember(profileLink);
});

async function addMember(profileLink) {
    // Log the submitted profile link
    console.log("Form submitted with profile link:", profileLink);

    const regex = /https:\/\/raider.io\/characters\/([^/]+)\/([^/]+)/;
    const match = profileLink.match(regex);

    if (match) {
        const realm = match[1];
        const characterName = match[2];

        // Construct the API URL
        const apiUrl = `https://raider.io/api/characters/profile?region=us&realm=${realm}&name=${characterName}&fields=mythic_plus_scores,specializations`;

        try {
            console.log("Fetching data from:", apiUrl); // Log the API URL
            const response = await fetch(apiUrl);

            // Initialize a row with just the character name
            const leaderboard = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];
            const row = leaderboard.insertRow();
            row.insertCell(0).innerText = characterName; // Populate character name

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Throw an error if the response is not ok
            }

            const data = await response.json();

            // Populate the row with the rest of the data, if available
            row.insertCell(1).innerText = data.realm || 'Unknown Realm'; // Realm
            row.insertCell(2).innerText = data.class || 'Unknown Class'; // Class
            row.insertCell(3).innerText = (data.specializations && data.specializations.length > 0)
                ? data.specializations[0].name 
                : 'Unknown Spec'; // Specialization
            row.insertCell(4).innerText = data.mythic_plus_scores.all || 0; // Mythic+ score
        } catch (error) {
            console.error("Error fetching member data: ", error);
            alert("An error occurred while fetching the member data. Please check the console for details.");
            // If the fetch fails, still populate the row with the character's name
            row.insertCell(1).innerText = 'Error'; // Realm
            row.insertCell(2).innerText = 'Error'; // Class
            row.insertCell(3).innerText = 'Error'; // Specialization
            row.insertCell(4).innerText = 0; // Mythic+ score
        }
    } else {
        alert('Invalid Raider.io profile link!');
    }
}
