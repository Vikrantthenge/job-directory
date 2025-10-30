const searchBtn = document.getElementById("searchBtn");
const jobContainer = document.getElementById("jobContainer");
const loading = document.getElementById("loading");

const RAPID_API_KEY = "02bbbfb0a7msh85c09c88e6db3d1p11c6acjsnb81aab1a52b6"; // Replace this with your new valid key

async function fetchJobs(keyword, location, remote, minSalary) {
  jobContainer.innerHTML = "";
  loading.classList.remove("hidden");

  const query = `${keyword} in ${location}`;
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "jsearch.p.rapidapi.com"
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const jobs = result.data || [];

    // Apply filters
    const filteredJobs = jobs.filter(job => {
      const isRemote = remote ? job.job_is_remote : true;
      const meetsSalary = minSalary ? (job.job_min_salary || 0) >= minSalary : true;
      return isRemote && meetsSalary;
    });

    displayJobs(filteredJobs);
  } catch (error) {
    jobContainer.innerHTML = `<p>Error fetching jobs. Check API key or network.</p>`;
    console.error(error);
  } finally {
    loading.classList.add("hidden");
  }
}

function displayJobs(jobs) {
  if (jobs.length === 0) {
    jobContainer.innerHTML = "<p>No matching jobs found.</p>";
    return;
  }

  jobContainer.innerHTML = jobs.map(job => `
    <div class="job-card">
      <div>
        <h3>${job.job_title}</h3>
        <p><strong>${job.employer_name || "Company not listed"}</strong></p>
        <p>${job.job_city || ""}, ${job.job_country || ""}</p>
        <p>Salary: ${job.job_salary_currency || ""} ${job.job_min_salary || ""} - ${job.job_max_salary || ""}</p>
        <p>${job.job_description?.slice(0, 100) || ""}...</p>
      </div>
      <a class="apply-btn" href="${job.job_apply_link}" target="_blank">Apply Now</a>
    </div>
  `).join("");
}

searchBtn.addEventListener("click", () => {
  const keyword = document.getElementById("keyword").value.trim() || "Data Analyst";
  const location = document.getElementById("location").value.trim() || "India";
  const remote = document.getElementById("remoteFilter").value === "true";
  const minSalary = Number(document.getElementById("minSalary").value);

  fetchJobs(keyword, location, remote, minSalary);
});
