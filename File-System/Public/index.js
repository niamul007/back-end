document.getElementById("ghostForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    location: document.getElementById("location").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    description: document.getElementById("description").value,
    evidence: document.getElementById("evidence").value,
  };

  try {
    const response = await fetch("/api/sightings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Report submitted successfully!");
      document.getElementById("ghostForm").reset();
    } else {
      alert("Error submitting report");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error submitting report");
  }
});
