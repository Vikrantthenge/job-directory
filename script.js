const searchBtn = document.getElementById("searchBtn");
const jobContainer = document.getElementById("jobContainer");

const RAPID_API_KEY = "02bbbfb0a7msh85c09c88e6db3d1p11c6acjsnb81aab1a52b6"; // Replace with your actual key

async function fetchJobs(keyword, location) {
  jobContainer.innerHTML = "<p>Loading jobs...</p>";

  const url = `https://jsearch.p.rapidapi.com/search?query=${keyword}+in+${location}&page=1&num_pages=1`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "jsearch.p.rapidapi.com"
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    displayJobs(data.data);
  } catch (error) {
    jobContainer.innerHTML = `<p>Error fetching jobs. Check your API key or internet.</p>`;
    console.error(error);
  }
}

function displayJobs(jobs) {
  if (!jobs || jobs.length === 0) {
    jobContainer.innerHTML = "<p>No jobs found. Try a different keyword or location.</p>";
    return;
  }

  jobContainer.innerHTML = jobs.map(job => `
    <div class="job-card">
      <h3>${job.job_title}</h3>
      <p><strong>${job.employer_name || "Company not specified"}</strong></p>
      <p>${job.job_city || ""}, ${job.job_country || ""}</p>
      <p>Salary: ${job.job_salary_currency || ""} ${job.job_min_salary || ""} - ${job.job_max_salary || ""}</p>
      <a class="apply-btn" href="${job.job_apply_link}" target="_blank">Apply Now</a>
    </div>
  `).join("");
}

searchBtn.addEventListener("click", () => {
  const keyword = document.getElementById("keyword").value.trim();
  const location = document.getElementById("location").value.trim();
  if (keyword) fetchJobs(keyword, location || "India");
});
